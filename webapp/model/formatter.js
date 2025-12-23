sap.ui.define([
    "sap/ui/core/format/NumberFormat",
    "sap/ui/core/format/DateFormat"

],
    function (NumberFormat, DateFormat) {
        "use strict";

        return {
            DateFormatter(oDate) {
                if (!oDate) {
                    return "";
                }

                let oDateFormat = DateFormat.getDateTimeInstance({
                    pattern: "yyyy. MM. dd. hh:mm a"
                });

                if (typeof oDate === "string") {
                    oDate = new Date(oDate);
                }
                return oDateFormat.format(oDate);
            },

            formatPhotoUrl(sEmployeeID) {
                if (!sEmployeeID) {
                    return "";
                }
                //return "/V2/Northwind/Northwind.svc/Employees(" + sEmployeeID + ")/$value";
                return "https://robohash.org/" + sEmployeeID + "?set=set5";
            }

        };

    });