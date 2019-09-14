sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"hahu/pmtool/model/models",
	"hahu/pmtool/controller/NewProjectDialog"
], function (UIComponent, Device, models, NewProjectDialog) {
	"use strict";

	return UIComponent.extend("hahu.pmtool.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// set the view model
			this.setModel(models.createViewModel(), "viewModel");

			// set dialog's
            this._newprojectDialog = new NewProjectDialog(this.getRootControl());
		},

        getContentDensityClass : function () {
			if (!this._sContentDensityClass) {
				if (!sap.ui.Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		exit : function () {
            this._newprojectDialog.destroy();
            delete this._newprojectDialog;
		},
		
        openNewProjectDialog : function (detailId) {
			this._newprojectDialog.open(detailId);
		}
	});
});