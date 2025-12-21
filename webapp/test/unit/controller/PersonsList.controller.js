/*global QUnit*/

sap.ui.define([
	"szehomework2/controller/PersonsList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("PersonsList Controller");

	QUnit.test("I should test the PersonsList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
