sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"jquery.sap.global",
	"sap/m/MessageBox",
	"sap/m/PDFViewer",
	"hahu/pmtool/model/formatter"
], function (Controller, JSONModel, jQuery, MessageBox, PDFViewer, formatter) {
	"use strict";

	return Controller.extend("hahu.pmtool.controller.Master", {
		formatter: formatter,
		
		onInit: function () {
			// Init PDF Viewer
			this._pdfViewer = new PDFViewer();
			this.getView().addDependent(this._pdfViewer);

			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

			// router
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("root").attachPatternMatched(this._onObjectMatched, this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			oRouter.getRoute("approval").attachPatternMatched(this._onObjectMatched, this);
			
			// model
			let oModel = new JSONModel();
			this.getView().setModel(oModel);
		},

		_onObjectMatched: function (oEvent) {
			debugger;
			this._detailId = parseInt(oEvent.getParameter('arguments').detailId);
			
			this.refresh();
		},

		refresh: function () {
			let oModel = this.getView().getModel();
			oModel.loadData('http://localhost:4000/api/user');
		},

		addUser: function () {
			debugger;
			let oId = this.getView().byId('addId');
			let oUserName = this.getView().byId('addUserName');
			let iId = parseInt(oId.getValue());
			let sUserName = oUserName.getValue();
			if (!isNaN(iId) && sUserName != '') {
				let oData = {Id: iId, UserName: sUserName};
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

		handleSearch : function (evt) {
			// create model filter
			let filters = [];
			let query = evt.getParameter("query");
			if (query && query.length > 0) {
				let filter = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, query);
				filters.push(filter);
			}
		
			// update list binding
			let list = this.getView().byId("user-list");
			let binding = list.getBinding("items");
			binding.filter(filters);
		},
		
		handleSelectItem: function (oEvent) {
			debugger;
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				detailId: oEvent.getSource().getSelectedItem().getBindingContext().getObject().Id
			});
		},
		
		openHelp: function() {
			// debugger;
			let sSource = sap.ui.require.toUrl("hahu/pmtool/images") + "/help.pdf";
			this._pdfViewer.setSource(sSource);
			this._pdfViewer.setTitle("PMO Tool - Help");
			this._pdfViewer.open();
		},
		
		openReport: function() {
			// debugger;
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("report");
		},

		onOpenNewIdeaDialog : function () {
			this.getOwnerComponent().openNewProjectDialog(null);
		}
	});
});