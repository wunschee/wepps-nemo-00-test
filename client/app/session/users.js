// Model Users
(function (WEPPS, $, undefined) {
	// Constructor
	WEPPS.Users = function (user, users_list, is_admin, is_controlling, is_approval) {
		this.user = user
		this.users_list = users_list;
		this.is_admin = is_admin;
		this.is_controlling = is_controlling;
		this.is_approval = is_approval;
	};
	
	WEPPS.Users.constructor = WEPPS.Users;
	
	// Sample instance method
	WEPPS.Users.prototype.log = function () {
		console.log(this.user);
		console.log(this.users_list);
		console.log(this.is_admin);
		console.log(this.is_controlling);
		console.log(this.is_approval);
	};
} (window.WEPPS = window.WEPPS || {}, jQuery));