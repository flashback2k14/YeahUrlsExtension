window.addEventListener('DOMContentLoaded', function() {
  // variables
  var inputEmail = document.querySelector('#txtEmailaddress');
  var inputPassword = document.querySelector('#txtPassword');
  var btnLogin = document.querySelector('#btnLogin');
  var status = document.querySelector('#status');
  // event listener
  btnLogin.addEventListener('click', function() {
    saveOptions();
  });
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
});