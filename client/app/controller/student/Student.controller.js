sap.ui.define([
	"pte/grund/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("pte.grund.controller.student.Student", {

		onInit: function () {
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			var oRouter = this.getRouter();

			// model
			this.getView().setModel(new JSONModel());
			
			oRouter.getRoute("student").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched : function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			
			this.refresh(oArgs.studentId);
		},

		refresh: function (studentId) {
			var oModel = this.getView().getModel();
			oModel.loadData('http://localhost:4000/api/user/' + studentId);
		},

		onShowResume : function (oEvent) {
			var oCtx = this.getView().getModel();

			this.getRouter().navTo("studentResume", {
				studentId : oCtx.getData().Id
			});
		}

	});

});
