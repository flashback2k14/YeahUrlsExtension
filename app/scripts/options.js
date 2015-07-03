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
  function saveLoginOptions() {
    var email = inputEmail.value;
    var pw = inputPassword.value;
    var encryptedPw = CryptoJS.AES.encrypt(pw, "!'Secret*/Passphrase#?");
    
    chrome.storage.sync.set({
      emailAddress: email,
      password: encryptedPw
    }, function() {
      status.textContent = 'Options saved.';
      inputEmail.value = '';
      inputPassword.value = '';
      
      setTimeout(function() {
        status.textContent = '';
      }, 1000);
    });
  }
  
  function resetLoginOptions() {
    chrome.storage.sync.remove([
	  "emailAddress",
      "password"
	]
	, function() {
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