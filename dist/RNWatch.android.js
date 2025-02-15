"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchEvents = exports.sendMessage = void 0;
exports.getReachability = getReachability;
const react_native_1 = require("react-native");
// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const WearConnectivityModule = isTurboModuleEnabled
    ? require('./NativeWearConnectivity').default
    : react_native_1.NativeModules.WearConnectivity;
const _addListener = (event, cb) => {
    const nativeWatchEventEmitter = new react_native_1.NativeEventEmitter(react_native_1.NativeModules.AndroidWearCommunication);
    if (!event) {
        throw new Error('Must pass event');
    }
    switch (event) {
        case 'message':
        case 'file-received':
        case 'reachability':
            break;
        default:
            throw new Error(`Unknown watch event "${event}"`);
    }
    const sub = nativeWatchEventEmitter.addListener(event, cb);
    return () => sub.remove();
};
const noOp = () => { };
const sendMessage = (message, cb, errCb) => {
    const json = { ...message, event: 'message' };
    const callbackWithDefault = cb ?? noOp;
    const errCbWithDefault = errCb ?? noOp;
    return WearConnectivityModule.sendMessage(json, callbackWithDefault, errCbWithDefault);
};
exports.sendMessage = sendMessage;
exports.watchEvents = {
    addListener: _addListener,
};
function getReachability() {
    return false;
}
