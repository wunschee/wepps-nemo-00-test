sap.ui.define([
	"pte/grund/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("pte.grund.controller.Home", {

		onInit: function () {
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},
		
		onDisplayNotFound : function () {
			// display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "home"
			});
		},

		onNavToStudents : function () {
			this.getRouter().navTo("studentList");
		},

		onNavToStudentOverview : function (oEvent) {
			this.getRouter().navTo("studentOverview");
		}

	});

});
