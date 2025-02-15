"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageData = sendMessageData;
const encoding_1 = require("./encoding");
const native_module_1 = require("./native-module");
const base64_1 = require("./base64");
function sendMessageData(data, encoding = encoding_1.Encoding.NSUTF8StringEncoding) {
    return new Promise((resolve, reject) => {
        native_module_1.NativeModule.sendMessageData(data, encoding, (resp) => {
            const decoded = (0, base64_1.atob)(resp);
            resolve(decoded);
        }, (err) => {
            reject(err);
        });
    });
}
