// Created 29/01/2014 by Teh Lemon
// Background script
// Handles the background event listener for image context menus
// Adds context menu options for SauceNAO and Imgur
// Redirect Twitter image URLs to original quality
// Rename Twitter image filenames when downloading

/// Loaded settings
var m_translateFrom = "";
var m_translateTo = "";
var m_sauceMenuEnabled = false;
var m_translateMenuEnabled = false;
var m_twitterRedirectEnabled = false;
var m_twitterDLEnabled = false;

/// OnLoad run script
LoadSettings();

///
// Apply user options when changes are detected
///
chrome.storage.onChanged.addListener(LoadSettings);
function LoadSettings(changes, areaName)
{
	console.log("changed settings detected");

	chrome.storage.sync.get({
		transFromLang: "auto",
		transToLang: "en",
		sauceNao: true,
		transText: true,
		twitReDir: true,
		twitDl: true
	}, function(items) {
		m_translateFrom  = items.transFromLang;
		m_translateTo = items.transToLang;
		m_sauceMenuEnabled = items.sauceNao;
		m_translateMenuEnabled = items.transText;
		m_twitterRedirectEnabled = items.twitReDir;
		m_twitterDLEnabled = items.twitDl;

		// Remove context menus and remake them with the new settings
		chrome.contextMenus.removeAll(createContextMenus);

		console.log("New settings. from: " + m_translateFrom + ", to: " + m_translateTo + ". sauce: " + m_sauceMenuEnabled + ". translate: " + m_translateMenuEnabled + ". redir: " + m_twitterRedirectEnabled + ". dl: " + m_twitterDLEnabled);
	});
}

///
// Set up context menus
///
function createContextMenus()
{
	if (m_sauceMenuEnabled)
	{
		chrome.contextMenus.create({"title": "Search SauceNAO",
		"contexts": ["image"],
		"id": "SauceNAOMenuItem"});
	}

	if (m_translateMenuEnabled)
	{
		chrome.contextMenus.create({"title": "Translate '%s' from " + m_translateFrom + " -> " + m_translateTo,
			"contexts": ["selection"],
			"id": "TranslateMenuItem"});
	}
}

// Add an event listener to the context menu item for when the button is clicked
chrome.contextMenus.onClicked.addListener(onClickContextHandler);
// The onClicked callback function for context menu.
function onClickContextHandler(info) 
{	
	switch (info.menuItemId)
	{
		// If Search SauceNAO is clicked. Search SauceNAO with the image link
		case "SauceNAOMenuItem":
			chrome.tabs.create({url: "http://saucenao.com/search.php?url=" + info.srcUrl});
			break;
		// If Translate is clicked. Enter selected text into Google Translate
		case "TranslateMenuItem":
			let newText = info.selectionText.replace("%", "%25");		
			chrome.tabs.create({url: "http://translate.google.com/#" + m_translateFrom + "/" + m_translateTo + "/" + newText});
			break;

	}
};

///
// Redirect Twitter image URLs to original quality
///

// Twitter image URL
const origFilter = 
{
  urls : ['*://pbs.twimg.com/media/*']
};

chrome.webRequest.onBeforeRequest.addListener(origHandler, origFilter, ['blocking']);

function origHandler(info) 
{
	let {url} = info;

	// ignore if not enabled in settings //or image is in twitter's small format as these are embeded media
	if (!m_twitterRedirectEnabled)
	{
		return   {	
			redirectUrl: url
		};
	}

	// cull http to later replace with https
	const j = url.indexOf(':');
	url = url.slice(j);

	// cull 2019 twitter image format urls
	if (url.includes("&name"))
	{
		url = url.replace("&name=small", "&name=orig");
		url = url.replace("&name=medium", "&name=orig");
		url = url.replace("&name=large", "&name=orig");
		url = url.replace("&name=4096x4096", "&name=orig");
		url = url.replace("&name=900x900", "&name=orig");
		url = url.replace("&name=360x360", "&name=orig");
		url = url.replace("&name=240x240", "&name=orig");
		url = url.replace("&name=120x120", "&name=orig");
	}
	// cull :large
	else
	{		
		const i = url.lastIndexOf(':');  
		if (i > 5) 
		{
			if (/:orig$/.test(url) || /:thumb$/.test(url) && info.type === 'image') 
			{
				return;
			}

			url = url.slice(0, i);		
		}

		url = url + ":orig";
	}

	return   {	
		redirectUrl: 'https' + url
	};
}

chrome.webRequest.onHeadersReceived.addListener(twitFileNameHandler, {urls : ['*://pbs.twimg.com/media/*']}, ['blocking']);
function twitFileNameHandler(details) 
{
	const {url} = details;
	let hasMediaTag = false;

	if (url.includes(":thumb") || url.includes(":large") || url.includes(":orig") || url.includes(":small") || url.includes(":medium"))
	{
		hasMediaTag = true;
	}

	if (m_twitterDLEnabled && hasMediaTag)
	{
		return {
		responseHeaders: [{
			name: 'Content-Disposition',
			value: `inline; filename="${url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf(':'))}"`
		}]
		};
	}

}

