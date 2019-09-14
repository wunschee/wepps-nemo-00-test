sap.ui.define(["jquery.sap.global"], function (jQuery) {
    "use strict";
	return {
		getStatusColor: function(bValue) {
			// debugger;
			if (bValue != null) {
				switch(bValue) {
					case "Igen":
						return "#70d660";
					case "Nem":
						return "#e13f3f";
				}
			} else {
				return "#000000";
			}
		},

		getProjectComplexity: function(calculationId) {
			// debugger;
			if (calculationId != null) {
				var oModel = new sap.ui.model.resource.ResourceModel({
					bundleUrl: "i18n/i18n.properties"
				});
				var resourceBundle = oModel.getResourceBundle();
				switch(calculationId) {
					case "1":
						return resourceBundle.getText("Label.dialog.small");
					case "2":
						return resourceBundle.getText("Label.dialog.medium");
					case "3":
						return resourceBundle.getText("Label.dialog.complex");
				}
			}
		},

		getUserFromTaxNumber: function(taxNumber) {
			// debugger;
			if (taxNumber != null) {
				var users = WEPPS.readUsers();
				if (users) {
					var DisplayName;
					jQuery.each(users.users_list.oData.value, function(key, element) {
						if (element.TaxNumber == taxNumber) {
							DisplayName = element.DisplayName;
						}
					});
					if (DisplayName != null) {
						return DisplayName;
					} else {
						return "";
					}
				} else {
					return "";
				}
			} else {
				return "";
			}
		},

		isApprovable: function(projectId) {
			// debugger;
			if (projectId != null) {
				// get general service data
				var oModel_General = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/general/User",
					dataType: "json",
					async: false,
					success: function(data) {
						oModel_General.setData(data);
					}
				});
				// get pmtool service data
				var oModel_PMTool = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/pmtool/Approval/Default.IsApprovable(ProjectId=" + projectId + ",EmployeeId='" + oModel_General.oData.TaxNumber + "')",
					dataType: "json",
					async: false,
					success: function(data) {
						oModel_PMTool.setData(data);
					}
				});
				// evaluation
				if (oModel_PMTool.oData.IsApprovable === true)
				{
					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},

		getSumOfResources: function(projectId) {
			// debugger;
			if (projectId != null) {
				// get pmtool service data
				var oModel_PMTool = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/pmtool/Resources?$filter=ProjectId eq " + projectId + " and Deleted ne true&$select=Hours",
					dataType: "json",
					async: false,
					success: function(data) {
						oModel_PMTool.setData(data);
					}
				});
				var oResources = 0;
				jQuery.each(oModel_PMTool.oData.value, function(key, element) {
					oResources += element.Hours;
				});
				return oResources;
			} else {
				return 0;
			}
		},

		getSumOfInvestments: function(projectId) {
			// debugger;
			if (projectId != null) {
				// get pmtool service data
				var oModel_PMTool = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/pmtool/Investments?$filter=ProjectId eq " + projectId + " and Deleted ne true&$select=Money",
					dataType: "json",
					async: false,
					success: function(data) {
						oModel_PMTool.setData(data);
					}
				});
				var oInvestments = 0;
				jQuery.each(oModel_PMTool.oData.value, function(key, element) {
					oInvestments += element.Money;
				});
				return oInvestments;
			} else {
				return 0;
			}
		},

		getSumOfCosts: function(orgitCosts, travelCosts, externalCosts, finishCosts, otherCosts) {
			// debugger;
			orgitCosts = orgitCosts != null ? orgitCosts.replace(/\s+/g, '') : "";
			orgitCosts = parseInt(orgitCosts) || 0;
			travelCosts = travelCosts != null ? travelCosts.replace(/\s+/g, '') : "";
			travelCosts = parseInt(travelCosts) || 0;
			externalCosts = externalCosts != null ? externalCosts.replace(/\s+/g, '') : "";
			externalCosts = parseInt(externalCosts) || 0;
			finishCosts = finishCosts != null ? finishCosts.replace(/\s+/g, '') : "";
			finishCosts = parseInt(finishCosts) || 0;
			otherCosts = otherCosts != null ? otherCosts.replace(/\s+/g, '') : "";
			otherCosts = parseInt(otherCosts) || 0;
			return orgitCosts + travelCosts + externalCosts + finishCosts + otherCosts;
		},

		getDateDiff: function(date1, date2) {
			// debugger;
			var oModel_i18n = new sap.ui.model.resource.ResourceModel({
				bundleUrl: "i18n/i18n.properties"
			});
			var resourceBundle = oModel_i18n.getResourceBundle();
			if (date1 != null && date2 != null) {
				// date1 conversion
				date1 = date1.split(".");
				if (date1[2].trim().length === 1) {
					date1 = "0" + date1[2].trim() + " " + date1[1].replace("á", "a").replace("ú", "u") + " " + date1[0];
				} else {
					date1 = date1[2].trim() + " " + date1[1].replace("á", "a").replace("ú", "u") + " " + date1[0];
				}
				// date2 conversion
				date2 = date2.split(".");
				if (date2[2].trim().length === 1) {
					date2 = "0" + date2[2].trim() + " " + date2[1].replace("á", "a").replace("ú", "u") + " " + date2[0];
				} else {
					date2 = date2[2].trim() + " " + date2[1].replace("á", "a").replace("ú", "u") + " " + date2[0];
				}
				// calculation and display
				var oneDay = 24*60*60*1000;
				var startDate = new Date(date1);
				var stopDate = new Date(date2);
				var diffDays = Math.round(Math.abs((startDate.getTime() - stopDate.getTime())/(oneDay)));
				return diffDays + " " + resourceBundle.getText("Label.dialog.leadtime.days");
			} else {
				return 0 + " " + resourceBundle.getText("Label.dialog.leadtime.days"); 
			}
		},

		getIsAdmin: function(projectId) {
			debugger;
			var users = WEPPS.readUsers();
			if (users.is_admin == true) {
				return true;
			} else {
				return false;
			}
		},

		getIsControlling: function(projectId) {
			debugger;
			var users = WEPPS.readUsers();
			if (users.is_controlling == true) {
				return true;
			} else {
				return false;
			}
		},

		getIsApproval: function(projectId) {
			debugger;
			var users = WEPPS.readUsers();
			if (users.is_approval == true) {
				return true;
			} else {
				return false;
			}
		}
	};
});