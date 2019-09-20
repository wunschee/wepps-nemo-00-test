sap.ui.define([
	"pte/grund/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("pte.grund.controller.student.overview.StudentOverview", {

		onInit: function () {
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});
