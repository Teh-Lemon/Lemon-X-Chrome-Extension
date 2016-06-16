// Created 29/01/2014 by Teh Lemon
// Background script
// Handles the background event listener for image context menus
// Adds context menu options for SauceNAO and Imgur
// Redirect Twitter image URLs to original quality
// Rename Twitter image filenames when downloading

let sauceMenuEnabled = true;
let imgurMenuEnabled = true;
let transTextMenuEnabled = true;
let origEnabled = true;
let tfnEnabled = true;
let transFromCode = 'ja';
let transToCode = 'en';

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

	if (imgurMenuEnabled)
	{
		chrome.contextMenus.create({"title": "Upload to Imgur",
			"contexts": ["image"],
			"id": "ImgurMenuItem"});		
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
		// If Upload to Imgur is clicked. Upload image link to Imgur.
		case "ImgurMenuItem":
			chrome.tabs.create({url: "http://imgur.com/upload?url=" + info.srcUrl});
			break;
		// If Translate is clicked. Enter selected text into Google Translate
		case "TranslateMenuItem":
			chrome.tabs.create({url: "http://translate.google.com/#" + transFromCode + "/" + transToCode + "/" + info.selectionText});
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
	
	if (!origEnabled)
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

///
// Rename Twitter image filenames when downloading
///

chrome.downloads.onDeterminingFilename.addListener(twitFileNameHandler);

function twitFileNameHandler(item, suggest) 
{	
	if (tfnEnabled)
	{
		const i = item.filename.lastIndexOf('-');

		if (item.referrer.includes("twitter.com") || item.referrer.includes("pbs.twimg.com"))
		{
			const newName = item.filename.slice(0, i);		
			suggest({filename: newName});
		}	
	}
}

///
// Apply user options
///

chrome.storage.onChanged.addListener(storChangedHandler);
function storChangedHandler(changes, areaName)
{
	if (typeof changes['transFromLang'] !== 'undefined')
	{
		transFromCode = changes['transFromLang'].newValue;
	}
	if (typeof changes['transToLang'] !== 'undefined')
	{
		transToCode	= changes['transToLang'].newValue;
	}
	if (typeof changes['sauceNao'] !== 'undefined')
	{
		sauceMenuEnabled = changes['sauceNao'].newValue;
	}
	if (typeof changes['upImgur'] !== 'undefined')
	{
		imgurMenuEnabled = changes['upImgur'].newValue;
	}	
	if (typeof changes['transText'] !== 'undefined')
	{
		transTextMenuEnabled = changes['transText'].newValue;
	}
	if (typeof changes['twitReDir'] !== 'undefined')
	{
		origEnabled	= changes['twitReDir'].newValue;
	}
	if (typeof changes['twitDl'] !== 'undefined')
	{
		tfnEnabled	= changes['twitDl'].newValue;
	}
	
	chrome.contextMenus.removeAll(createContextMenus);
}