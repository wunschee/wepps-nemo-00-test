sap.ui.define([
	"pte/grund/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/ViewSettingsDialog",
	"sap/m/ViewSettingsItem"
], function(
	BaseController,
	JSONModel,
	Filter,
	FilterOperator,
	Sorter,
	ViewSettingsDialog,
	ViewSettingsItem
) {
	"use strict";

	return BaseController.extend("pte.grund.controller.student.overview.StudentOverviewContent", {

		onInit: function () {
			// Content Density
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			
			var oRouter = this.getRouter();

			// model
			this.getView().setModel(new JSONModel());

			this._oTable = this.byId("studentsTable");
			this._oVSD = null;
			this._sSortField = null;
			this._bSortDescending = false;
			this._aValidSortFields = ["UserName", "DateOfEntry"];
			this._sSearchQuery = null;
			this._oRouterArgs = null;

			this._initViewSettingsDialog();

			// make the search bookmarkable
			oRouter.getRoute("studentOverview").attachMatched(this._onRouteMatched, this);

		},

		_onRouteMatched : function (oEvent) {
			this.refresh();
			// save the current query state
			this._oRouterArgs = oEvent.getParameter("arguments");
			this._oRouterArgs.query = this._oRouterArgs["?query"] || {};

			if (this._oRouterArgs.query) {

				// search/filter via URL hash
				this._applySearchFilter(this._oRouterArgs.query.search);

				// sorting via URL hash
				this._applySorter(this._oRouterArgs.query.sortField, this._oRouterArgs.query.sortDescending);

				// show dialog via url hash
				if (!!this._oRouterArgs.query.showDialog) {
					this._oVSD.open();
				}

			}
		},

		refresh: function () {
			var oModel = this.getView().getModel();
			oModel.loadData('http://localhost:4000/api/user');
		},

		onSortButtonPressed : function (oEvent) {
			var oRouter = this.getRouter();
			this._oRouterArgs.query.showDialog = 1;
			oRouter.navTo("studentOverview",this._oRouterArgs);
		},

		onSearchStudentsTable : function (oEvent) {
			var oRouter = this.getRouter();
			// update the hash with the current search term
			this._oRouterArgs.query.search = oEvent.getSource().getValue();
			oRouter.navTo("studentOverview",this._oRouterArgs, true /*no history*/);
		},

		_initViewSettingsDialog : function () {
			var oRouter = this.getRouter();
			this._oVSD = new ViewSettingsDialog("vsd", {
				confirm: function (oEvent) {
					var oSortItem = oEvent.getParameter("sortItem");
					this._oRouterArgs.query.sortField = oSortItem.getKey();
					this._oRouterArgs.query.sortDescending = oEvent.getParameter("sortDescending");
					delete this._oRouterArgs.query.showDialog;
					oRouter.navTo("studentOverview",this._oRouterArgs, true /*without history*/);
				}.bind(this),
				cancel : function (oEvent){
					delete this._oRouterArgs.query.showDialog;
					oRouter.navTo("studentOverview",this._oRouterArgs, true /*without history*/);
				}.bind(this)
			});

			// init sorting (with simple sorters as custom data for all fields)
			this._oVSD.addSortItem(new ViewSettingsItem({
				key: "UserName",
				text: "User Name",
				selected: true // by default the MockData is sorted by UserName
			}));

			this._oVSD.addSortItem(new ViewSettingsItem({
				key: "DateOfEntry",
				text: "Date of Entry",
				selected: false
			}));
		},

		_applySearchFilter : function (sSearchQuery) {
			var aFilters, oFilter, oBinding;

			// first check if we already have this search value
			if (this._sSearchQuery === sSearchQuery) {
				return;
			}
			this._sSearchQuery = sSearchQuery;
			this.byId("searchField").setValue(sSearchQuery);

			// add filters for search
			aFilters = [];
			if (sSearchQuery && sSearchQuery.length > 0) {
				aFilters.push(new Filter("UserName", FilterOperator.Contains, sSearchQuery));
				aFilters.push(new Filter("DateOfEntry", FilterOperator.Contains, sSearchQuery));
				oFilter = new Filter({ filters: aFilters, and: false });  // OR filter
			} else {
				oFilter = null;
			}

			// update list binding
			oBinding = this._oTable.getBinding("items");
			oBinding.filter(oFilter, "Application");
		},

		/**
		 * Applies sorting on our table control.
		 * @param {string} sSortField		the name of the field used for sorting
		 * @param {string} sortDescending	true or false as a string or boolean value to specify a descending sorting
		 * @private
		 */
		_applySorter : function (sSortField, sortDescending){
			var bSortDescending, oBinding, oSorter;

			// only continue if we have a valid sort field
			if (sSortField && this._aValidSortFields.indexOf(sSortField) > -1) {

				// convert  the sort order to a boolean value
				if (typeof sortDescending === "string") {
					bSortDescending = sortDescending === "true";
				} else if (typeof sortDescending === "boolean") {
					bSortDescending =  sortDescending;
				} else {
					bSortDescending = false;
				}

				// sort only if the sorter has changed
				if (this._sSortField && this._sSortField === sSortField && this._bSortDescending === bSortDescending) {
					return;
				}

				this._sSortField = sSortField;
				this._bSortDescending = bSortDescending;
				oSorter = new Sorter(sSortField, bSortDescending);

				// sync with View Settings Dialog
				this._syncViewSettingsDialogSorter(sSortField, bSortDescending);

				oBinding = this._oTable.getBinding("items");
				oBinding.sort(oSorter);
			}
		},

		_syncViewSettingsDialogSorter : function (sSortField, bSortDescending) {
			// the possible keys are: "Id" | "FirstName" | "LastName"
			// Note: no input validation is implemented here
			this._oVSD.setSelectedSortItem(sSortField);
			this._oVSD.setSortDescending(bSortDescending);
		},

		onItemPressed : function (oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getParameter("listItem");
			oCtx = oItem.getBindingContext();

			this.getRouter().navTo("studentResume",{
				studentId : oCtx.getProperty("Id"),
				query : {
					tab : "Info"
				}
			});
		}
	});
});