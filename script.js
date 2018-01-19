// Created 29/01/2014 by Teh Lemon
// Background script
// Handles the background event listener for image context menus
// Adds context menu options for SauceNAO and Imgur
// Redirect Twitter image URLs to original quality
// Rename Twitter image filenames when downloading

let sauceMenuEnabled = true;
let transTextMenuEnabled = true;
let origEnabled = true;
let tfnEnabled = true;
let transFromCode = 'ja';
let transToCode = 'en';

loadSettings();

///
// Set up context menus
///
function createContextMenus()
{
	if (sauceMenuEnabled)
	{
		chrome.contextMenus.create({"title": "Search SauceNAO",
		"contexts": ["image"],
		"id": "SauceNAOMenuItem"});
	}

	if (transTextMenuEnabled)
	{
		chrome.contextMenus.create({"title": "Translate '%s' from " + transFromCode + " -> " + transToCode,
			"contexts": ["selection"],
			"id": "TranslateMenuItem"});
	}
}
createContextMenus();

// Add an event listener to the context menu item
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
			chrome.tabs.create({url: "http://translate.google.com/#" + transFromCode + "/" + transToCode + "/" + newText});
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
	
	// ignore if not enabled in settings or image is in twitter's small format as these are embeded media
	if (!origEnabled || url.includes("&name="))
	{
		return   {	
			redirectUrl: url
		};
	}
  
	// cull :large
	const i = url.lastIndexOf(':');  
	if (i > 5) 
	{
		if (/:orig$/.test(url) || /:thumb$/.test(url) && info.type === 'image') 
		{
			return;
		}

		url = url.slice(0, i);
	}

	// cull http  
	const j = url.indexOf(':');
	url = url.slice(j)

	return   {	
		redirectUrl: 'https' + url + ':orig'
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
	
	if (tfnEnabled && hasMediaTag)
	{
	  return {
		responseHeaders: [{
		  name: 'Content-Disposition',
		  value: `inline; filename="${url.slice(url.lastIndexOf('/') + 1, url.lastIndexOf(':'))}"`
		}]
	  };
	}
}

///
// Apply user options
///

chrome.storage.onChanged.addListener(storChangedHandler);
function storChangedHandler(changes, areaName)
{
	loadSettings();
	chrome.contextMenus.removeAll(createContextMenus);
}

function loadSettings()
{
	chrome.storage.local.get({
		transFromLang: "ja",
		transToLang: "en",
		sauceNao: true,
		transText: true,
		twitReDir: true,
		twitDl: true
	}, function(items) {
		transFromCode = items.transFromLang;
		transToCode = items.transToLang;
		sauceMenuEnabled = items.sauceNao;
		transTextMenuEnabled = items.transText;
		origEnabled = items.twitReDir;
		tfnEnabled = items.twitDl;
	});
	
	console.log("settings loaded");
}