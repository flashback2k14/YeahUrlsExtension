window.addEventListener("load", function() { 
  var browserIcon = window.localStorage.getItem("browserIcon");
  var batchColor = window.localStorage.getItem("batchColor");
  // set browser icon
  if (browserIcon !== null) {
    switch (browserIcon) {
      case "light":
        chrome.browserAction.setIcon({path: "images/light_38.png"});
        document.getElementById("iconSelect").selectedIndex = "0";
        break;
      case "dark":
        chrome.browserAction.setIcon({path: "images/dark_38.png"});
        document.getElementById("iconSelect").selectedIndex = "1";
        break;
      default:
        break;
    }
  }
  // set batch color
  if (batchColor !== null) {
    switch (batchColor) {
      case "none":
        chrome.browserAction.setBadgeText({text: ""});
        document.getElementById("batchColorSelect").selectedIndex = "0";
        break;
      case "light":
        chrome.browserAction.setBadgeText({text: "Yeah"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#358856"});
        document.getElementById("batchColorSelect").selectedIndex = "1";
        break;
      case "dark":
        chrome.browserAction.setBadgeText({text: "Yeah"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#C24C4C"});
        document.getElementById("batchColorSelect").selectedIndex = "2";
        break;
      default:
        break;
    }
  }  
});

window.addEventListener("DOMContentLoaded", function() {
  var BASEURL = "https://yeah-url-extension.firebaseio.com/";
  var BASETODO = "https://todoapp-appengine.firebaseio.com/";
  // variables
  // url
  var inputEmail = document.querySelector("#txtEmailaddress");
  var inputPassword = document.querySelector("#txtPassword");
  var btnLogin = document.querySelector("#btnLogin");
  var btnReset = document.querySelector("#btnReset");
  var status = document.querySelector("#status");
  // todo
  var inputEmailTodo = document.querySelector("#txtEmailaddressTodo");
  var inputPasswordTodo = document.querySelector("#txtPasswordTodo");
  var btnLoginTodo = document.querySelector("#btnLoginTodo");
  var btnResetTodo = document.querySelector("#btnResetTodo");
  var statusTodo = document.querySelector("#statusTodo");
  // other
  var iconSelect = document.querySelector("#iconSelect");
  var batchColorSelect = document.querySelector("#batchColorSelect");
  // functions
  // save login  
  function authWithPassword(baseUrl, userObj) {
    return new Promise(function(resolve, reject) {
      var rootRef = new Firebase(baseUrl);
      rootRef.authWithPassword(userObj, function onAuth(err, user) {
        if (err) return reject(err);
        resolve(user);
      });
    });
  }
  function saveOptions(type, userId) {
    switch(type) {
      case "URL": 
        chrome.storage.sync.set({ userIdUrl: userId }, function() {
          status.textContent = "Options saved.";
          inputEmail.value = "";
          inputPassword.value = "";
          setTimeout(function() {
            status.textContent = "";
          }, 2000);
        });
        break;
        
      case "TODO":
        chrome.storage.sync.set({ userIdTodo: userId }, function() {
          statusTodo.textContent = "Options saved.";
          inputEmailTodo.value = "";
          inputPasswordTodo.value = "";
          setTimeout(function() {
            statusTodo.textContent = "";
          }, 2000);
        });
        break;
        
      default:
        break;
    }
  }
  function saveLoginOptions(baseUrl, email, password, type) {
    var user = {
      "email": email,
      "password": password
    };
    authWithPassword(baseUrl, user)
      .then(function(user) {
        saveOptions(type, user.uid);
      })
      .catch(function (err) {
        alert("Error: " + err.message);
      });
  }
  // reset login
  function resetLoginOptions(type) {
    switch(type) {
      case "URL":
        chrome.storage.sync.remove("userIdUrl", function() {
          status.textContent = "Options reseted.";
          setTimeout(function() {
            status.textContent = "";
          }, 2000);
        });
        break;
        
      case "TODO":
        chrome.storage.sync.remove("userIdTodo", function() {
          statusTodo.textContent = "Options reseted.";
          setTimeout(function() {
            statusTodo.textContent = "";
          }, 2000);
        });
        break;
        
      default:
        break;  
    }
  }
  // change icon color
  function changeIcon(e) {
    switch (e.target.value) {
      case "dark":
        chrome.browserAction.setIcon({path: "images/dark_38.png"});
        window.localStorage.setItem("browserIcon", "dark");
        break;
        
      case "light":
        chrome.browserAction.setIcon({path: "images/light_38.png"});
        window.localStorage.setItem("browserIcon", "light");
        break;
        
      default:
        break;
    }
  }
  // change batch color
  function changeBatchColor(e) {
    switch (e.target.value) {
      case "dark": 
        chrome.browserAction.setBadgeText({text: "Yeah"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#C24C4C"});
        window.localStorage.setItem("batchColor", "dark");
        break;
        
      case "light":
        chrome.browserAction.setBadgeText({text: "Yeah"});
        chrome.browserAction.setBadgeBackgroundColor({color: "#358856"});
        window.localStorage.setItem("batchColor", "light");
        break;
        
      case "none":
        chrome.browserAction.setBadgeText({text: ""});
        window.localStorage.setItem("batchColor", "none");
        break;
        
      default:
        break;  
    }
  }
  // event listener
  // url
  btnLogin.addEventListener("click", function() {
    var email = inputEmail.value;
    var password = inputPassword.value;
    saveLoginOptions(BASEURL, email, password, "URL");
  });
  btnReset.addEventListener("click", function() {
    resetLoginOptions("URL");
  });
  // todo
  btnLoginTodo.addEventListener("click", function() {
    var email = inputEmailTodo.value;
    var password = inputPasswordTodo.value;
    saveLoginOptions(BASETODO, email, password, "TODO");
  });
  btnResetTodo.addEventListener("click", function() {
    resetLoginOptions("TODO");
  });
  // other
  iconSelect.addEventListener("change", function(e) {
    changeIcon(e);
  });
  batchColorSelect.addEventListener("change", function(e) {
    changeBatchColor(e);
  }); 
});
