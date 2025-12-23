sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "szehomework2/model/formatter"

], (Controller, formatter) => {
    "use strict";

    return Controller.extend("szehomework2.controller.PersonDetails", {
        formatter: formatter,

        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RoutePersonDetails").attachPatternMatched(this._onObjectMatched, this);

            const oStateModel = new sap.ui.model.json.JSONModel({
                editMode: false,
            });
            this.getView().setModel(oStateModel, "Editable");
        },

        _onObjectMatched(oEvent) {
            const sId = oEvent.getParameter("arguments").EmployeeID;

            this.getView().bindElement({
                path: "/Employees(" + sId + ")",
            });
        },

        onSave(oEvent) {
            //{Save method...}

            const oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RoutePersonsList", {}, true);
            sap.m.MessageToast.show("Change(s) saved!");
        },

        onEditPress(oEvent) {
            const oEditableModel = this.getView().getModel("Editable");
            const CurrentMode = oEditableModel.getProperty("/editMode");

            oEditableModel.setProperty("/editMode", !CurrentMode);
        }

    });
});