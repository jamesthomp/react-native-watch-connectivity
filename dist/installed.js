"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsWatchAppInstalled = getIsWatchAppInstalled;
const native_module_1 = require("./native-module");
function getIsWatchAppInstalled() {
    return native_module_1.NativeModule.getIsWatchAppInstalled();
}
