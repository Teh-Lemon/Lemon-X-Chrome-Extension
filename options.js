console.log("options.js loading");

// Saves options to chrome.storage.sync
function SaveOptions() 
{  
	var transFromListValue = document.getElementById('transFromList').value;
	var transToListValue = document.getElementById('transToList').value;
	var sauceNaoCheckValue = document.getElementById('sauceNaoCheck').checked;
	var transTextCheckValue = document.getElementById('transTextCheck').checked;
	var twitReDirCheckValue = document.getElementById('twitURLCheck').checked;
	var twitDlCheckValue = document.getElementById('twitDlCheck').checked;
  
	chrome.storage.sync.set({
		transFromLang : transFromListValue,
		transToLang : transToListValue,
		sauceNao: sauceNaoCheckValue,
		transText: transTextCheckValue,
		twitReDir: twitReDirCheckValue,
		twitDl: twitDlCheckValue
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);		
	});

	console.log("Options saved");
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.sync
// Set up buttons
function DomLoaded() 
{
	document.getElementById('saveButt').addEventListener('click', SaveOptions);
	document.getElementById('defaultButt').addEventListener('click', SetDefault);

	chrome.storage.sync.get({
		transFromLang: "ja",
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

function SetDefault()
{
	document.getElementById('transFromList').value = "ja";
	document.getElementById('transToList').value = "en";
	document.getElementById('sauceNaoCheck').checked = true;
	document.getElementById('transTextCheck').checked = true;
	document.getElementById('twitURLCheck').checked = true;
	document.getElementById('twitDlCheck').checked = true;

	console.log("Options restored to defaults");
}

document.addEventListener('DOMContentLoaded', DomLoaded);