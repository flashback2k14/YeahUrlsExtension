window.addEventListener('DOMContentLoaded', function() {
  // variables
  var inputEmail = document.querySelector('#txtEmailaddress');
  var inputPassword = document.querySelector('#txtPassword');
  var btnLogin = document.querySelector('#btnLogin');
  var btnReset = document.querySelector('#btnReset');
  var status = document.querySelector('#status');
  // event listener
  btnLogin.addEventListener('click', function() {
    saveOptions();
  });
  
  btnReset.addEventListener('click', function() {
	resetOptions();
  })
  // functions
  function saveOptions() {
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
  
  function resetOptions() {
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
});