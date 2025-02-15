"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsPaired = getIsPaired;
const native_module_1 = require("./native-module");
function getIsPaired() {
    return native_module_1.NativeModule.getIsPaired();
}
