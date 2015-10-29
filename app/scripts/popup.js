window.addEventListener('DOMContentLoaded', function() {
  // variables
  // URLs
  var btnGetUrl = document.querySelector('#btnGetUrl');
  var btnGetAllUrl = document.querySelector('#btnGetAllUrl');
  var listUrlHolder = document.querySelector('#listUrlHolder');
  var fiContainer = document.querySelector('#fiContainer');
  var txtKeywords = document.querySelector('#txtKeywords');
  var btnClear = document.querySelector('#btnClear');
  var btnSave = document.querySelector('#btnSave');
  // Notes
  var fiContainerNotesTitle = document.querySelector('#fiContainerNotesTitle');
  var txtTitle = document.querySelector('#txtNotesTitle');
  var fiContainerNotesKeywords = document.querySelector('#fiContainerNotesKeywords');
  var txtKeywordsNote = document.querySelector('#txtNotesKeywords');
  var fiContainerNotes = document.querySelector('#fiContainerNotes');
  var txtNote = document.querySelector('#txtNotes');
  var btnClearNote = document.querySelector('#btnClearNotes');
  var btnSaveNote = document.querySelector('#btnSaveNotes');
  // Settings
  var btnSettings = document.querySelector('#btnSettings');
  // functions
  // URLs
  function clearForm() {
    listUrlHolder.innerHTML = '';
    txtKeywords.value = '';
    fiContainer.classList.remove('is-focused');
    fiContainer.classList.remove('is-dirty');
  }
  function getCurrentTab() {
    return new Promise(function(resolve, reject){
      chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
      }, function(tabs) {
        resolve(tabs[0]);
      });
    });
  }
  function getAllTabs() {
    return new Promise(function(resolve, reject){
      chrome.tabs.query({
        lastFocusedWindow: true
      }, function(tabs) {
        resolve(tabs);
      });
    });
  }
  function createListItem(text) {
    var li = document.createElement("li");
    li.innerHTML = text;
    listUrlHolder.appendChild(li);
  }
  function getOptions() {
    return new Promise(function(resolve, reject) {
      chrome.storage.sync.get({
        userLoginId: '',
        loginExpireDate: ''
      }, function(items) {
        resolve(items);
      });
    });
  }
  function getUrlCollection(objId) {
    var count = listUrlHolder.childElementCount;
    var el = listUrlHolder.children;
    var coll = [];
    var ts = Date.now();
    var t = new Date(ts);

    for (var i = 0; i < count; i++) {
      var item = {};
      item.id = (i + 1);
      item.value = el[i].innerHTML;
      item.keywords = txtKeywords.value;
      item.date = t.toLocaleDateString();
      item.time = t.toLocaleTimeString();
      item.timestamp = ts;
      item.objId = objId;
      coll.push(item);
    }
    return coll;
  }
  function saveListToFirebase() {
    getOptions()
      .then(function(items) {
        var userId = items.userLoginId;
        var expireDate = items.loginExpireDate;
        var currTimestamp = Math.round(Date.now() / 1000);

        if ((typeof userId === 'undefined') || (currTimestamp >= expireDate)) {
          alert('You are not logged in. Please go to the Options Menue.');
          clearForm();
          openSettings();
          return;
        }

        var rootRef = new Firebase("https://yeah-url-extension.firebaseio.com/" + userId + "/urlcollector");
        var urlCollectorRef = rootRef.push();

        var objId = urlCollectorRef.key();
        var urlCollection = getUrlCollection(objId);

        urlCollectorRef.set(urlCollection, function onComplete() {
          alert('Speicherung erfolgreich!');
          clearForm();
        });
      })
      .catch(function (err) {
        alert('Error: ' + err);
      });
  }
  // Notes
  function clearNoteForm() {
    txtTitle.value = '';
    txtKeywordsNote.value = '';
    txtNote.value = '';
    fiContainerNotesTitle.classList.remove('is-focused');
    fiContainerNotesTitle.classList.remove('is-dirty');
    fiContainerNotesKeywords.classList.remove('is-focused');
    fiContainerNotesKeywords.classList.remove('is-dirty');
    fiContainerNotes.classList.remove('is-focused');
    fiContainerNotes.classList.remove('is-dirty');
  }
  function getNoteFromForm(objId) {
    var coll = [];

    var item = {};
    item.id = 1;
    item.title = txtTitle.value;
    item.keywords = txtKeywordsNote.value;
    item.value = txtNote.value;
    item.timestamp = Date.now();
    item.objId = objId;
    coll.push(item);

    return coll;
  }
  function saveNoteToFirebase() {
    getOptions()
      .then(function(items) {
        var userId = items.userLoginId;
        var expireDate = items.loginExpireDate;
        var currTimestamp = Math.round(Date.now() / 1000);

        if ((typeof userId === 'undefined') || (currTimestamp >= expireDate)) {
          alert('You are not logged in. Please go to the Options Menue.');
          clearNoteForm();
          openSettings();
          return;
        }

        var rootRef = new Firebase("https://yeah-url-extension.firebaseio.com/" + userId + "/notescollector");
        var noteRef = rootRef.push();

        var objId = noteRef.key();
        var note = getNoteFromForm(objId);

        noteRef.set(note, function onComplete() {
          alert('Speicherung erfolgreich!');
          clearNoteForm();
        });
      })
      .catch(function (err) {
        alert('Error: ' + err);
      });
  }
  // Settings
  function openSettings() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }
  // event listener
  // URLs
  btnGetUrl.addEventListener('click', function() {
    getCurrentTab().then(function(tab) {
      createListItem(tab.url);
    }).catch(function (err) {
      alert('Error: ' + err);
    });
  });
  btnGetAllUrl.addEventListener('click', function() {
    getAllTabs().then(function(tabs) {
      tabs.forEach(function(tab) {
        createListItem(tab.url);
      });
    }).catch(function (err) {
      alert('Error: ' + err);
    });
  });
  btnClear.addEventListener('click', function() {
    clearForm();
  });
  btnSave.addEventListener('click', function() {
    saveListToFirebase();
  });
  // Notes
  btnClearNote.addEventListener('click', function() {
    clearNoteForm();
  });
  btnSaveNote.addEventListener('click', function() {
    saveNoteToFirebase();
  });
  // Settings
  btnSettings.addEventListener('click', function() {
   openSettings();
  });
});
