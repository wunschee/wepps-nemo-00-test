sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"hahu/pmtool/model/formatter"
], function (Controller, MessageToast, MessageBox, formatter) {
	"use strict";

	return Controller.extend("hahu.pmtool.controller.Report", {
		formatter: formatter,

		onInit: function () {
			// Content Density
			// debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("report").attachPatternMatched(this._onObjectMatched, this);
		},
		
		_onObjectMatched: function (oEvent) {
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
		},

		onNavBack: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("root");
		}
	});
});