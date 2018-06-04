console.log("options.js loading");

// Wait for html to finish loading before initializing the script
function DomLoaded() 
{
	// Set up buttons
	document.getElementById('saveButt').addEventListener('click', SaveOptions);
	document.getElementById('defaultButt').addEventListener('click', SetDefault);

	// Restores select box and checkbox state using the preferences
	// stored in chrome.storage.sync
	chrome.storage.sync.get({
		transFromLang: "auto",
		transToLang: "en",
		sauceNao: true,
		transText: true,
		twitReDir: true,
		twitDl: true
	}, function(items) {
		document.getElementById('transFromList').value = items.transFromLang;
		document.getElementById('transToList').value = items.transToLang;
		document.getElementById('sauceNaoCheck').checked = items.sauceNao;
		document.getElementById('transTextCheck').checked = items.transText;
		document.getElementById('twitURLCheck').checked = items.twitReDir;
		document.getElementById('twitDlCheck').checked = items.twitDl;
	});
	
	console.log("options.js loaded");
}

// Saves options to chrome.storage.sync
function SaveOptions() 
{  
	let transFromListValue = document.getElementById('transFromList').value;
	let transToListValue = document.getElementById('transToList').value;
	let sauceNaoCheckValue = document.getElementById('sauceNaoCheck').checked;
	let transTextCheckValue = document.getElementById('transTextCheck').checked;
	let twitReDirCheckValue = document.getElementById('twitURLCheck').checked;
	let twitDlCheckValue = document.getElementById('twitDlCheck').checked;
  
	chrome.storage.sync.set({
		transFromLang : transFromListValue,
		transToLang : transToListValue,
		sauceNao: sauceNaoCheckValue,
		transText: transTextCheckValue,
		twitReDir: twitReDirCheckValue,
		twitDl: twitDlCheckValue
	}, function() {
		// Show "Saved" text briefly to let the user know the button has worked
		let status = document.getElementById('status');
		status.textContent = 'Options saved.';		
		setTimeout(function() {
			status.textContent = '';
		}, 750);		
	});

	console.log("Options saved");
}

function SetDefault()
{
	document.getElementById('transFromList').value = "auto";
	document.getElementById('transToList').value = "en";
	document.getElementById('sauceNaoCheck').checked = true;
	document.getElementById('transTextCheck').checked = true;
	document.getElementById('twitURLCheck').checked = true;
	document.getElementById('twitDlCheck').checked = true;

	console.log("Options restored to defaults");
	SaveOptions();
}

document.addEventListener('DOMContentLoaded', DomLoaded);