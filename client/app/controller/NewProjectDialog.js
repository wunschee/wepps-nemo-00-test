sap.ui.define([
    "sap/ui/base/ManagedObject",
    "jquery.sap.global"
    ], function (ManagedObject, jQuery) {
	"use strict";
	return ManagedObject.extend("hahu.pmtool.controller.NewProjectDialog", {
		constructor : function (oView) {
            this._oView = oView;
		},
		exit : function () {
			delete this._oView;
		},
		open : function (detailId) {
			var oView = this._oView;
            var oDialog = oView.byId("newprojectDialog");
            var _calculationId = null;
            this._detailId = detailId;
            var that = this;
			// create dialog lazily
			if (!oDialog) {
				var oFragmentController = {
                    onOptionSelected: function() {
                        // debugger;
                        var oModel = new sap.ui.model.resource.ResourceModel({
                            bundleUrl: "i18n/i18n.properties"
                        });
                        var resourceBundle = oModel.getResourceBundle();
                        var optionA = sap.ui.core.Fragment.byId(oView.getId(),"optionA").getSelected();
                        var optionB = sap.ui.core.Fragment.byId(oView.getId(),"optionB").getSelected();
                        var optionC = sap.ui.core.Fragment.byId(oView.getId(),"optionC").getSelected();
                        var optionD = sap.ui.core.Fragment.byId(oView.getId(),"optionD").getSelected();
                        var optionE = sap.ui.core.Fragment.byId(oView.getId(),"optionE").getSelected();
                        var optionF = sap.ui.core.Fragment.byId(oView.getId(),"optionF").getSelected();
                        if ((optionA === true && optionD === true)
                        || (optionA === true && optionE === true)
                        || (optionA === true && optionF === true)
                        || (optionB === true && optionD === true)) {
                            _calculationId = 1;
                            sap.ui.core.Fragment.byId(oView.getId(), "resultArea").setText(resourceBundle.getText("Label.dialog.small"));
                        } else if ((optionB === true && optionE === true)
                        || (optionB === true && optionF === true)
                        || (optionC === true && optionD === true)
                        || (optionC === true && optionE === true)) {
                            _calculationId = 2;
                            sap.ui.core.Fragment.byId(oView.getId(), "resultArea").setText(resourceBundle.getText("Label.dialog.medium"));
                        } else if (optionC === true && optionF === true) {
                            _calculationId = 3;
                            sap.ui.core.Fragment.byId(oView.getId(), "resultArea").setText(resourceBundle.getText("Label.dialog.complex"));
                        } else {
                            _calculationId = null;
                        }
                    },
					onCloseDialog : function () {
                        // debugger;
						oDialog.close();
                    },
                    onSave : function() {
                        debugger;
                        if (that._detailId != null) {
                            if (_calculationId != null) {
                                var otitleInput = sap.ui.core.Fragment.byId(oView.getId(), "titleInput");
                                var oContext = otitleInput.getBindingContext("pmtool");
                                oContext.setProperty("CalculationId", _calculationId);
                                otitleInput.unbindProperty("value");
                                otitleInput.unbindElement("pmtool");
                                // var oList = sap.ui.core.Fragment.byId(oView.getId(), "newprojectList");
                                // oList.unbindAggregation("items");
                                
                                // oView.unbindElement();
                                
                                oView.getModel("pmtool").refresh();
                                oView.invalidate();
                                
                                // oView.bindElement({
                                //     path: "/Projects(" + _detailId + ")",
                                //     model: "pmtool"
                                // });
                                // debugger;
                                oDialog.close();
                            }
                        } else {
                            if (_calculationId != null) {
                                // Date Pattern
                                var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                                    pattern: "yyyy-MM-dd'T'HH:mm:ss'+02:00'"
                                });
                                var oNow = new Date();
                                // get session data
                                var users = WEPPS.readUsers();
                                // Create Entity according oData v4 service
                                // // oDateTimeFormat.format(oNow)
                                var oEntry = {
                                    "CalculationId": _calculationId,
                                    "Title": sap.ui.core.Fragment.byId(oView.getId(),"titleInput").getValue(),
                                    "Leader": Number.parseFloat(users.user.oData.TaxNumber).toFixed(0),
                                    "LeaderIt": null,
                                    "Client": null,
                                    "IsTypeFast": null,
                                    "IsTypeIt": null,
                                    "IsTypeSmart": null,
                                    "IsTypeStrategic": null,
                                    "IsTypeDigitalization": null,
                                    "IsTypeOther": null,
                                    "IsTypeConfidental": null,
                                    "Nr": null,
                                    "IsCapex": null,
                                    "Start": null,
                                    "Stop": null,
                                    "Motivation": null,
                                    "Objective": null,
                                    "IsTargetLtt": null,
                                    "IsTargetQuality": null,
                                    "IsTargetProduktivity": null,
                                    "Demarcation": null,
                                    "IsBudgetPlanned": null,
                                    "IsProjectBonus": null,
                                    "OrgitDescription": null,
                                    "OrgitCosts": null,
                                    "TravelDescription": null,
                                    "TravelCosts": null,
                                    "ExternalDescription": null,
                                    "ExternalCosts": null,
                                    "FinishDescription": null,
                                    "FinishCosts": null,
                                    "OtherDescription": null,
                                    "OtherCosts": null,
                                    "StatusId": 1,
                                    "RequestedDate": null,
                                    "ApprovalDate": null,
                                    "Deleted": null
                                };
                                // debugger;
                                var oList = sap.ui.core.Fragment.byId(oView.getId(), "newprojectList");
                                var oResourceList = sap.ui.core.Fragment.byId(oView.getId(), "resourceList");
                                var oBinding = oList.getBinding("items");
                                if (oBinding == undefined) {
                                    var oItemListTemplate = new sap.m.StandardListItem({
                                        title: "{pmtool>Leader}",
                                        description: "{pmtool>CalculationId}"
                                    });
                                    oList.bindAggregation("items", {
                                        path: "pmtool>/Projects",
                                        template: oItemListTemplate
                                    });
                                }
                                var oResourceBinding = oResourceList.getBinding("items");
                                if (oResourceBinding == undefined) {
                                    var oItemListTemplate = new sap.m.StandardListItem({
                                        title: "{pmtool>EmployeeId}",
                                        description: "{pmtool>Hours}"
                                    });
                                    oResourceList.bindAggregation("items", {
                                        path: "pmtool>/Resources",
                                        template: oItemListTemplate
                                    });
                                }
                                var oEntity = oList.getBinding("items").create(oEntry);
                                debugger;
                                oEntity.created().then(function (data) {
                                    var oResourceEntry = {
                                        "ProjectId": oEntity.getProperty("Id"),
                                        "EmployeeId": Number.parseFloat(users.user.oData.TaxNumber).toFixed(0),
                                        "Hours": null,
                                        "Deleted": null
                                    };
                                    var oResourceEntity = oResourceList.getBinding("items").create(oResourceEntry);
                                    oResourceEntity.created().then(function () {
                                        oList.unbindAggregation("items");
                                        oResourceList.unbindAggregation("items");
                                        oView.getModel("pmtool").refresh();
                                        oView.invalidate();
                                        // debugger;
                                        oDialog.close();
                                    });
                                });
                            }
                        }
                    }
				};
				// create dialog via fragment factory
				oDialog = sap.ui.xmlfragment(oView.getId(), "hahu.pmtool.view.NewProjectDialog", oFragmentController);
				// connect dialog to the root view of this component (models, lifecycle)
                oView.addDependent(oDialog);
                // forward compact/cozy style into dialog
                jQuery.sap.syncStyleClass(oView.getController().getOwnerComponent().getContentDensityClass(), oView, oDialog);
			}
            debugger;
            sap.ui.core.Fragment.byId(oView.getId(), "titleInput").unbindProperty("value");
            if (this._detailId != null) {
                sap.ui.core.Fragment.byId(oView.getId(), "titleInput").bindElement({
                    path: "/Projects(" + this._detailId + ")",
				    model: "pmtool"
                });
                sap.ui.core.Fragment.byId(oView.getId(), "titleInput").bindValue("pmtool>Title");
            }
            // Radio Group RESET
            var rg1 = sap.ui.core.Fragment.byId(oView.getId(),"RG1");
            rg1.setSelectedIndex(-1);
            var rg2 = sap.ui.core.Fragment.byId(oView.getId(),"RG2");
            rg2.setSelectedIndex(-1);
            // calculation reset
            sap.ui.core.Fragment.byId(oView.getId(), "resultArea").setText();
            // bind model to list
            var oItemListTemplate = new sap.m.StandardListItem({
                title: "{pmtool>Leader}",
                description: "{pmtool>CalculationId}"
            });
            sap.ui.core.Fragment.byId(oView.getId(), "newprojectList").bindAggregation("items", {
                path: "pmtool>/Projects",
                template: oItemListTemplate
            });
            oItemListTemplate = new sap.m.StandardListItem({
                title: "{pmtool>EmployeeId}",
                description: "{pmtool>Hours}"
            });
            sap.ui.core.Fragment.byId(oView.getId(), "resourceList").bindAggregation("items", {
                path: "pmtool>/Resources",
                template: oItemListTemplate
            });
            // hide list
            sap.ui.core.Fragment.byId(oView.getId(), "newprojectList").setVisible(false);
            sap.ui.core.Fragment.byId(oView.getId(), "resourceList").setVisible(false);
			oDialog.open(this._detailId);
		}
	});
});