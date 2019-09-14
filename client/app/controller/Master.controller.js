sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/PDFViewer",
	"hahu/pmtool/model/formatter"
], function (Controller, MessageBox, PDFViewer, formatter) {
	"use strict";
	var _routeId;

	return Controller.extend("hahu.pmtool.controller.Master", {
		formatter: formatter,
		
		onInit: function () {
			// Init PDF Viewer
			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);
			// Content Density
			// debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("root").attachPatternMatched(this._onObjectMatched, this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			oRouter.getRoute("approval").attachPatternMatched(this._onObjectMatched, this);
        	this.oLocationsListTemplate = new sap.m.StandardListItem({
				type: "Navigation",
				tooltip: "{pmtool>Id}",
                title: "{pmtool>Title}",
				description: {
					path: 'pmtool>CalculationId',
					formatter: formatter.getProjectComplexity,
					type: 'sap.ui.model.type.Integer'
				},
				icon: "sap-icon://add"
            });
		},
		
		_onObjectMatched: function (oEvent) {
			debugger;
			this._detailId = parseInt(oEvent.getParameter("arguments").detailId);
			WEPPS.clearUsers();
			var users = WEPPS.readUsers();
			if (!users) {
				// get general service data
				var oModelUser = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/general/User",
					dataType: "json",
					async: false,
					success: function(data) {
						oModelUser.setData(data);
					}
				});
				var oModelUsers = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/general/Users",
					dataType: "json",
					async: false,
					success: function(data) {
						oModelUsers.setData(data);
					}
				});
				// get application service data
				var oModelApp = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/application/Rights/Default.getRights(domain='HUNGARIA',name='" + oModelUser.oData.UserName + "',app='PM Tool')",
					dataType: "json",
					async: false,
					success: function(data) {
						oModelApp.setData(data);
					}
				});
				// set rights
				var isAdmin, isControlling, isApproval;
				jQuery.each(oModelApp.oData.value, function(key, element) {
					if (element.Functionality == "Admin") {
						if (element.Right == 1) {
							isAdmin = false;
						}
					} else if (element.Functionality == "Controlling") {
						if (element.Right == 1) {
							isControlling = false;
						}
					} else if (element.Functionality == "Approval") {
						if (element.Right == 1) {
							isApproval = true;
						}
					}
				});
				WEPPS.submitUsers(oModelUser, oModelUsers, isAdmin, isControlling, isApproval);
				users = WEPPS.readUsers();
			}
			// Project list binding
			var oLocationsList = this.getView().byId("project-list");
			oLocationsList.unbindAggregation("items");
			// Approval or Not
			if (oEvent.getParameter("name") != "approval") {
				if (users.is_controlling == true) {
					oLocationsList.bindAggregation("items", {
						path: "pmtool>/Projects",
						filters: [
							new sap.ui.model.Filter({
								path: "StatusId",
								operator: "EQ",
								value1: 1
							}),
							new sap.ui.model.Filter({
								path: "Deleted",
								operator: "NE",
								value1: true
							})
						],
						template: this.oLocationsListTemplate
					});
					this.getView().byId("btnDialog").setVisible(false);
				} else if (users.is_admin == true) {
					oLocationsList.bindAggregation("items", {
						path: "pmtool>/Projects",
						filters: [
							new sap.ui.model.Filter({
								path: "Deleted",
								operator: "NE",
								value1: true
							})
						],
						template: this.oLocationsListTemplate
					});
				} else {
					oLocationsList.bindAggregation("items", {
						path: "pmtool>/Projects",
						filters: [
							new sap.ui.model.Filter({
								path: "Leader",
								operator: "EQ",
								value1: users.user.oData.TaxNumber
							}),
							new sap.ui.model.Filter({
								path: "Deleted",
								operator: "NE",
								value1: true
							})
						],
						template: this.oLocationsListTemplate
					});
				}
			} else {
				if (users.is_approval == true) {
					oLocationsList.bindAggregation("items", {
						path: "pmtool>/Projects",
						filters: [
							new sap.ui.model.Filter({
								path: "Id",
								operator: "EQ",
								value1: this._detailId
							}),
							new sap.ui.model.Filter({
								path: "StatusId",
								operator: "EQ",
								value1: 2
							})
						],
						template: this.oLocationsListTemplate
					});
					this.getView().byId("btnDialog").setVisible(false);
				}
			}
		},

		handleSearch : function (evt) {
			// create model filter
			var filters = [];
			var query = evt.getParameter("query");
			if (query && query.length > 0) {
				var filter = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}
		
			// update list binding
			var list = this.getView().byId("project-list");
			var binding = list.getBinding("items");
			binding.filter(filters);
		},
		
		handleSelectItem: function (oEvent) {
			// debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				detailId: oEvent.getSource().getSelectedItem().getBindingContext("pmtool").getObject().Id
			});
		},
		
		openHelp: function() {
			// debugger;
			var sSource = sap.ui.require.toUrl("hahu/pmtool/images") + "/help.pdf";
			this._pdfViewer.setSource(sSource);
			this._pdfViewer.setTitle("PMO Tool - Help");
			this._pdfViewer.open();
		},
		
		openReport: function() {
			// debugger;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("report");
		},

		onOpenNewIdeaDialog : function () {
			this.getOwnerComponent().openNewProjectDialog(null);
		}
	});
});