console.log("options.js loaded")

// Saves options to chrome.storage.local.
function SaveOptions() 
{  
	let transFromListValue = document.getElementById('transFromList').value;
	let transToListValue = document.getElementById('transToList').value;
	let sauceNaoCheckValue = document.getElementById('sauceNaoCheck').checked;
	let transTextCheckValue = document.getElementById('transTextCheck').checked;
	let twitReDirCheckValue = document.getElementById('twitURLCheck').checked;
	let twitDlCheckValue = document.getElementById('twitDlCheck').checked;
  
	chrome.storage.local.set({
		transFromLang : transFromListValue,
		transToLang : transToListValue,
		sauceNao: sauceNaoCheckValue,
		transText: transTextCheckValue,
		twitReDir: twitReDirCheckValue,
		twitDl: twitDlCheckValue
	}, function() {
		// Update status to let user know options were saved.
		let status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);		
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function RestoreOptions() 
{
	document.getElementById('saveButt').addEventListener('click', SaveOptions);
	document.getElementById('defaultButt').addEventListener('click', SetDefault);
	
	chrome.storage.local.get({
		transFromLang: "ja",
		transToLang: "en",
		sauceNao: true,
		upImgur: true,
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
}

function SetDefault()
{
	document.getElementById('transFromList').value = "ja";
	document.getElementById('transToList').value = "en";
	document.getElementById('sauceNaoCheck').checked = true;
	document.getElementById('transTextCheck').checked = true;
	document.getElementById('twitURLCheck').checked = true;
	document.getElementById('twitDlCheck').checked = true;
}

document.addEventListener('DOMContentLoaded', RestoreOptions);