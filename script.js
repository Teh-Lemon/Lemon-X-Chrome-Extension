// Created 29/01/2014 by Teh Lemon
// Background script
// Handles the background event listener for image context menus
// Adds context menu options for SauceNAO and Imgur
//console.log("Lemon X BG loaded");

// Set up context menus
// Create Search SauceNAO menu item
chrome.contextMenus.create({"title": "Search SauceNAO",
	"contexts": ["image"],
	"id": "SauceNAOMenuItem"});

chrome.contextMenus.create({"title": "Upload to Imgur",
	"contexts": ["image"],
	"id": "ImgurMenuItem"});		

chrome.contextMenus.create({"title": "Translate '%s' from JP -> ENG",
	"contexts": ["selection"],
	"id": "TranslateMenuItem"});

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
			chrome.tabs.create({url: "http://translate.google.com/#ja/en/" + info.selectionText});
			//chrome.tabs.create({url: "http://beta.jisho.org/search/" + info.selectionText});
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

function origHandler(details) 
{
  let {url} = details;
  const i = url.lastIndexOf(':');
  if (i > 5) 
  {
    if (/:orig$/.test(url) || /:thumb$/.test(url) && details.type === 'image') 
	{
      return;
    }

    url = url.slice(0, i);
  }

  return   {
    redirectUrl: url + ':orig'
  };
}








