sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"hahu/pmtool/model/formatter"
], function (Controller, MessageToast, MessageBox, formatter) {
	"use strict";

	return Controller.extend("hahu.pmtool.controller.Approval", {
		formatter: formatter,

		onInit: function () {
			// Content Density
			debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("approval").attachPatternMatched(this._onObjectMatched, this);
			this.approvalListTemplate = new sap.m.StandardListItem({
				title: "{pmtool>ProjectId}"
			});
		},
		
		_onObjectMatched: function (oEvent) {
            debugger;
			this._detailId = parseInt(oEvent.getParameter("arguments").detailId);
			var that = this;
			// get general service data
			this._oModel_General = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/general/User",
				dataType: "json",
				async: false,
				success: function(data) {
					that._oModel_General.setData(data);
				}
			});
			// get pmtool service data
			this._oModel_PMTool = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/pmtool/Approval/Default.IsApprovable(ProjectId=" + that._detailId + ",EmployeeId='" + that._oModel_General.oData.TaxNumber + "')",
				dataType: "json",
				async: false,
				success: function(data) {
					that._oModel_PMTool.setData(data);
				}
			});

			this._oModel_PMTool_Count = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/pmtool/Approval/Default.GetApprovalWithProjectId(ProjectId=" + that._detailId + ",EmployeeId='" + that._oModel_General.oData.TaxNumber + "')",
				dataType: "json",
				async: false,
				success: function(data) {
					that._oModel_PMTool_Count.setData(data);
				}
			});
			// Controls
			this._oAccepted = this.getView().byId("isaccepted");
			this._oAcceptedWith = this.getView().byId("isacceptedwithconditions");
			this._oBonusAccepted = this.getView().byId("isprojectbonusaccepted");
			this._oDeclined = this.getView().byId("isdeclined");
			this._oComments = this.getView().byId("comments");
			this._oApproval = this.getView().byId("approval");
			// Editable options
			this._oAccepted.setEditable(this._oModel_PMTool.oData.IsApprovable);
			this._oAcceptedWith.setEditable(this._oModel_PMTool.oData.IsApprovable);
			this._oBonusAccepted.setEditable(this._oModel_PMTool.oData.IsApprovable);
			this._oDeclined.setEditable(this._oModel_PMTool.oData.IsApprovable);
			this._oComments.setEditable(this._oModel_PMTool.oData.IsApprovable);
			this._oApproval.setEnabled(this._oModel_PMTool.oData.IsApprovable);
			// binding to view
			if (this._oModel_PMTool_Count.oData != null)
			{
				this.getView().bindElement({
					path: "/Approval/Default.GetApprovalWithProjectId(ProjectId=" + this._detailId + ",EmployeeId='" + this._oModel_General.oData.TaxNumber + "')",
					model: "pmtool"
				});
			}
			// bind approval to list
			this.getView().byId("approvalList").bindAggregation("items", {
				path: "pmtool>/Approval",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "CommitteeMember",
						operator: "EQ",
						value1: this._oModel_General.oData.TaxNumber
					})
				],
				template: this.approvalListTemplate
			});
			this.getView().byId("approvalList").setVisible(false);
		},

		onApproval: function () {
			debugger;
			var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "y-MM-d"
			});
			var oNow = new Date();
			// Create Entity according oData v4 service
			var oEntry = {
				"ProjectId": this._detailId,
				"IsAccepted": this._oAccepted.getSelected(),
				"IsAcceptedWithConditions": this._oAcceptedWith.getSelected(),
				"IsProjectBonusAccepted": this._oBonusAccepted.getSelected(),
				"IsDeclined": this._oDeclined.getSelected(),
				"Comments": this._oComments.getValue(),
				"CommitteeMember": Number.parseFloat(this._oModel_General.oData.TaxNumber).toFixed(0),
				"Date": oDateTimeFormat.format(oNow)
			};
			var oList = this.getView().byId("approvalList");
			var oEntity = oList.getBinding("items").create(oEntry);
			var that = this;
			oEntity.created().then(function () {
				// Entity successfully created
				oList.unbindAggregation("items");
				that.getView().getModel("pmtool").refresh();
				that.getView().invalidate();
				// bind model to list
				oList.bindAggregation("items", {
					path: "pmtool>/Approval",
					filters: [ 
						new sap.ui.model.Filter({
							path: "ProjectId",
							operator: "EQ",
							value1: that._detailId
						})
						// ,
						// new sap.ui.model.Filter({
						// 	path: "Deleted",
						// 	operator: "NE",
						// 	value1: true
						// })
					],
					template: that.approvalListTemplate
				});
				that._oAccepted.setSelected();
				that._oAcceptedWith.setSelected();
				that._oBonusAccepted.setSelected();
				that._oDeclined.setSelected();
				that._oComments.setValue();
			});
		},

		onNavBack: function () {
			var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
			var m1 = this.getView().getModel("i18n").getResourceBundle().getText("Message.master.navback");
			var m2 = this.getView().getModel("i18n").getResourceBundle().getText("Message.master.navback2");
			var that = this;
			MessageBox.warning(m1 + "\n" + m2, {
				actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
				styleClass: bCompact ? "sapUiSizeCompact" : "",
				onClose: function(sAction) {
					if (sAction === sap.m.MessageBox.Action.OK) {
						var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
						oRouter.navTo("root");
					}
				}
			});
		}
	});
});