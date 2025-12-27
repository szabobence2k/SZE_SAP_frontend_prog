sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "szehomework2/model/formatter"

], (Controller, formatter) => {
    "use strict";

    return Controller.extend("szehomework2.controller.AddedPersonDetails", {
        formatter: formatter,

        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RouteAddedPersonDetails").attachPatternMatched(this._onObjectMatched, this);

            const oStateModel = new sap.ui.model.json.JSONModel({
                editMode: false,
            });
            this.getView().setModel(oStateModel, "Editable");
        },

        _onObjectMatched(oEvent) {
            const sId = oEvent.getParameter("arguments").ID;

            this.getView().bindElement({
                path: "/Products(" + sId + ")",
                model: "editableModel"
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