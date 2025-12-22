sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "szehomework2/model/formatter"
], (Controller, MessageBox, Filter, FilterOperator, JSONModel, formatter) => {
    "use strict";

    return Controller.extend("szehomework2.controller.PersonsList", {
        MessageBox: MessageBox,
        formatter: formatter,

        onInit() {
            let oJSONModel = new sap.ui.model.json.JSONModel();

            let oTitleTypeJSONModel = new sap.ui.model.json.JSONModel([
                {
                    key: "",
                    text: ""
                },
                {
                    key: "1",
                    text: "Customer"
                },
                {
                    key: "2",
                    text: "Sales Representative"
                },
                {
                    key: "3",
                    text: "Vice President, Sales"
                },
                {
                    key: "4",
                    text: "Sales Manager"
                },
                {
                    key: "5",
                    text: "Inside Sales Coordinator"
                },
                {
                    key: "6",
                    text: "Director/ Co-director"
                },
                {
                    key: "7",
                    text: "Staff"
                }
            ]);
            this.getView().setModel(oTitleTypeJSONModel, "TitleTypeModel");

            let oTitleOfCourtesyTypeJSONModel = new sap.ui.model.json.JSONModel([
                {
                    key: "",
                    text: ""
                },
                {
                    key: "1",
                    text: "Ms."
                },
                {
                    key: "2",
                    text: "Mr."
                },
                {
                    key: "3",
                    text: "Mrs."
                },
                {
                    key: "4",
                    text: "Dr."
                },
            ]);
            this.getView().setModel(oTitleOfCourtesyTypeJSONModel, "TitleOfCourtesyTypeModel");

        },

        onModifyPressed(oEvent) {
            sap.m.MessageToast.show("Employee can not be modified.");
        },

        onNewContact(oEvent) {
            // Modell előkészítése
            let oNewContactModel = this.getOwnerComponent().getModel("NewContact");
            if (!oNewContactModel) {
                oNewContactModel = new sap.ui.model.json.JSONModel({});
                this.getOwnerComponent().setModel(oNewContactModel, "NewContact");
            }
            oNewContactModel.setData({});

            // Fragment betöltése Promiseként
            if (!this._NewContactDialog) {
                this._NewContactDialog = sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "szehomework2.view.fragments.NewContact",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    oDialog.bindElement({
                        model: "NewContact",
                        path: "/"
                    });
                    return oDialog;
                }.bind(this));
            }
            this._NewContactDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onDialogAdd(oEvent) {
            const oComponent = this.getOwnerComponent();
            const oContactModel = oComponent.getModel("NewContact");
            const oEditableOdataModel = oComponent.getModel("editableModel");

            const oDialog = oEvent.getSource().getParent();

            const _parseDate = (sValue) => sValue ? new Date(sValue) : null;

            const oPerson = {
                // ID: Math.floor(Math.random()*100), // Sokszor jobb elhagyni, ha a szerver generálja
                LastName: oContactModel.getProperty("/LastName"),
                FirstName: oContactModel.getProperty("/FirstName"),
                Title: oContactModel.getProperty("/Title"),
                TitleOfCourtesy: oContactModel.getProperty("/TitleOfCourtesy"),
                BirthDate: _parseDate(oContactModel.getProperty("/BirthDate")),
                HireDate: _parseDate(oContactModel.getProperty("/HireDate")),
                Rating: 0,
                Address: oContactModel.getProperty("/Address"),
                City: oContactModel.getProperty("/City"),
                Region: oContactModel.getProperty("/Region"),
                PostalCode: oContactModel.getProperty("/PostalCode"),
                Country: oContactModel.getProperty("/Country"),
                HomePhone: oContactModel.getProperty("/HomePhone"),
                Extension: oContactModel.getProperty("/Extension"),
                PhotoPath: oContactModel.getProperty("/PhotoPath"),
                Notes: oContactModel.getProperty("/Notes")
            };

            oDialog.setBusy(true); // Mutassuk, hogy dolgozunk

            oEditableOdataModel.create("/Employees", oPerson, {
                success: function (oData, oResponse) {
                    oDialog.setBusy(false);
                    oDialog.close();
                    sap.m.MessageToast.show("Person added successfully!");
                    this.getOwnerComponent().getModel().refresh(true);
                },
                error: function (oError) {
                    oDialog.setBusy(false);
                    console.error("Hiba:", oError);
                    sap.m.MessageToast.show("Error occurred during save!");
                }
            });
        },

        onDialogClose(oEvent) {
            oEvent.getSource().getParent().close();
        },

        onPersonPressed(oEvent) {
            const oItem = oEvent.getParameter("listItem");
            const oContext = oItem.getBindingContext();

            if (!oContext) {
                console.error("Nem található binding context!");
                return;
            }
            const sEmployeeID = oContext.getProperty("EmployeeID");

            this.getOwnerComponent().getRouter().navTo("RoutePersonDetails", {
                EmployeeID: sEmployeeID
            });
        },

        onShowPersonDetails(oEvent) {
            const sPersonPath = oEvent.getSource().getBindingContext().getPath();
            const oComponent = this.getOwnerComponent();

            if (!oComponent.getModel("PersonDetails")) {
                oComponent.setModel(new sap.ui.model.json.JSONModel(), "PersonDetails");
            }

            if (!this._SupplierDialog) {
                this._SupplierDialog = sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "szehomework2.view.fragments.NewContact",
                    controller: this
                }).then(function (oDialog) {
                    this.getView().addDependent(oDialog);
                    return oDialog;
                }.bind(this));
            }

            oComponent.getModel().read(sPersonPath, {
                success: function (oData) {
                    oComponent.getModel("PersonDetails").setData(oData);

                    this._pSupplierDialog.then(function (oDialog) {
                        oDialog.open();
                    });
                }.bind(this),
                error: function (oError) {
                    sap.m.MessageToast.show("Error while loading the datas.");
                }
            });
        },

        onFilter(oEvent) {
            let sQuery = oEvent.getParameter("newValue");
            let oList = this.byId("personTable");
            let oBinding = oList.getBinding("items");
            let aFilters = [];

            if (sQuery) {
                // Külön szűrők létrehozása a mezőkre
                let oFilterFirstName = new sap.ui.model.Filter("FirstName", sap.ui.model.FilterOperator.Contains, sQuery);
                let oFilterLastName = new sap.ui.model.Filter("LastName", sap.ui.model.FilterOperator.Contains, sQuery);
                let oFilterTitle = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, sQuery);

                // OR kapcsolat - and: false
                let oCombinedFilter = new sap.ui.model.Filter({
                    filters: [oFilterFirstName, oFilterLastName, oFilterTitle],
                    and: false
                });

                aFilters.push(oCombinedFilter);
            }
            oBinding.filter(aFilters);
        }


    });
});