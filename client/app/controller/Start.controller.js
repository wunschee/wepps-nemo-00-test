sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("hahu.pmtool.controller.Start", {
		onInit: function () {
			// Content Density
			// debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("root").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			debugger;
		}
	});
});