sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("hahu.pmtool.controller.Main", {
		onInit: function () {
			// Content Density
			// debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
		}
	});
});