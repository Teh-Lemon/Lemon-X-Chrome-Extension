// Copyright (c) 2014 Teh Lemon. All rights reserved.
//	Handles the background event listener for image context menus
//	Adds context menu options for SauceNAO and Imgur

//	Add an event listener to the context menu item
chrome.contextMenus.onClicked.addListener(onClickContextHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() 
{
	//	Create Search SauceNAO menu item
    chrome.contextMenus.create({"title": "Search SauceNAO",
								"contexts": ["image"],
                                "id": "SauceNAOMenuItem"});
	
	chrome.contextMenus.create({"title": "Upload to Imgur",
								"contexts": ["image"],
								"id": "ImgurMenuItem"});								
});

// The onClicked callback function for context menu.
function onClickContextHandler(info, tab) {
	//If Search SauceNAO is clicked. Search SauceNAO with the image link
  if (info.menuItemId == "SauceNAOMenuItem") 
  {
	chrome.tabs.create({url: "http://saucenao.com/search.php?url=" + info.srcUrl});
  } 
	//	If Upload to Imgur is clicked. Upload image link to Imgur.
  else if (info.menuItemId == "ImgurMenuItem")
  {
	chrome.tabs.create({url: "http://imgur.com/upload?url=" + info.srcUrl});
  }
};

