// SessionManager
(function (WEPPS, $, undefined) {
	WEPPS.SessionManager = function () {};

	WEPPS.SessionManager.getUsers = function (key) {
		var users;
		// Get item over SessionStorage API
		var usersStorage = sessionStorage.getItem(key);
		if (usersStorage) {
			// Parse JSON to object
			usersStorage = JSON.parse(usersStorage);
			// Create new object
			users = new WEPPS.Users(
				usersStorage.user,
				usersStorage.users_list,
				usersStorage.is_admin,
				usersStorage.is_controlling,
				usersStorage.is_approval
			);
		}
		return users;
	};
	
	WEPPS.SessionManager.setUsers = function(key, users) {
		if (users) {
			// Serialize Object to JSON
			var usersStorage = JSON.stringify(users);
			// Set item over SessionStorage API
			sessionStorage.setItem(key, usersStorage);
		}
	};
	
	WEPPS.SessionManager.clearUsers = function() {
		sessionStorage.removeItem("users");
	};
} (window.WEPPS = window.WEPPS || {}, jQuery));