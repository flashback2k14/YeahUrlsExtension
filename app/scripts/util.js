var Util = (function (chrome, Promise, Firebase) {
	var instance;

	function setup() {
		//################//
		//  		URLs			//
		//################//
		/**
		 * Clear URL form
		 * @param {HTMLElement} listUrlHolder
		 * @param {HTMLElement} txtKeywords
		 * @param {HTMLElement} fiContainer
		 */
		function clearForm(listUrlHolder, txtKeywords, fiContainer) {
			listUrlHolder.innerHTML = '';
			txtKeywords.value = '';
			fiContainer.classList.remove('is-focused');
			fiContainer.classList.remove('is-dirty');
		}
		/**
		 * Get current Tab from Chrome Browser Window
		 * @returns {Promise}
		 */
		function getCurrentTab() {
			return new Promise(function (resolve, reject) {
				chrome.tabs.query({
					active: true,
					lastFocusedWindow: true
				}, function (tabs) {
					resolve(tabs[0]);
				});
			});
		}
		/**
		 * Get all Tabs from Chrome Browser Window
		 * @returns {Promise}
		 */
		function getAllTabs() {
			return new Promise(function (resolve, reject) {
				chrome.tabs.query({
					lastFocusedWindow: true
				}, function (tabs) {
					resolve(tabs);
				});
			});
		}
		/**
		 * Create List Item
		 * @param {String} text
		 * @param {HTMLElement} listUrlHolder
		 */
		function createListItem(text, listUrlHolder) {
			var li = document.createElement("li");
			li.innerHTML = text;
			listUrlHolder.appendChild(li);
		}
		/**
		 * Get collected URLs from List
		 * @param {String} objId
		 * @param {HTMLElement} listUrlHolder
		 * @param {HTMLElement} txtKeywords
		 * @returns {Array}
		 */
		function getUrlCollection(objId, listUrlHolder, txtKeywords) {
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
		/**
		 * Save URL collection to Firebase DB
		 * @param {HTMLElement} listUrlHolder
		 * @param {HTMLElement} txtKeywords
		 * @param {HTMLElement} fiContainer
		 */
		function saveListToFirebase(listUrlHolder, txtKeywords, fiContainer) {
			getOptions()
				.then(function (items) {
					var userId = items.userLoginId;
					var expireDate = items.loginExpireDate;
					var currTimestamp = Math.round(Date.now() / 1000);

					if ((typeof userId === 'undefined') || (currTimestamp >= expireDate)) {
						alert('You are not logged in. Please go to the Options Menue.');
						clearForm(listUrlHolder, txtKeywords, fiContainer);
						openSettings();
						return false;
					}

					var urlCollectorRef = new Firebase("https://yeah-url-extension.firebaseio.com/" + userId + "/urlcollector").push();
					var objId = urlCollectorRef.key();
					var urlCollection = getUrlCollection(objId, listUrlHolder, txtKeywords);

					urlCollectorRef.set(urlCollection, function onComplete() {
						alert('Speicherung erfolgreich!');
						clearForm(listUrlHolder, txtKeywords, fiContainer);
					});
				})
				.catch(function (err) {
					alert('Error: ' + err);
				});
		}
		//################//
		//  		Notes			//
		//################//
		/**
		 * Clear Notes form
		 * @param {HTMLElement} txtTitle
		 * @param {HTMLElement} txtKeywordsNote 
		 * @param {HTMLElement} txtNote
		 * @param {HTMLElement} fiContainerNotesTitle
		 * @param {HTMLElement} fiContainerNotesKeywords
		 * @param {HTMLElement} fiContainerNotes
		 */
		function clearNoteForm(txtTitle, txtKeywordsNote, txtNote, fiContainerNotesTitle, fiContainerNotesKeywords, fiContainerNotes) {
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
		/**
		 * Get Note from Form
		 * @param {String} objId
		 * @param {HTMLElement} txtTitle
		 * @param {HTMLElement} txtKeywordsNote 
		 * @param {HTMLElement} txtNote
		 * @returns {Array}
		 */
		function getNoteFromForm(objId, txtTitle, txtKeywordsNote, txtNote) {
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
		/**
		 * Save Note to Firebase DB
		 * @param {HTMLElement} txtTitle
		 * @param {HTMLElement} txtKeywordsNote 
		 * @param {HTMLElement} txtNote
		 * @param {HTMLElement} fiContainerNotesTitle
		 * @param {HTMLElement} fiContainerNotesKeywords
		 * @param {HTMLElement} fiContainerNotes
		 */
		function saveNoteToFirebase(txtTitle, txtKeywordsNote, txtNote, fiContainerNotesTitle, fiContainerNotesKeywords, fiContainerNotes) {
			getOptions()
				.then(function (items) {
					var userId = items.userLoginId;
					var expireDate = items.loginExpireDate;
					var currTimestamp = Math.round(Date.now() / 1000);

					if ((typeof userId === 'undefined') || (currTimestamp >= expireDate)) {
						alert('You are not logged in. Please go to the Options Menue.');
						clearNoteForm(txtTitle, txtKeywordsNote, txtNote, fiContainerNotesTitle, fiContainerNotesKeywords, fiContainerNotes);
						openSettings();
						return;
					}

					var noteRef = new Firebase("https://yeah-url-extension.firebaseio.com/" + userId + "/notescollector").push();
					var objId = noteRef.key();
					var note = getNoteFromForm(objId, txtTitle, txtKeywordsNote, txtNote);

					noteRef.set(note, function onComplete() {
						alert('Speicherung erfolgreich!');
						clearNoteForm(txtTitle, txtKeywordsNote, txtNote, fiContainerNotesTitle, fiContainerNotesKeywords, fiContainerNotes);
					});
				})
				.catch(function (err) {
					alert('Error: ' + err);
				});
		}
		//################//
		//  		ToDos			//
		//################//
		/**
		 * Load ToDos from Firebase DB
		 * @param {HTMLElement} listTodosHolder
		 */
		function loadTodosFromFirebase(listTodosHolder) {
			getOptions()
				.then(function (items) {
					var todoRef = new Firebase("https://todoapp-appengine.firebaseio.com/todoitems");
					todoRef.on("value", function (snapshot) {
						if (listTodosHolder !== null) {
							if (listTodosHolder.children.length > 0) {
								listTodosHolder.innerHTML = "";
							}
							snapshot.forEach(function (child) {
								createListItem(child.val().text, listTodosHolder);
							}.bind(this));	
						}
					});
				})
				.catch(function (err) {
					alert("Error: " + err.message);
				});
		}
		/**
		 * Save ToDo to Firebase DB
		 * @param {HTMLElement} listTodosHolder
		 * @param {HTMLElement} txtAddTodo
		 */
		function saveToDoToFirebase(listTodosHolder, txtAddTodo) {
			var todoRef = new Firebase("https://todoapp-appengine.firebaseio.com/todoitems").push();
			todoRef.set({ text: txtAddTodo.value }, function onComplete() {
				alert("Speichern erfolgreich!");
				txtAddTodo.value = "";
			});
		}
		//################//
		//  	Settings		//
		//################//
		/**
		 * Get saved options from Chrome Browser Storage
		 * @returns {Promise}
		 */
		function getOptions() {
			return new Promise(function (resolve, reject) {
				chrome.storage.sync.get({
					userLoginId: '',
					loginExpireDate: ''
				}, function (items) {
					resolve(items);
				});
			});
		}
		/**
		 * Get Settings Page
		 */
		function openSettings() {
			if (chrome.runtime.openOptionsPage) {
				chrome.runtime.openOptionsPage();
			} else {
				window.open(chrome.runtime.getURL('options.html'));
			}
		}
		/**
		 * Make Util functions public
		 */
		return {
			clearForm: clearForm,
			getCurrentTab: getCurrentTab,
			getAllTabs: getAllTabs,
			createListItem: createListItem,
			getUrlCollection: getUrlCollection,
			saveListToFirebase: saveListToFirebase,
			clearNoteForm: clearNoteForm,
			getNoteFromForm: getNoteFromForm,
			saveNoteToFirebase: saveNoteToFirebase,
			loadTodosFromFirebase: loadTodosFromFirebase,
			saveToDoToFirebase: saveToDoToFirebase,
			getOptions: getOptions,
			openSettings: openSettings
		};
	};
	return {
		get: function () {
			if (!instance) {
				instance = setup();
			}
			return instance;
		}
	};
})(chrome, Promise, Firebase);