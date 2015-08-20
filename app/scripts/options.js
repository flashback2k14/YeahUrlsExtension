window.addEventListener('DOMContentLoaded', function() {
  // variables
  var inputEmail = document.querySelector('#txtEmailaddress');
  var inputPassword = document.querySelector('#txtPassword');
  var btnLogin = document.querySelector('#btnLogin');
  var btnReset = document.querySelector('#btnReset');
  var status = document.querySelector('#status');
  var iconSelect = document.querySelector('#iconSelect');
  //var colorSelect = document.querySelector('#colorSelect');
  // functions
  function saveOptions(userId, expireDate) {
    chrome.storage.sync.set({
      userLoginId: userId,
      loginExpireDate: expireDate
    },
    function() {
      status.textContent = 'Options saved.';
      inputEmail.value = '';
      inputPassword.value = '';

      setTimeout(function() {
        status.textContent = '';
      }, 1000);
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
  function saveLoginOptions() {
    var email = inputEmail.value;
    var pw = inputPassword.value;

    var user = {
      "email": email,
      "password": pw
    };

    authWithPassword(user)
      .then(function(user) {
        saveOptions(user.uid, user.expires);
      })
      .catch(function (err) {
        alert('Error: ' + err);
      });
  }
  function resetLoginOptions() {
    chrome.storage.sync.remove([
      "userLoginId",
      "loginExpireDate"
    ],
    function() {
      status.textContent = 'Options reseted.';

      setTimeout(function() {
        status.textContent = '';
      }, 1000);
    });
  }
  function changeIcon(e) {
    if (e.target.value === 'dark') {
      chrome.browserAction.setIcon({
        path: 'images/note_add_black_48dp_2x.png'
      });
      window.localStorage.setItem('browserIcon', 'dark');
    } else {
      chrome.browserAction.setIcon({
        path: 'images/note_add_white_48dp_2x.png'
      });
      window.localStorage.setItem('browserIcon', 'light');
    }
  }
  //function changeColor(e) {
  //  if (e.target.value === 'dark') {
  //    chrome.browserAction.setBadgeBackgroundColor({
  //      color: '#C24C4C'
  //    });
  //  } else {
  //    chrome.browserAction.setBadgeBackgroundColor({
  //     color: '#358856'
  //    });
  //  }
  //}
  // event listener
  btnLogin.addEventListener('click', function() {
    saveLoginOptions();
  });
  btnReset.addEventListener('click', function() {
    resetLoginOptions();
  });
  iconSelect.addEventListener('load', function() {
      iconSelect.value = window.localStorage.getItem('browserIcon');
  });
  iconSelect.addEventListener('change', function(e) {
    changeIcon(e);
  });
  //colorSelect.addEventListener('change', function(e) {
  //  changeColor(e);
  //});
});
