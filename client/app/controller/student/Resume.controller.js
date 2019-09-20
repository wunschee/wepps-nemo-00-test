sap.ui.define([
	"pte/grund/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";
	var _aValidTabKeys = ["Info", "Projects", "Hobbies", "Notes"];

	return BaseController.extend("pte.grund.controller.student.Resume", {

		onInit: function () {
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			var oRouter = this.getRouter();

			// model
			this.getView().setModel(new JSONModel());
			this.getView().setModel(new JSONModel(), "view");

			oRouter.getRoute("studentResume").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched : function (oEvent) {
			var oArgs, oView, oQuery;

			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();
			
			this.refresh(oArgs.studentId);

			oQuery = oArgs["?query"];
			if (oQuery && _aValidTabKeys.indexOf(oQuery.tab) > -1){
				oView.getModel("view").setProperty("/selectedTabKey", oQuery.tab);
				// support lazy loading for the hobbies and notes tab
				if (oQuery.tab === "Hobbies" || oQuery.tab === "Notes"){
					// the target is either "resumeTabHobbies" or "resumeTabNotes"
					this.getRouter().getTargets().display("resumeTab" + oQuery.tab);
				}
			} else {
				// the default query param should be visible at all time
				this.getRouter().navTo("studentResume", {
					studentId : oArgs.studentId,
					query: {
						tab : _aValidTabKeys[0]
					}
				},true /*no history*/);
			}
		},

		refresh: function (studentId) {
			var oModel = this.getView().getModel();
			oModel.loadData('http://localhost:4000/api/user/' + studentId);
		},

		/**
		 * We use this event handler to update the hash in case a new tab is selected.
		 * @param oEvent
		 */
		onTabSelect : function (oEvent){
			var oCtx = this.getView().getModel();

			this.getRouter().navTo("studentResume", {
				// studentId : oCtx.getProperty("Id"),
				studentId : oCtx.getData().Id,
				query: {
					tab : oEvent.getParameter("selectedKey")
				}
			},true /*without history*/);
		}

	});

});
