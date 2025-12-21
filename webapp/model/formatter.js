sap.ui.define([
    "sap/ui/core/format/NumberFormat"

], 
function (NumberFormat) {
    "use strict";

    return {
        PriceFormatter(sPrice) {
            const oPriceFormat = NumberFormat.getCurrencyInstance({
                "currencyCode": true,
                "decimalSeparator": ".",
            });
            return oPriceFormat.format(sPrice,"HUF");

            //return sPrice + " pénz";
        }

    };

});