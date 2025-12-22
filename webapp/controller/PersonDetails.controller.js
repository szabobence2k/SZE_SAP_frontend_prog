sap.ui.define([
    "sap/ui/core/mvc/Controller",

], (Controller) => {
    "use strict";

    return Controller.extend("szehomework2.controller.PersonDetails", {
        onInit() {
            this.getOwnerComponent().getRouter().getRoute("RoutePersonDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched(oEvent) {
            const sId = oEvent.getParameter("arguments").ProductId;

            this.getView().bindElement({
                path: "/Persons(" + sId + ")",
            });
        },

    });
});