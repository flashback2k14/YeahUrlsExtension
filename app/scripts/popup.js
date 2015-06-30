window.addEventListener('DOMContentLoaded', function() {
  // variables
  var listUrlHolder = document.querySelector('#listUrlHolder');
  var btnGetUrl = document.querySelector('#btnGetUrl');
  var btnGetAllUrl = document.querySelector('#btnGetAllUrl');
  var btnClear = document.querySelector('#btnClear');
  var btnSave = document.querySelector('#btnSave');
  // functions
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
        emailAddress: '',
        password: ''
      }, function(items) {
        resolve(items);
      });
    });
  }
  
  function authWithPassword(userObj) {
    return new Promise(function(resolve, reject) {
      var rootRef = new Firebase("https://yeah-url-extension.firebaseio.com/");
      rootRef.authWithPassword(userObj, function onAuth(err, user) {
        if (err) reject(err);
        if (user) resolve(user);
      });
    });
  }
  
  function getUrlCollection() {
    var count = listUrlHolder.childElementCount;
    var el = listUrlHolder.children;
    var coll = [];
    
    for(var i = 0; i < count; i++) {
      var item = {};
      item.id = (i + 1);
      item.value = el[i].innerHTML;
      coll.push(item);
    }
    
    var itemTS = {};
    itemTS.id = count;
    itemTS.value = Date.now();
    coll.push(itemTS);
    
    return coll;
  }
  
  function saveListToFirebase(e) {
    getOptions().then(function(items) {
      var email = items.emailAddress;
      var decrypted = CryptoJS.AES.decrypt(items.password, "!'Secret*/Passphrase#?");
      var pw = decrypted.toString(CryptoJS.enc.Utf8);
      
	  if ((email.length === 0) || (pw.length === 0)) {
		alert('You are not logged in. Please go to the Options Menue.');
		return;
	  }
	  
      var user = {
        "email": email,
        "password": pw
      };
      
      authWithPassword(user).then(function(user) {
        var urlCollection = getUrlCollection();
        
        var rootRef = new Firebase("https://yeah-url-extension.firebaseio.com/urlcollector/" + user.uid);
        var urlcollectorRef = rootRef.push();
        
        urlcollectorRef.set(urlCollection, function onComplete() {
          alert('Speicherung erfolgreich!');
        });
      }).catch(function (err) {
        alert('Error: ' + err);
      });
    }).catch(function (err) {
      alert('Error: ' + err);
    });
  }
  // event listener
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
    listUrlHolder.innerHTML = '';
  });
  
  btnSave.addEventListener('click', function() {
    saveListToFirebase();
  });
});
