sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"jquery.sap.global",
	"hahu/pmtool/model/formatter",
	"sap/ui/core/routing/History"
], function (Controller, jQuery, formatter, History) {
	// "use strict";

	return Controller.extend("hahu.pmtool.controller.Detail", {
		formatter: formatter,

		onInit: function () {
			// Content Density
			// debugger;
			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("detail").attachPatternMatched(this._onObjectMatched, this);
			oRouter.getRoute("approval").attachPatternMatched(this._onObjectMatched, this);
			
			// Templates
			this.memberListTemplate = new sap.m.StandardListItem({
				type: "Active",
				title: {
					path: 'pmtool>EmployeeId',
					formatter: formatter.getUserFromTaxNumber,
					type: 'sap.ui.model.type.String'
				},
				icon: "sap-icon://employee-pane"
			});
			this.custommemberListTemplate = new sap.m.StandardListItem({
				type: "Active",
				title: "{pmtool>Member}",
				icon: "sap-icon://employee-pane"
			});
			this.documentListTemplate = new sap.m.CustomListItem({
				type: "Active",
				content : [
					new sap.m.HBox({
						items: [
							new sap.ui.core.Icon({
								size: "2rem",
								src: "sap-icon://excel-attachment"
							}),
							new sap.m.VBox({
								items: [
									new sap.m.Label({ text: "{pmtool>FileName}", design: "Bold" }),
									new sap.m.Label({ text: "{pmtool>Date}" }),
									new sap.m.Label({ text: "{pmtool>FileData}", visible: false })
								]
							})
						]
					})
				]
			});
			this.riskListTemplate = new sap.m.StandardListItem({
				type: "Active",
				title: "{pmtool>Risk}",
				description: "{pmtool>Action}",
				icon: "sap-icon://message-warning"
			});
			this.milestoneListTemplate = new sap.m.StandardListItem({
				type: "Active",
				title: "{pmtool>Description}",
				description: "{pmtool>Objective}",
				info: "{pmtool>Start} - {pmtool>Stop}",
				icon: "sap-icon://gantt-bars"
			});
			this.resourceListTemplate = new sap.m.StandardListItem({
				type: "Active",
				title: {
					path: 'pmtool>EmployeeId',
					formatter: formatter.getUserFromTaxNumber,
					type: 'sap.ui.model.type.String'
				},
				description: "{pmtool>Hours}",
				icon: "sap-icon://employee-pane"
			});
			this.investmentListTemplate = new sap.m.StandardListItem({
				type: "Active",
				title: "{pmtool>Description}",
				description: "{pmtool>Money}",
				info: "{pmtool>IsActivationRequired}",
				icon: "sap-icon://gantt-bars"
			});
			this.approvalListTemplate = new sap.m.StandardListItem({
				title: "{pmtool>ProjectId}"
			});
		},
		
		_onObjectMatched: function (oEvent) {
			debugger;
			this._detailId = parseInt(oEvent.getParameter("arguments").detailId);
			this.getView().bindElement({
				path: "/Projects(" + this._detailId + ")",
				model: "pmtool"
			});

			// details
			var oModel_PMTool = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/pmtool/Projects(" + this._detailId + ")",
				dataType: "json",
				async: false,
				success: function(data) {
					oModel_PMTool.setData(data);
				}
			});

			// required fields
			if (oModel_PMTool.oData.CalculationId == 1) {
				this.getView().getModel("viewModel").setProperty("/bVisibleItLeader", false);
				this.getView().getModel("viewModel").setProperty("/bVisibleNr", false);
				this.getView().getModel("viewModel").setProperty("/bVisibleCapex", false);
				this.getView().getModel("viewModel").setProperty("/bVisibleCustomMember", false);
				this.getView().getModel("viewModel").setProperty("/bVisiblePayOff", false);
				this.getView().getModel("viewModel").setProperty("/bRequiredPayOff", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleTarget", false);
				this.getView().getModel("viewModel").setProperty("/bRequiredTarget", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleDemarcation", false);
				this.getView().getModel("viewModel").setProperty("/bRequiredDemarcation", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleRisk", false);
				this.getView().getModel("viewModel").setProperty("/bRequiredRisk", undefined);
				this.getView().getModel("viewModel").setProperty("/bRequiredResource", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleInvestment", false);
				this.getView().getModel("viewModel").setProperty("/bVisibleFinish", false);
			} else if (oModel_PMTool.oData.CalculationId == 2) {
				this.getView().getModel("viewModel").setProperty("/bVisibleItLeader", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleNr", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleCapex", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleCustomMember", true);
				this.getView().getModel("viewModel").setProperty("/bVisiblePayOff", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredPayOff", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleTarget", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredTarget", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleDemarcation", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredDemarcation", undefined);
				this.getView().getModel("viewModel").setProperty("/bVisibleRisk", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredRisk", undefined);
				this.getView().getModel("viewModel").setProperty("/bRequiredResource", true);
				if (oModel_PMTool.oData.IsCapex == true) {
					this.getView().getModel("viewModel").setProperty("/bVisibleInvestment", true);
				} else {
					this.getView().getModel("viewModel").setProperty("/bVisibleInvestment", false);
				}
				this.getView().getModel("viewModel").setProperty("/bVisibleFinish", true);
			} else if (oModel_PMTool.oData.CalculationId == 3) {
				this.getView().getModel("viewModel").setProperty("/bVisibleItLeader", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleNr", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleCapex", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleCustomMember", true);
				this.getView().getModel("viewModel").setProperty("/bVisiblePayOff", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredPayOff", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleTarget", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredTarget", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleDemarcation", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredDemarcation", true);
				this.getView().getModel("viewModel").setProperty("/bVisibleRisk", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredRisk", true);
				this.getView().getModel("viewModel").setProperty("/bRequiredResource", true);
				if (oModel_PMTool.oData.IsCapex == true) {
					this.getView().getModel("viewModel").setProperty("/bVisibleInvestment", true);
				} else {
					this.getView().getModel("viewModel").setProperty("/bVisibleInvestment", false);
				}
				this.getView().getModel("viewModel").setProperty("/bVisibleFinish", true);
			}

			// bind members to list
			this.getView().byId("memberList").bindAggregation("items", {
				path: "pmtool>/Members",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.memberListTemplate
			});
			// deletemember list
			this.getView().byId("deleteMemberList").bindAggregation("items", {
				path: "pmtool>/Members",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "EQ",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.memberListTemplate
			});
			// bind steeringcommittee to list
			this.getView().byId("committeeList").bindAggregation("items", {
				path: "pmtool>/SteeringCommittee",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.memberListTemplate
			});
			// bind custommembers to list
			this.getView().byId("custommemberList").bindAggregation("items", {
				path: "pmtool>/CustomMembers",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Member"
				}),
				template: this.custommemberListTemplate
			});
			// bind documents to list
			this.getView().byId("documentList").bindAggregation("items", {
				path: "pmtool>/Documents",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Date",
					descending : "true"
				}),
				template: this.documentListTemplate
			});
			// bind risks to list
			this.getView().byId("riskList").bindAggregation("items", {
				path: "pmtool>/Risks",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Risk"
				}),
				template: this.riskListTemplate
			});
			// bind milestones to list
			this.getView().byId("milestoneList").bindAggregation("items", {
				path: "pmtool>/Milestones",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Start"
				}),
				template: this.milestoneListTemplate
			});
			// bind resources to list
			this.getView().byId("resourceList").bindAggregation("items", {
				path: "pmtool>/Resources",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.resourceListTemplate
			});
			this.getView().byId("sumofResources").unbindProperty("text");
			this.getView().byId("sumofResources").unbindElement("pmtool");
			this.getView().byId("sumofResources").bindElement({
				path: "/Resources/Default.SumOfResources(ProjectId=" + this._detailId + ")",
				model: "pmtool"
			});
			this.getView().byId("sumofResources").bindProperty("text", "pmtool>Hours");
			// deleteresources list
			this.getView().byId("deleteResourceList").bindAggregation("items", {
				path: "pmtool>/Resources",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "EQ",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.resourceListTemplate
			});
			// bind investments to list
			this.getView().byId("investmentList").bindAggregation("items", {
				path: "pmtool>/Investments",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "ProjectId"
				}),
				template: this.investmentListTemplate
			});
			this.getView().byId("sumofInvestments").unbindProperty("text");
			this.getView().byId("sumofInvestments").unbindElement("pmtool");
			this.getView().byId("sumofInvestments").bindElement({
				path: "/Investments/Default.SumOfInvestments(ProjectId=" + this._detailId + ")",
				model: "pmtool"
			});
			this.getView().byId("sumofInvestments").bindProperty("text", "pmtool>Money");
			// Detail sections
			if (oEvent.getParameter("name") != "approval") {
				if (oModel_PMTool.oData.IsAccepted == true) {
					this.getView().byId("commitSeparator").setVisible(false);
					this.getView().byId("commitData").setVisible(false);
					this.getView().byId("factSeparator").setVisible(true);
					this.getView().byId("factData").setVisible(true);
				} else {
					this.getView().byId("commitSeparator").setVisible(true);
					this.getView().byId("commitData").setVisible(true);
					this.getView().byId("factSeparator").setVisible(false);
					this.getView().byId("factData").setVisible(false);
				}				
				this.getView().byId("approvalSeparator").setVisible(false);
				this.getView().byId("approvalData").setVisible(false);				
				debugger;
				// committed?
				if (oModel_PMTool.oData.StatusId == 1) {
					this.getView().getModel("viewModel").setProperty("/bEnabled", true);
					this.getView().getModel("viewModel").setProperty("/sListMode", "Delete");
				} else {
					this.getView().getModel("viewModel").setProperty("/bEnabled", false);
					this.getView().getModel("viewModel").setProperty("/sListMode", undefined);
				}
				// get session data
				var users = WEPPS.readUsers();
				if (users.is_controlling == true) {
					// Set viewModel property
					this.getView().getModel("viewModel").setProperty("/bEnabled", false);
					this.getView().getModel("viewModel").setProperty("/sListMode", undefined);
				} else if (users.is_admin == true) {
					this.getView().getModel("viewModel").setProperty("/bEnabled", true);
					this.getView().getModel("viewModel").setProperty("/sListMode", "Delete");
				}
			// Approval sections
			} else {
				this.getView().byId("commitSeparator").setVisible(false);
				this.getView().byId("commitData").setVisible(false);
				this.getView().byId("approvalSeparator").setVisible(true);
				this.getView().byId("approvalData").setVisible(true);
				this.getView().byId("factSeparator").setVisible(false);
				this.getView().byId("factData").setVisible(false);
				// get session data
				var users = WEPPS.readUsers();
				if (users.is_approval == true) {
					// Set viewModel property
					this.getView().getModel("viewModel").setProperty("/bEnabled", false);
					this.getView().getModel("viewModel").setProperty("/sListMode", undefined);
				}
				var that = this;
				// get pmtool service data
				this._oModel_PMTool = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/pmtool/Approval/Default.IsApprovable(ProjectId=" + that._detailId + ",EmployeeId='" + users.user.oData.TaxNumber + "')",
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
					url: "https://hahu_openui5/services/pmtool/Approval/Default.GetApprovalWithProjectId(ProjectId=" + that._detailId + ",EmployeeId='" + users.user.oData.TaxNumber + "')",
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
					this.getView().byId("approvalForm").bindElement({
						path: "/Approval/Default.GetApprovalWithProjectId(ProjectId=" + this._detailId + ",EmployeeId='" + users.user.oData.TaxNumber + "')",
						model: "pmtool"
					});
					this._oAccepted.bindProperty("selected", "pmtool>IsAccepted");
					this._oAcceptedWith.bindProperty("selected", "pmtool>IsAcceptedWithConditions");
					this._oBonusAccepted.bindProperty("selected", "pmtool>IsProjectBonusAccepted");
					this._oDeclined.bindProperty("selected", "pmtool>IsDeclined");
					this._oComments.bindProperty("value", "pmtool>Comments");
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
							value1: users.user.oData.TaxNumber
						})
					],
					template: this.approvalListTemplate
				});
				this.getView().byId("approvalList").setVisible(false);
			}
		},

		onEditComplexity: function(oEvent) {
			debugger;
			var oContext = oEvent.getSource().getBindingContext("pmtool");
			var oItem = oContext.getObject();
			this.getOwnerComponent().openNewProjectDialog(oItem.Id);
		},

		onAddLeaderIt: function() {
			debugger;
			var oLeaderIt = this.getView().byId("leaderItInput");
			var oKey = oLeaderIt.getSelectedKey();
			if (oKey === "") {
				oLeaderIt.getBindingContext("pmtool").setProperty("LeaderIt", null);
			} else {
				oLeaderIt.getBindingContext("pmtool").setProperty("LeaderIt", oKey);
			}
		},

		onDeleteLeaderIt: function() {
			debugger;
			var oLeaderIt = this.getView().byId("leaderItInput");
			oLeaderIt.getBindingContext("pmtool").setProperty("LeaderIt", null);
		},

		onAddClient: function() {
			debugger;
			var oClient = this.getView().byId("clientInput");
			var oKey = oClient.getSelectedKey();
			if (oKey === "") {
				oClient.getBindingContext("pmtool").setProperty("Client", null);
			} else {
				oClient.getBindingContext("pmtool").setProperty("Client", oKey);
			}
		},

		onDeleteClient: function() {
			debugger;
			var oClient = this.getView().byId("clientInput");
			oClient.getBindingContext("pmtool").setProperty("Client", null);
		},

		handleSuggest: function(oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var sTermLower = sTerm.toLowerCase();
			var sTermUpper = sTerm.toUpperCase();
			var sTermUpLow = sTerm[0].toUpperCase() + sTerm.substr(1).toLowerCase();
			var sIdOfInput = oEvent.getSource().getId();
			var oInput = sIdOfInput.split('--')[1];
			var aFilters = [];
			if (sTerm) {
				if (oInput == "leaderItInput") {
					aFilters.push(new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.Contains, "HFI"));
				}
				aFilters.push(new sap.ui.model.Filter("DisplayName", sap.ui.model.FilterOperator.Contains, sTermLower));
				aFilters.push(new sap.ui.model.Filter("DisplayName", sap.ui.model.FilterOperator.Contains, sTermUpper));
				aFilters.push(new sap.ui.model.Filter("DisplayName", sap.ui.model.FilterOperator.Contains, sTermUpLow));
			}
			oEvent.getSource().getBinding("suggestionItems").filter(aFilters);
		},

		onSortListAlphabetically: function(oEvent) {
			debugger;
			var sIdOfInput = oEvent.getSource().getId() + "-listUl";
			var ul = document.getElementById(sIdOfInput);
			var new_ul = ul.cloneNode(false);
            var lis = [];
            for(var i = ul.childNodes.length; i--;) {
                if(ul.childNodes[i].nodeName === 'LI')
                    lis.push(ul.childNodes[i]);
            }
            lis.sort(function(a, b) {
				return a.childNodes[0].innerText.toLowerCase().localeCompare(b.childNodes[0].innerText.toLowerCase());
            });
            for(var i = 0; i < lis.length; i++) {
				new_ul.appendChild(lis[i]);
			}
            ul.parentNode.replaceChild(new_ul, ul);
		},

		onAddMember: function() {
			debugger;
			var oMember = this.getView().byId("memberInput");
			var oKey = oMember.getSelectedKey();
			// Member or Resource entity exists?
			var that = this;
			var oMembers = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/pmtool/Members?$filter=ProjectId eq " + that._detailId + " and EmployeeId eq " + oKey,
				dataType: "json",
				async: false,
				success: function(data) {
					oMembers.setData(data);
				}
			});
			var oResources = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/pmtool/Resources?$filter=ProjectId eq " + that._detailId + " and EmployeeId eq " + oKey,
				dataType: "json",
				async: false,
				success: function(data) {
					oResources.setData(data);
				}
			});
			if (oMembers.oData.value.length != 0 && oResources.oData.value.length != 0) {
				// Update entities
				var oDeleteMemberList = this.getView().byId("deleteMemberList");
				var oMemberBinding = oDeleteMemberList.getBinding("items");
				var oMemberContext = oMemberBinding.getHeaderContext();
				oMemberContext.setProperty("/Members(" + oMembers.oData.value[0].Id + ")/Deleted", false);
				var oDeleteResourceList = this.getView().byId("deleteResourceList");
				var oResourceBinding = oDeleteResourceList.getBinding("items");
				var oResourceContext = oResourceBinding.getHeaderContext();
				oResourceContext.setProperty("/Resources(" + oResources.oData.value[0].Id + ")/Deleted", false);

				oDeleteResourceList.unbindAggregation("items");
				oDeleteMemberList.unbindAggregation("items");

				this.getView().getModel("pmtool").refresh();
				this.getView().invalidate();
				
				oDeleteResourceList.bindAggregation("items", {
					path: "pmtool>/Resources",
					filters: [ 
						new sap.ui.model.Filter({
							path: "ProjectId",
							operator: "EQ",
							value1: this._detailId
						}),
						new sap.ui.model.Filter({
							path: "Deleted",
							operator: "EQ",
							value1: true
						})
					],
					sorter: new sap.ui.model.Sorter({
						path : "EmployeeId"
					}),
					template: this.resourceListTemplate
				});
				oDeleteMemberList.bindAggregation("items", {
					path: "pmtool>/Members",
					filters: [ 
						new sap.ui.model.Filter({
							path: "ProjectId",
							operator: "EQ",
							value1: this._detailId
						}),
						new sap.ui.model.Filter({
							path: "Deleted",
							operator: "EQ",
							value1: true
						})
					],
					sorter: new sap.ui.model.Sorter({
						path : "EmployeeId"
					}),
					template: this.memberListTemplate
				});
				oMember.setValue();
			} else {
				// Create Entity according oData v4 service
				var oEntry = {
					"ProjectId": this._detailId,
					"EmployeeId": oKey,
					"Deleted": null
				};
				var oList = this.getView().byId("memberList");
				var oEntity = oList.getBinding("items").create(oEntry);
				var that = this;
				oEntity.created().then(function () {
					var oEntry2 = {
						"ProjectId": that._detailId,
						"EmployeeId": oKey,
						"Hours": null,
						"Deleted": null
					};
					var oList2 = that.getView().byId("resourceList");
					var oEntity2 = oList2.getBinding("items").create(oEntry2);
					oEntity2.created().then(function () {
						that.getView().getModel("pmtool").refresh();
						that.getView().invalidate();
						oMember.setValue();
					});
				});
			}
		},

		onDeleteMember: function(oEvent) {
			debugger;
			// Update Resource entity
			var oContext = oEvent.getParameter("listItem").getBindingContext("pmtool");
			var oItem = oContext.getObject();
			var that = this;
			var oResources = new sap.ui.model.json.JSONModel();
			jQuery.ajax({
				type: "GET",
				contentType: "application/json",
				url: "https://hahu_openui5/services/pmtool/Resources?$filter=ProjectId eq " + that._detailId + " and EmployeeId eq " + oItem.EmployeeId,
				dataType: "json",
				async: false,
				success: function(data) {
					oResources.setData(data);
				}
			});
			var oResourceList = this.getView().byId("resourceList");
			var oMemberList = this.getView().byId("memberList");
			if (oResources.oData.value.length != 0) {
				// Update entity
				var oResourceBinding = oResourceList.getBinding("items");
				var oResourceContext = oResourceBinding.getHeaderContext();
				oResourceContext.setProperty("/Resources(" + oResources.oData.value[0].Id + ")/Deleted", true);
			}
			// Update Member entity
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			oResourceList.unbindAggregation("items");
			oMemberList.unbindAggregation("items");

			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			
			oResourceList.bindAggregation("items", {
				path: "pmtool>/Resources",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.resourceListTemplate
			});
			oMemberList.bindAggregation("items", {
				path: "pmtool>/Members",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.memberListTemplate
			});
		},

		onAddCommittee: function() {
			debugger;
			var oCommittee = this.getView().byId("committeeInput");
			var oKey = oCommittee.getSelectedKey();
			// Create Entity according oData v4 service
			var oEntry = {
				"ProjectId": this._detailId,
				"EmployeeId": oKey,
				"Deleted": null
			};
			var oList = this.getView().byId("committeeList");
			var oEntity = oList.getBinding("items").create(oEntry);
			var that = this;
			oEntity.created().then(function () {
				that.getView().getModel("pmtool").refresh();
				that.getView().invalidate();
				oCommittee.setValue();
			});
		},

		onDeleteCommittee: function(oEvent) {
			debugger;
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			var oList = this.getView().byId("committeeList");
			oList.unbindAggregation("items");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			oList.bindAggregation("items", {
				path: "pmtool>/SteeringCommittee",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "EmployeeId"
				}),
				template: this.memberListTemplate
			});
		},

		onAddCustomMember: function() {
			debugger;
			var oMember = this.getView().byId("custommemberInput");
			var oKey = oMember.getValue();
			// Create Entity according oData v4 service
			var oEntry = {
				"ProjectId": this._detailId,
				"Member": oKey,
				"Deleted": null
			};
			var oList = this.getView().byId("custommemberList");
			var oEntity = oList.getBinding("items").create(oEntry);
			var that = this;
			oEntity.created().then(function () {
				that.getView().getModel("pmtool").refresh();
				that.getView().invalidate();
				oMember.setValue();
			});
		},

		onDeleteCustomMember: function(oEvent) {
			debugger;
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			var oList = this.getView().byId("custommemberList");
			oList.unbindAggregation("items");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			oList.bindAggregation("items", {
				path: "pmtool>/CustomMembers",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Member"
				}),
				template: this.custommemberListTemplate
			});
		},

		handleTypeMissmatch: function(oEvent) {
			var aFileTypes = oEvent.getSource().getFileType();
			jQuery.each(aFileTypes, function(key, value) {aFileTypes[key] = "*." +  value;});
			var sSupportedFileTypes = aFileTypes.join(", ");
			var ofileUploader = this.getView().byId("fileUploader");
			ofileUploader.setValueState(sap.ui.core.ValueState.Error);
			ofileUploader.setValueStateText(this.getView().getModel("i18n").getResourceBundle().getText("TypeMismatch") + ": " + this.getView().getModel("i18n").getResourceBundle().getText("TypeMismatchDescription") + oEvent.getParameter("fileType") + " " + this.getView().getModel("i18n").getResourceBundle().getText("TypeMismatchDescription2") + " " + sSupportedFileTypes);
			ofileUploader.focus();
		},

		handleValueChange: function(oEvent) {
			var that = this;
			var oFile = oEvent.getParameter("files")[0];
			var base64_marker = "data:" + oFile.type + ";base64,";
			var oFileReader = new FileReader();
			oFileReader.onload = function(evt) {
				// Locate base64 content
				var base64Index = evt.target.result.indexOf(base64_marker) + base64_marker.length;
				// Get base64 content
				var base64 = evt.target.result.substring(base64Index);
				// Date Pattern
				var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "y-MM-d"
				});
				var oNow = new Date();
				// Create Entity according oData v4 service
				var oEntry = {
					"ProjectId": that._detailId,
					"FileName": oFile.name,
					"FileMimeType": oFile.type,
					"FileData": base64,
					"Date": oDateTimeFormat.format(oNow),
					"Deleted": null
				};
				// debugger;
				var oList = that.getView().byId("documentList");
				var oEntity = oList.getBinding("items").create(oEntry);
				oEntity.created().then(function () {
					that.getView().getModel("pmtool").refresh();
					that.getView().invalidate();
				});
			};
			oFileReader.readAsDataURL(oFile);
			var ofileUploader = this.getView().byId("fileUploader");
			ofileUploader.clear();
			ofileUploader.setValueState(sap.ui.core.ValueState.None);
			document.activeElement.blur();
		},

		onPressdocumentList: function (oEvent) {
			debugger;
			// The model that is bound to the item
			// the name of your model should be a parameter in getBindingContext
			var oContext = oEvent.getParameter("listItem").getBindingContext("pmtool");
			// Get object
			var oItem = oContext.getObject();
			// Converting object
			var u8_2 = new Uint8Array(atob(oItem.FileData).split("").map(function(c) {
				return c.charCodeAt(0);
			}));
			var blob = new Blob([u8_2], {type: oItem.FileMimeType})
			// Downloading (IE and Chrome)
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, oItem.FileName);
			} else {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				var url = window.URL.createObjectURL(blob);
				a.href = url;
				a.download = oItem.FileName;
				a.click();
				window.URL.revokeObjectURL(url);
			}
		},

		onDeleteDocument: function (oEvent) {
			debugger;
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			var oList = this.getView().byId("documentList");
			oList.unbindAggregation("items");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			oList.bindAggregation("items", {
				path: "pmtool>/Documents",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Date",
					descending : "true"
				}),
				template: this.documentListTemplate
			});
		},
		
		onUpdate: function () {
			debugger;
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
		},

		onAddRisk: function() {
			debugger;
			var oRisk = this.getView().byId("riskInput");
			var oAction = this.getView().byId("actionInput");
			// Create Entity according oData v4 service
			var oEntry = {
				"ProjectId": this._detailId,
				"Risk": oRisk.getValue(),
				"Action": oAction.getValue(),
				"Deleted": null
			};
			var oList = this.getView().byId("riskList");
			var oEntity = oList.getBinding("items").create(oEntry);
			var that = this;
			oEntity.created().then(function () {
				that.getView().getModel("pmtool").refresh();
				that.getView().invalidate();
				oRisk.setValue();
				oAction.setValue();
			});
		},

		onModifyRisk: function() {
			// Unbind risk properties
			this.getView().byId("riskInput").unbindProperty("value");
			this.getView().byId("riskInput").unbindElement("pmtool");
			this.getView().byId("actionInput").unbindProperty("value");
			this.getView().byId("actionInput").unbindElement("pmtool");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			this.getView().byId("riskInput").setValue();
			this.getView().byId("actionInput").setValue();
			this.getView().byId("AddRisk").setVisible(true);
			this.getView().byId("ModifyRisk").setVisible(false);
		},

		onPressRiskList: function(oEvent) {
			debugger;
			var oContext = oEvent.getParameter("listItem").getBindingContext("pmtool");
			// Get object
			var oItem = oContext.getObject();
			// Bind property to riskInput
			this.getView().byId("riskInput").bindElement({
				path: "/Risks(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("riskInput").bindValue("pmtool>Risk");
			// Bind property to actionInput
			this.getView().byId("actionInput").bindElement({
				path: "/Risks(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("actionInput").bindValue("pmtool>Action");
			// Buttons visibility			
			this.getView().byId("AddRisk").setVisible(false);
			this.getView().byId("ModifyRisk").setVisible(true);
		},

		onDeleteRisk: function(oEvent) {
			debugger;
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			var oList = this.getView().byId("riskList");
			oList.unbindAggregation("items");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			oList.bindAggregation("items", {
				path: "pmtool>/Risks",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Risk"
				}),
				template: this.riskListTemplate
			});
		},

		onAddMilestone: function() {
			debugger;
			var oDescription = this.getView().byId("milestoneDescriptionInput");
			var oObjective = this.getView().byId("milestoneObjectiveInput");
			var oStart = this.getView().byId("milestoneStartDate");
			var oStop = this.getView().byId("milestoneStopDate");
			var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "y-MM-d"
			});
			// Create Entity according oData v4 service
			var oEntry = {
				"ProjectId": this._detailId,
				"Description": oDescription.getValue(),
				"Objective": oObjective.getValue(),
				"Start": oDateTimeFormat.format(oStart.getDateValue()),
				"Stop": oDateTimeFormat.format(oStop.getDateValue()),
				"Deleted": null
			};
			var oList = this.getView().byId("milestoneList");
			var oEntity = oList.getBinding("items").create(oEntry);
			var that = this;
			oEntity.created().then(function () {
				that.getView().getModel("pmtool").refresh();
				that.getView().invalidate();
				oDescription.setValue();
				oObjective.setValue();
				oStart.setValue();
				oStop.setValue();
			});
		},

		onModifyMilestone: function(){
			// Unbind milestone properties
			this.getView().byId("milestoneDescriptionInput").unbindProperty("value");
			this.getView().byId("milestoneDescriptionInput").unbindElement("pmtool");
			this.getView().byId("milestoneObjectiveInput").unbindProperty("value");
			this.getView().byId("milestoneObjectiveInput").unbindElement("pmtool");
			this.getView().byId("milestoneStartDate").unbindProperty("value");
			this.getView().byId("milestoneStartDate").unbindElement("pmtool");
			this.getView().byId("milestoneStopDate").unbindProperty("value");
			this.getView().byId("milestoneStopDate").unbindElement("pmtool");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			this.getView().byId("milestoneDescriptionInput").setValue();
			this.getView().byId("milestoneObjectiveInput").setValue();
			this.getView().byId("milestoneStartDate").setValue();
			this.getView().byId("milestoneStopDate").setValue();
			this.getView().byId("AddMilestone").setVisible(true);
			this.getView().byId("ModifyMilestone").setVisible(false);
		},

		onPressMilestoneList: function(oEvent) {
			debugger;
			var oContext = oEvent.getParameter("listItem").getBindingContext("pmtool");
			// Get object
			var oItem = oContext.getObject();
			// Bind property to milestoneDescriptionInput
			this.getView().byId("milestoneDescriptionInput").bindElement({
				path: "/Milestones(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("milestoneDescriptionInput").bindValue("pmtool>Description");
			// Bind property to milestoneObjectiveInput
			this.getView().byId("milestoneObjectiveInput").bindElement({
				path: "/Milestones(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("milestoneObjectiveInput").bindValue("pmtool>Objective");
			// Bind property to milestoneStartDate
			this.getView().byId("milestoneStartDate").bindElement({
				path: "/Milestones(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("milestoneStartDate").bindValue("pmtool>Start");
			// Bind property to milestoneStopDate
			this.getView().byId("milestoneStopDate").bindElement({
				path: "/Milestones(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("milestoneStopDate").bindValue("pmtool>Stop");
			// Buttons visibility			
			this.getView().byId("AddMilestone").setVisible(false);
			this.getView().byId("ModifyMilestone").setVisible(true);
		},

		onDeleteMilestone: function(oEvent) {
			debugger;
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			var oList = this.getView().byId("milestoneList");
			oList.unbindAggregation("items");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			oList.bindAggregation("items", {
				path: "pmtool>/Milestones",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "Start"
				}),
				template: this.milestoneListTemplate
			});
		},

		onModifyResource: function(){
			// Unbind resource properties
			this.getView().byId("resourceMemberInput").unbindProperty("value");
			this.getView().byId("resourceMemberInput").unbindElement("pmtool");
			this.getView().byId("resourceHoursInput").unbindProperty("value");
			this.getView().byId("resourceHoursInput").unbindElement("pmtool");
			this.getView().byId("sumofResources").unbindProperty("text");
			this.getView().byId("sumofResources").unbindElement("pmtool");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			this.getView().byId("sumofResources").bindElement({
				path: "/Resources/Default.SumOfResources(ProjectId=" + this._detailId + ")",
				model: "pmtool"
			});
			this.getView().byId("sumofResources").bindProperty("text", "pmtool>Hours");
			this.getView().byId("resourceMemberInput").setValue();
			this.getView().byId("resourceHoursInput").setValue();
			this.getView().byId("ModifyResource").setVisible(false);
		},

		onPressResourceList: function(oEvent) {
			debugger;
			var oContext = oEvent.getParameter("listItem").getBindingContext("pmtool");
			// Get object
			var oItem = oContext.getObject();
			// Bind property to resourceMemberInput
			this.getView().byId("resourceMemberInput").bindElement({
				path: "/Resources(" + oItem.Id + ")",
				model: "pmtool"
			});
			// Bind property to resourceHoursInput
			this.getView().byId("resourceHoursInput").bindElement({
				path: "/Resources(" + oItem.Id + ")",
				model: "pmtool"
			});
			// Set resourceMemberInput value
			// this.getView().byId("resourceMemberInput").bindValue("pmtool>EmployeeId");
			this.getView().byId("resourceMemberInput").bindProperty("value", {
				path: 'pmtool>EmployeeId',
				formatter: formatter.getUserFromTaxNumber,
				type: 'sap.ui.model.type.String'
			});			
			// Set resourceHoursInput value
			this.getView().byId("resourceHoursInput").bindValue("pmtool>Hours");
			// Buttons visibility
			this.getView().byId("ModifyResource").setVisible(true);
			this.onSortListAlphabetically(oEvent);
		},

		onAddInvestment: function() {
			debugger;
			var oDesc = this.getView().byId("investmentDescriptionInput");
			var oCost = this.getView().byId("investmentCostInput");
			var oActivation = this.getView().byId("isActivationRequired");
			// Create Entity according oData v4 service
			var oEntry = {
				"ProjectId": this._detailId,
				"Description": oDesc.getValue(),
				"Money": parseInt(oCost.getValue()),
				"IsActivationRequired": oActivation.getSelected(),
				"Deleted": null
			};
			var oList = this.getView().byId("investmentList");
			var oEntity = oList.getBinding("items").create(oEntry);
			var that = this;
			oEntity.created().then(function () {
				that.getView().getModel("pmtool").refresh();
				that.getView().invalidate();
				oDesc.setValue();
				oCost.setValue();
				oActivation.setSelected();
			});
		},

		onModifyInvestment: function(){
			// Unbind investment properties
			this.getView().byId("investmentDescriptionInput").unbindProperty("value");
			this.getView().byId("investmentDescriptionInput").unbindElement("pmtool");
			this.getView().byId("investmentCostInput").unbindProperty("value");
			this.getView().byId("investmentCostInput").unbindElement("pmtool");
			this.getView().byId("isActivationRequired").unbindProperty("selected");
			this.getView().byId("isActivationRequired").unbindElement("pmtool");
			this.getView().byId("sumofInvestments").unbindProperty("text");
			this.getView().byId("sumofInvestments").unbindElement("pmtool");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			this.getView().byId("sumofInvestments").bindElement({
				path: "/Investments/Default.SumOfInvestments(ProjectId=" + this._detailId + ")",
				model: "pmtool"
			});
			this.getView().byId("sumofInvestments").bindProperty("text", "pmtool>Money");
			this.getView().byId("investmentDescriptionInput").setValue();
			this.getView().byId("investmentCostInput").setValue();
			this.getView().byId("isActivationRequired").setSelected();
			this.getView().byId("AddInvestment").setVisible(true);
			this.getView().byId("ModifyInvestment").setVisible(false);
		},

		onPressInvestmentList: function(oEvent) {
			debugger;
			var oContext = oEvent.getParameter("listItem").getBindingContext("pmtool");
			// Get object
			var oItem = oContext.getObject();
			// Bind property to investmentDescriptionInput
			this.getView().byId("investmentDescriptionInput").bindElement({
				path: "/Investments(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("investmentDescriptionInput").bindValue("pmtool>Description");
			// Bind property to investmentCostInput
			this.getView().byId("investmentCostInput").bindElement({
				path: "/Investments(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("investmentCostInput").bindValue("pmtool>Money");
			// Bind property to isActivationRequired
			this.getView().byId("isActivationRequired").bindElement({
				path: "/Investments(" + oItem.Id + ")",
				model: "pmtool"
			});
			this.getView().byId("isActivationRequired").bindProperty("selected", "pmtool>IsActivationRequired");
			// Buttons visibility			
			this.getView().byId("AddInvestment").setVisible(false);
			this.getView().byId("ModifyInvestment").setVisible(true);
		},

		onDeleteInvestment: function(oEvent) {
			debugger;
			oEvent.getParameter("listItem").getBindingContext("pmtool").setProperty("Deleted", true);
			var oList = this.getView().byId("investmentList");
			oList.unbindAggregation("items");
			this.getView().getModel("pmtool").refresh();
			this.getView().invalidate();
			oList.bindAggregation("items", {
				path: "pmtool>/Investments",
				filters: [ 
					new sap.ui.model.Filter({
						path: "ProjectId",
						operator: "EQ",
						value1: this._detailId
					}),
					new sap.ui.model.Filter({
						path: "Deleted",
						operator: "NE",
						value1: true
					})
				],
				sorter: new sap.ui.model.Sorter({
					path : "ProjectId"
				}),
				template: this.investmentListTemplate
			});
		},

		onCommit: function () {
			debugger;
			var oDateTimeFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "y-MM-d"
			});
			var oNow = new Date();
			this.getView().getBindingContext("pmtool").setProperty("StatusId", 2);
			this.getView().getBindingContext("pmtool").setProperty("RequestedDate", oDateTimeFormat.format(oNow));
			this.getView().getModel("viewModel").setProperty("/bEnabled", false);
			this.getView().getModel("viewModel").setProperty("/sListMode", undefined);
		},

		onApproval: function () {
			debugger;
			var users = WEPPS.readUsers();
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
				"CommitteeMember": Number.parseFloat(users.user.oData.TaxNumber).toFixed(0),
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
				// everybody made a decision or first declined,
				// then close process of approval
				that._iCommitteeCount = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/pmtool/Steeringcommittee?$filter=ProjectId eq " + that._detailId + "",
					dataType: "json",
					async: false,
					success: function(data) {
						that._iCommitteeCount.setData(data);
					}
				});
				that._iApprovalCount = new sap.ui.model.json.JSONModel();
				jQuery.ajax({
					type: "GET",
					contentType: "application/json",
					url: "https://hahu_openui5/services/pmtool/Approval?$filter=ProjectId eq " + that._detailId + "",
					dataType: "json",
					async: false,
					success: function(data) {
						that._iApprovalCount.setData(data);
					}
				});
				if (that._iCommitteeCount.oData.value.length == that._iApprovalCount.oData.value.length || that._oDeclined.getSelected() == true) {
					that.getView().getBindingContext("pmtool").setProperty("StatusId", 3);
					that.getView().getBindingContext("pmtool").setProperty("ApprovalDate", oDateTimeFormat.format(oNow));
					if (that._oDeclined.getSelected() == false) {
						that.getView().getBindingContext("pmtool").setProperty("IsAccepted", true);
					} else {
						that.getView().getBindingContext("pmtool").setProperty("IsDeclined", true);
					}
				}
				that._oAccepted.setEditable(false);
				that._oAcceptedWith.setEditable(false);
				that._oBonusAccepted.setEditable(false);
				that._oDeclined.setEditable(false);
				that._oComments.setEditable(false);
				that._oApproval.setEnabled(false);
			});
		},

		onNavBack: function () {
			// Nav to master / show master / whatever
			var oSplitApp = this.getView().getParent().getParent();
			if (!sap.ui.Device.phone) {
				/* On phone there is no master-detail pair, 
				 but a single navContainer => so navigate within this navContainer: */
				var oMaster = oSplitApp.getMasterPages()[0];
				oSplitApp.toMaster(oMaster, "flip");
			} else {
				oSplitApp.showMaster();
			}
		}
	});
});