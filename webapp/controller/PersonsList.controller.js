sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
], (Controller, MessageBox) => {
    "use strict";

    return Controller.extend("szehomework2.controller.PersonsList", {
        MessageBox: MessageBox,
        onInit() {
            let oJSONModel = new sap.ui.model.json.JSONModel();

        },
        onModifyPressed(oEvent) {
            sap.m.MessageToast.show("Employee can not be modified.");
        }

            
        


        
    });
});