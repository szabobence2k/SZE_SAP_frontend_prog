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
                    key: "Customer",
                    text: "Customer"
                },
                {
                    key: "Sales Representative",
                    text: "Sales Representative"
                },
                {
                    key: "Vice President, Sales",
                    text: "Vice President, Sales"
                },
                {
                    key: "Sales Manager",
                    text: "Sales Manager"
                },
                {
                    key: "Inside Sales Coordinator",
                    text: "Inside Sales Coordinator"
                },
                {
                    key: "Director/ Co-director",
                    text: "Director/ Co-director"
                },
                {
                    key: "Staff",
                    text: "Staff"
                }
            ]);
            this.getView().setModel(oTitleTypeJSONModel, "TitleTypeModel");

            this.getOwnerComponent().getModel("editableModel").setUseBatch(false);
        },

        onModifyPressed(oEvent) {
            sap.m.MessageToast.show("Employee can not be modified.");
        },

        onNewContact(oEvent) {
            let oNewContactModel = this.getOwnerComponent().getModel("NewContact");
            if (!oNewContactModel) {
                oNewContactModel = new sap.ui.model.json.JSONModel({});
                this.getOwnerComponent().setModel(oNewContactModel, "NewContact");
            }
            oNewContactModel.setData({});

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

        /*onDialogAdd(oEvent) {
            const oComponent = this.getOwnerComponent();
            const oEditableModel = oComponent.getModel("editableModel");
            const oContactModel = oComponent.getModel("NewContact");
            const oDialog = oEvent.getSource().getParent();
            console.log("2. Modellek létrejöttek");
            const _parseDate = (sValue) => sValue ? new Date(sValue) : null;
            const sFullName = oContactModel.getProperty("/LastName") + " " + oContactModel.getProperty("/FirstName");

            const oPerson = {
                ID: Math.floor(Math.random() * 100),
                Name: sFullName,
                Title: oContactModel.getProperty("/Title"),
                TitleOfCourtesy: oContactModel.getProperty("/TitleOfCourtesy"),
                BirthDate: _parseDate(oContactModel.getProperty("/BirthDate")),
                HireDate: _parseDate(oContactModel.getProperty("/HireDate")),
                Address: oContactModel.getProperty("/Address"),
                City: oContactModel.getProperty("/City"),
                Region: oContactModel.getProperty("/Region"),
                PostalCode: oContactModel.getProperty("/PostalCode"),
                Country: oContactModel.getProperty("/Country"),
                HomePhone: oContactModel.getProperty("/HomePhone"),
                Extension: oContactModel.getProperty("/Extension"),
                PhotoPath: oContactModel.getProperty("/PhotoPath"),
                Notes: oContactModel.getProperty("/Notes"),
                

                Description: oContactModel.getProperty("/Notes"),
                ReleaseDate: oContactModel.getProperty("/HireDate"),
                Rating: 0,
                Price: "19.99"

            };

            const oSimpleSupplier = {
                Name: sFullName
            };
            console.log("3. Küldendő adatok:", oPerson);
            oDialog.setBusy(true); // Mutassuk, hogy dolgozunk

            oEditableModel.create("/Suppliers", oPerson, {
                success: function (oData) {
                    oDialog.setBusy(false);
                    oDialog.close();
                    sap.m.MessageToast.show("Person added successfully!");
                    this.getOwnerComponent().getModel().refresh(true);
                }.bind(this),
                error: function (oError) {
                    console.log("4. HIBA történt:", oError);
                    oDialog.setBusy(false);
                    sap.m.MessageToast.show("Error occurred: " + oError.message);
                }.bind(this)
            });
            oEditableModel.create("/Products", oSimpleSupplier, {
                success: function (oData) {
                    oDialog.setBusy(false);
                    oDialog.close();
                    sap.m.MessageToast.show("Success! (Saved as Product)");
                }.bind(this),
                error: function (oError) {
                    oDialog.setBusy(false);
                    sap.m.MessageBox.error("Error: " + oError.message);
                }
            });
        },*/

        onDialogAdd(oEvent) {
            const oComponent = this.getOwnerComponent();
            const oEditableModel = oComponent.getModel("editableModel");
            const oContactModel = oComponent.getModel("NewContact");
            const oDialog = oEvent.getSource().getParent();
            const sFullName = oContactModel.getProperty("/LastName") + " " + oContactModel.getProperty("/FirstName");
            const iRandomID = Math.floor(Math.random() * 2000);

            const oSimpleProduct = {
                ID: iRandomID,
                Name: sFullName,
                Description: oContactModel.getProperty("/Title"),
                ReleaseDate: oContactModel.getProperty("/HireDate"),
                Rating: 5,
                Price: "5.00"
            };
            oDialog.setBusy(true);

            oEditableModel.create("/Products", oSimpleProduct, {
                success: function (oData) {
                    oDialog.setBusy(false);
                    oDialog.close();
                    sap.m.MessageToast.show("Success! Saved into Table Products! ID: " + iRandomID);
                }.bind(this),
                error: function (oError) {
                    oDialog.setBusy(false);
                    console.error("hiba: ", oError.responseText);

                    let sDetailedError = "Unknown error";
                    try {
                        sDetailedError = JSON.parse(oError.responseText).error.message.value;
                    } catch (e) { }

                    sap.m.MessageBox.error("Error: " + sDetailedError);
                }.bind(this)
            });
        },

        onDialogClose(oEvent) {
            oEvent.getSource().getParent().close();
        },

        onShowPersonDetails(oEvent) {
            const oItem = oEvent.getSource();
            const oContext = oItem.getBindingContext();

            if (!oContext) {
                console.error("Nem található binding context!");
                oContext = oEvent.getParameter("listItem").getBindingContext();
                return;
            }
            const sEmployeeID = oContext.getProperty("EmployeeID");

            this.getOwnerComponent().getRouter().navTo("RoutePersonDetails", {
                EmployeeID: sEmployeeID
            });
        },

        onPersonPressed(oEvent) {
            const sPersonPath = oEvent.getSource().getBindingContext().getPath();
            const oComponent = this.getOwnerComponent();

            if (!oComponent.getModel("PersonDetails")) {
                oComponent.setModel(new sap.ui.model.json.JSONModel(), "PersonDetails");
            }

            if (!this._pSupplierDialog) {
                this._pSupplierDialog = sap.ui.core.Fragment.load({
                    id: this.getView().getId(),
                    name: "szehomework2.view.fragments.ContactDetail",
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
                    sap.m.MessageToast.show("Error while loading datas");
                }
            });
        },

        onFilter(oEvent) {
            let sQuery = oEvent.getParameter("newValue");
            let oList = this.byId("personTable");
            let oBinding = oList.getBinding("items");
            let aFilters = [];

            if (sQuery) {
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