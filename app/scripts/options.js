window.addEventListener('load', function() { 
  var browserIcon = window.localStorage.getItem('browserIcon');
  var batchColor = window.localStorage.getItem('batchColor');
  // set browser icon
  if (browserIcon !== null) {
    switch (browserIcon) {
      case 'light':
        chrome.browserAction.setIcon({path: 'images/light_128.png'});
        document.getElementById("iconSelect").selectedIndex = "0";
        break;
      case 'dark':
        chrome.browserAction.setIcon({path: 'images/dark_128.png'});
        document.getElementById("iconSelect").selectedIndex = "1";
        break;
      default:
        break;
    }
  }
  // set batch color
  if (batchColor !== null) {
    switch (batchColor) {
      case 'none':
        chrome.browserAction.setBadgeText({text: ''});
        document.getElementById("batchColorSelect").selectedIndex = "0";
        break;
      case 'light':
        chrome.browserAction.setBadgeText({text: 'Yeah'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#358856'});
        document.getElementById("batchColorSelect").selectedIndex = "1";
        break;
      case 'dark':
        chrome.browserAction.setBadgeText({text: 'Yeah'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#C24C4C'});
        document.getElementById("batchColorSelect").selectedIndex = "2";
        break;
      default:
        break;
    }
  }  
});

window.addEventListener('DOMContentLoaded', function() {
  // variables
  var inputEmail = document.querySelector('#txtEmailaddress');
  var inputPassword = document.querySelector('#txtPassword');
  var btnLogin = document.querySelector('#btnLogin');
  var btnReset = document.querySelector('#btnReset');
  var status = document.querySelector('#status');
  var iconSelect = document.querySelector('#iconSelect');
  var batchColorSelect = document.querySelector('#batchColorSelect');
  // functions
  // save login
  function saveLoginOptions() {
    var user = {
      "email": inputEmail.value,
      "password": inputPassword.value
    };
    authWithPassword(user)
      .then(function(user) {
        saveOptions(user.uid, user.expires);
      })
      .catch(function (err) {
        alert('Error: ' + err);
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
  function saveOptions(userId, expireDate) {
    chrome.storage.sync.set({
      userLoginId: userId,
      loginExpireDate: expireDate
    },function() {
      status.textContent = 'Options saved.';
      inputEmail.value = '';
      inputPassword.value = '';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  }
  // reset login
  function resetLoginOptions() {
    chrome.storage.sync.remove([
      "userLoginId",
      "loginExpireDate"
    ],function() {
      status.textContent = 'Options reseted.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  }
  // change icon color
  function changeIcon(e) {
    switch (e.target.value) {
      case 'dark':
        chrome.browserAction.setIcon({path: 'images/dark_128.png'});
        window.localStorage.setItem('browserIcon', 'dark');
        break;
      case 'light':
        chrome.browserAction.setIcon({path: 'images/light_128.png'});
        window.localStorage.setItem('browserIcon', 'light');
        break;
      default:
        break;
    }
  }
  // change batch color
  function changeBatchColor(e) {
    switch (e.target.value) {
      case 'dark': 
        chrome.browserAction.setBadgeText({text: 'Yeah'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#C24C4C'});
        window.localStorage.setItem('batchColor', 'dark');
        break;
      case 'light':
        chrome.browserAction.setBadgeText({text: 'Yeah'});
        chrome.browserAction.setBadgeBackgroundColor({color: '#358856'});
        window.localStorage.setItem('batchColor', 'light');
        break;
      case 'none':
        chrome.browserAction.setBadgeText({text: ''});
        window.localStorage.setItem('batchColor', 'none');
        break;
      default:
        break;  
    }
  }
  // event listener
  btnLogin.addEventListener('click', function() {
    saveLoginOptions();
  });
  btnReset.addEventListener('click', function() {
    resetLoginOptions();
  });
  iconSelect.addEventListener('change', function(e) {
    changeIcon(e);
  });
  batchColorSelect.addEventListener('change', function(e) {
    changeBatchColor(e);
  });
});
