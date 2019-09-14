// All Controllers only call functions from this file
(function (WEPPS, $, undefined) {
	WEPPS.submitUsers = function (user, users_list, is_admin, is_controlling, is_approval) {
		// debugger;
		// Create new object
		var users = new WEPPS.Users(user, users_list, is_admin, is_controlling, is_approval);
		// Call instance method
		// users.log();
		// Write to SessionStorage
		WEPPS.SessionManager.setUsers("users", users);
	};
	
	WEPPS.readUsers = function () {
		// debugger;
		// Read users from SessionStorage
		var users = WEPPS.SessionManager.getUsers("users");
		// If users is not null...
		if (users) {
			// Call instance method
			// users.log();
		} else {
			// Show warning
		}
		return users;
	};
	
	WEPPS.clearUsers = function () {
		// Clear users from SessionStorage
		WEPPS.SessionManager.clearUsers();
		// Reload current location
		// location.reload();
	};
} (window.WEPPS = window.WEPPS || {}, jQuery));