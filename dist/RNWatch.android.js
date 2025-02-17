"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchEvents = void 0;
exports.isConnected = isConnected;
exports.sendMessage = sendMessage;
const react_native_1 = require("react-native");
// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const WearConnectivity = isTurboModuleEnabled
    ? require('./NativeWearConnectivity').default
    : react_native_1.NativeModules.WearConnectivity;
const eventEmitter = new react_native_1.NativeEventEmitter(WearConnectivity);
function isConnected() {
    return WearConnectivity.isConnected();
}
function sendMessage(message, successCallback, errorCallback) {
    WearConnectivity.sendMessage(message, successCallback, errorCallback);
}
exports.watchEvents = {
    addListener: (event, cb) => {
        const sub = eventEmitter.addListener(event, cb);
        return () => sub.remove();
    },
};
