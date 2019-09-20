sap.ui.define([
	"pte/grund/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
	"use strict";

	return BaseController.extend("pte.grund.controller.student.StudentList", {

		onInit: function () {
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			var oRouter = this.getRouter();

			// model
			this.getView().setModel(new JSONModel());

			oRouter.getRoute("studentList").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched : function (oEvent) {
			this.refresh();
		},

		refresh: function () {
			var oModel = this.getView().getModel();
			oModel.loadData('http://localhost:4000/api/user');
		},

		addUser: function () {
			debugger;
			var oId = this.getView().byId('addId');
			var oUserName = this.getView().byId('addUserName');
			var iId = parseInt(oId.getValue());
			var sUserName = oUserName.getValue();
			if (!isNaN(iId) && sUserName != '') {
				var oData = {Id: iId, UserName: sUserName};
				jQuery.ajax({
					url: 'http://localhost:4000/api/user',
					dataType: 'json',
					data: oData,
					type: 'post',
					success: jQuery.proxy(function (oData) {
						oId.setValue();
						oUserName.setValue();
						this.refresh();
					}, this)
				});
			} else {
				console.log('Error occured at addUser fn: no data entered');
			}
		},

		onListItemPressed : function(oEvent){
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.getRouter().navTo("student",{
				studentId : oCtx.getProperty("Id")
			});
		}
	});
});
