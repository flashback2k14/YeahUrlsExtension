window.addEventListener('DOMContentLoaded', function() {
  // variables
  var listUrlHolder = document.querySelector('#listUrlHolder');
  var btnGetUrl = document.querySelector('#btnGetUrl');
  var btnGetAllUrl = document.querySelector('#btnGetAllUrl');
  var btnClear = document.querySelector('#btnClear');
  var btnSave = document.querySelector('#btnSave');
  var imgSettings = document.querySelector('#imgSettings');
  var txtKeywords = document.querySelector('#txtKeywords');
  // functions
  function openSettings() {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options.html'));
    }
  }
  function clearForm() {
    listUrlHolder.innerHTML = '';
    txtKeywords.value = '';
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
  function getUrlCollection() {
    var count = listUrlHolder.childElementCount;
    var el = listUrlHolder.children;
    var coll = [];
    var ts = Date.now();
    var t = new Date(ts);
    
    for(var i = 0; i < count; i++) {
      var item = {};
      item.id = (i + 1);
      item.value = el[i].innerHTML;
      item.keywords = txtKeywords.value;
      item.date = t.toLocaleDateString();
      item.time = t.toLocaleTimeString();
      item.timestamp = ts;
      coll.push(item);
    }
    return coll;
  }
  function saveListToFirebase(e) {
    getOptions().then(function(items) {
      var userId = items.userLoginId;
      var expireDate = items.loginExpireDate

      if (expireDate === Date.now()) {
		    alert('You are not logged in. Please go to the Options Menue.');
		    return;
      }

      var urlCollection = getUrlCollection();
        
      var rootRef = new Firebase("https://yeah-url-extension.firebaseio.com/" + userId + "/urlcollector");
      var urlcollectorRef = rootRef.push();
        
      urlcollectorRef.set(urlCollection, function onComplete() {
        alert('Speicherung erfolgreich!');
        clearForm();
      });
    }).catch(function (err) {
      alert('Error: ' + err);
    });
  }
  // event listener
  imgSettings.addEventListener('click', function() {
    openSettings();
  });
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
});
