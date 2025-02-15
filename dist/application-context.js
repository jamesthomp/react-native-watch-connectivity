"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationContext = updateApplicationContext;
exports.getApplicationContext = getApplicationContext;
const native_module_1 = require("./native-module");
function updateApplicationContext(context) {
    native_module_1.NativeModule.updateApplicationContext(context);
}
function getApplicationContext() {
    return native_module_1.NativeModule.getApplicationContext();
}
