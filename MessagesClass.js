var inboxMessages = null;
var mailedMessages = null;

// page is for ExpandDisplay
var page = 0;

var mode = "Inbox";
/* 		Inbox Messages		*/

function importInboxMessages(inbox){
	inboxMessages = inbox;
}

function importMailedMessages(mailed){
	mailedMessages = mailed;
}

function importPageOfEmails(){
	email = 0; // Reseted to 0 because change display indicates leaving a display
	if(mode == "Inbox"){
		return inboxMessages.slice(0, 6);
	}
	else{
		console.log("Mode is not inbox and it is: " + mode);
		return mailedMessages.slice(0, 6);
	}
}

function importSingleEmail(){
	// If the user expands, it will show first page from inbox in the navigational panel.
	mode = "Inbox";
	page = 0;
	return getNextEmail();
}

// getNextEmail looks for the first unread message, returns null otherwise
function getNextEmail(){
	var i = 0;
	for (var i = 0 ; i < inboxMessages.length; i++) {
		if(inboxMessages[i].unread == true){
			inboxMessages[i].unread = false;
			return inboxMessages[i];
		}
	};
	return null;
}

function getNumberUnread(){
	var total = 0;
	var i = 0;
	for (var i = 0 ; i < inboxMessages.length; i++) {
		if(inboxMessages[i].unread == true){
			total++;
		}
	};
	return total;
}

// Returns a inboxMessages containing a set of inboxMessages, specific to which page.
function getPrevPage(){
	if(mode == "Inbox"){
		if(page == 0){
			return null;
		}
		page--;
		var begin = page*6;
 		var end = (page*6)+6;
 		
		return inboxMessages.slice(begin, end);
	}
	else{
		if(page == 0){
			return null;
		}
		page--;
		var begin = page*6;
 		var end = (page*6)+6;
		return mailedMessages.slice(begin, end);
	}
}

function getNextPage(){
	// First make sure that the inboxMessages have been added to the inboxMessages storage.
	if(mode == "Inbox"){
		console.log("Page: " + (page+1) + " Max Pages: " + getMaxPagesInbox());
		if(getMaxPagesInbox() < (page+1)){
			return null;
		}
		page++;
		var begin = page*6;
 		var end = (page*6)+6;
		return inboxMessages.slice(begin, end);
	}
	else{
		if(getMaxPagesMailed() < (page+1)){
			return null;
		}
		page++;
		var begin = page*6;
 		var end = (page*6)+6;
		return mailedMessages.slice(begin, end);
	}
}

// Done to make sure the inbox hasn't gone past all the inboxMessages allowed.
function getMaxPagesInbox(){
	return inboxMessages.length/6;
}

/* 		Sent Messages		*/
function getMailedMessages(page){
	// First make sure that the inboxMessages have been added to the inboxMessages storage.
 	var begin = page*6;
 	var end = (page*6)+6;
 	return mailedMessages.slice(begin, end);
}

function getMaxPagesMailed(){
	return mailedMessages.length/6;
}

function resetPage(){
	page = 0;
}

function setMode(modearg){
	mode = modearg;
	resetPage();
}

function getCurrentMode(){
	return mode;
}


