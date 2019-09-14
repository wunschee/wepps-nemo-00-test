sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createViewModel: function() {
			// Custom view model for handling enabled attributes
			var viewProperties = {
				bEnabled: true,
				sListMode: "Delete",
				bVisibleItLeader: false,
				bVisibleNr: false,
				bVisibleCapex: false,
				bVisibleCustomMember: false,
				bVisiblePayOff: false,
				bRequiredPayOff: false,
				bVisibleTarget: false,
				bRequiredTarget: false,
				bVisibleDemarcation: false,
				bRequiredDemarcation: false,
				bVisibleRisk: false,
				bRequiredRisk: false,
				bRequiredResource: false,
				bVisibleInvestment: false,
				bVisibleFinish: false
			};
			var viewModel = new JSONModel(viewProperties);
			return viewModel;
		}

	};
});