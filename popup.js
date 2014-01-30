// Created 30/01/2014 by Teh Lemon

function main()
{
}

//	Event handler for MAL submit button
// Search MAL based on search terms and drop down menu
function clickHandlerMALSubmitButton(e) {

	// Text box values
	var searchTerms = document.getElementById('MALTextBox').value;
	// Used to direct link to correct search url
	var searchUrl = "";
  
	// Change url based on drop down menu
	switch (document.getElementById('MALType').value)
	{
	case "Anime":
		searchUrl = "anime";
		break;
	case "Manga":
		searchUrl = "manga";
		break;
	case "Characters":
		searchUrl = "character";
		break;
	case "People":
		searchUrl = "people";
		break;
	default:
		searchUrl = "anime";
		break;
	}
  
	// Search MAL
	chrome.tabs.create({url: "http://myanimelist.net/" + searchUrl + ".php?q=" + searchTerms});
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('MALSubmitButton').addEventListener('click', clickHandlerMALSubmitButton);
  main();
});