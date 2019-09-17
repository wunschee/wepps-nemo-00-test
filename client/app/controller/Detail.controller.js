sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"hahu/pmtool/model/formatter",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, jQuery, formatter, History) {
	"use strict";

	return Controller.extend("hahu.pmtool.controller.Detail", {
		formatter: formatter,

		onInit: function () {
			debugger;
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// router
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			oRouter.getRoute("approval").attachPatternMatched(this._onObjectMatched, this);
			
			// model
			let oModel = new JSONModel();
			this.getView().setModel(oModel);
		},
		
		_onObjectMatched: function (oEvent) {
			debugger;
			this._detailId = parseInt(oEvent.getParameter('arguments').detailId);
			
			this.refresh(this._detailId);
		},

		refresh: function (detailId) {
			let oModel = this.getView().getModel();
			oModel.loadData('http://localhost:4000/api/user/' + detailId);
		},

		onNavBack: function () {
			// Nav to master / show master / whatever
			let oSplitApp = this.getView().getParent().getParent();
			if (!sap.ui.Device.phone) {
				/* On phone there is no master-detail pair, 
				 but a single navContainer => so navigate within this navContainer: */
				let oMaster = oSplitApp.getMasterPages()[0];
				oSplitApp.toMaster(oMaster, "flip");
			} else {
				oSplitApp.showMaster();
			}
		}
	});
});