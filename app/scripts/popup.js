window.addEventListener('load', function() { 
  Util.get().getOptions()
    .then(function (items) {
      var userId = items.userLoginId;
      var expireDate = items.loginExpireDate;
      var currTimestamp = Math.round(Date.now() / 1000);

      if ((userId === null) || (expireDate === null) || (typeof(userId) === 'undefined') || (typeof(expireDate) === 'undefined') || (currTimestamp >= expireDate)) {
        alert('You are not logged in. Please go to the Options Menue.');
        Util.get().openSettings();
        return;
      }
      
      Util.get().loadTodosFromFirebase(document.querySelector("#listTodosHolder"));
    })
    .catch(function (err) {
      alert('Error: ' + err);
    });
});

window.addEventListener('DOMContentLoaded', function() {
  /**
   * UI Elements
   */
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
  // ToDos
  var listTodosHolder = document.querySelector("#listTodosHolder");
  var txtAddTodo = document.querySelector("#txtAddTodo");
  var btnAddTodo = document.querySelector("#btnAddTodo");
  // Settings
  var btnSettings = document.querySelector('#btnSettings');
  /**
   * EVENTLISTENER
   */
  // URLs
  btnGetUrl.addEventListener('click', function() {
    Util.get().getCurrentTab()
      .then(function(tab) {
        Util.get().createListItem(tab.url, listUrlHolder);
      })
      .catch(function (err) {
        alert('Error: ' + err);
      });
  });
  btnGetAllUrl.addEventListener('click', function() {
    Util.get().getAllTabs()
      .then(function(tabs) {
        tabs.forEach(function(tab) {
          Util.get().createListItem(tab.url, listUrlHolder);
        });
      })
      .catch(function (err) {
        alert('Error: ' + err);
      });
  });
  btnClear.addEventListener('click', function() {
    Util.get().clearForm(listUrlHolder, txtKeywords, fiContainer);
  });
  btnSave.addEventListener('click', function() {
    Util.get().saveListToFirebase(listUrlHolder, txtKeywords, fiContainer);
  });
  // Notes
  btnClearNote.addEventListener('click', function() {
    Util.get().clearNoteForm(txtTitle, txtKeywordsNote, txtNote, fiContainerNotesTitle, fiContainerNotesKeywords, fiContainerNotes);
  });
  btnSaveNote.addEventListener('click', function() {
    Util.get().saveNoteToFirebase(txtTitle, txtKeywordsNote, txtNote, fiContainerNotesTitle, fiContainerNotesKeywords, fiContainerNotes);
  });
  //
  btnAddTodo.addEventListener('click', function() {
    Util.get().saveToDoToFirebase(listTodosHolder, txtAddTodo);
  });
  // Settings
  btnSettings.addEventListener('click', function() {
    Util.get().openSettings();
  });
});
