"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._subscribeNativeFileEvents = _subscribeNativeFileEvents;
exports._subscribeNativeMessageEvent = _subscribeNativeMessageEvent;
exports._subscribeNativeUserInfoEvent = _subscribeNativeUserInfoEvent;
exports._subscribeNativeFileReceivedEvent = _subscribeNativeFileReceivedEvent;
exports._subscribeNativeApplicationContextEvent = _subscribeNativeApplicationContextEvent;
exports._subscribeToNativeReachabilityEvent = _subscribeToNativeReachabilityEvent;
exports._subscribeToNativePairedEvent = _subscribeToNativePairedEvent;
exports._subscribeToNativeInstalledEvent = _subscribeToNativeInstalledEvent;
exports._subscribeNativeApplicationContextErrorEvent = _subscribeNativeApplicationContextErrorEvent;
exports._subscribeNativeApplicationContextReceivedErrorEvent = _subscribeNativeApplicationContextReceivedErrorEvent;
exports._subscribeNativeUserInfoErrorEvent = _subscribeNativeUserInfoErrorEvent;
exports._subscribeNativeFileReceivedErrorEvent = _subscribeNativeFileReceivedErrorEvent;
exports._subscribeNativeActivationErrorEvent = _subscribeNativeActivationErrorEvent;
exports._subscribeNativeSesssionBecameInactiveErrorEvent = _subscribeNativeSesssionBecameInactiveErrorEvent;
exports._subscribeNativeSessionDidDeactivateErrorEvent = _subscribeNativeSessionDidDeactivateErrorEvent;
const native_module_1 = require("../native-module");
const files_1 = require("../files");
const user_info_1 = require("../user-info");
/**
 * Hook up to native file events
 */
function _subscribeNativeFileEvents(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_FILE_TRANSFER, (payload) => cb((0, files_1._transformFilePayload)(payload)));
}
/**
 * Hook up to native message event
 */
function _subscribeNativeMessageEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_RECEIVE_MESSAGE, (payload) => {
        const messageId = payload.id;
        const replyHandler = messageId
            ? (resp) => native_module_1.NativeModule.replyToMessageWithId(messageId, resp)
            : null;
        cb(payload || null, replyHandler);
    });
}
function _dequeueUserInfo(idOrIds) {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const normalisedIds = ids.map((id) => {
        if (typeof id === 'object') {
            if (id instanceof Date) {
                return id.getTime().toString();
            }
            else {
                return id.id;
            }
        }
        else {
            return id.toString();
        }
    });
    native_module_1.NativeModule.dequeueUserInfo(normalisedIds);
}
function _subscribeNativeUserInfoEvent(cb, addListener = native_module_1._addListener) {
    let initialized = false;
    const xtra = [];
    (0, user_info_1._getMissedUserInfo)().then((info) => {
        const combined = [...xtra, ...info];
        if (combined.length) {
            cb(combined);
        }
        initialized = true;
    });
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_USER_INFO_RECEIVED, (item) => {
        _dequeueUserInfo(item);
        if (initialized) {
            cb([item.userInfo]);
        }
        else {
            xtra.push(item.userInfo);
        }
    });
}
function _dequeueFile(idOrIds) {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const normalisedIds = ids.map((id) => {
        if (typeof id === 'object') {
            if (id instanceof Date) {
                return id.getTime().toString();
            }
            else {
                return id.id;
            }
        }
        else {
            return id.toString();
        }
    });
    native_module_1.NativeModule.dequeueFile(normalisedIds);
}
function _subscribeNativeFileReceivedEvent(cb, addListener = native_module_1._addListener) {
    let initialized = false;
    const xtra = [];
    (0, files_1._getMissedFile)().then((info) => {
        const combined = [...xtra, ...info];
        if (combined.length) {
            cb(combined);
        }
        initialized = true;
    });
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_FILE_RECEIVED, (item) => {
        _dequeueFile(item);
        if (initialized) {
            cb([item]);
        }
        else {
            xtra.push(item);
        }
    });
}
function _subscribeNativeApplicationContextEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_APPLICATION_CONTEXT_RECEIVED, cb);
}
function _subscribeToNativeReachabilityEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_REACHABILITY_CHANGED, ({ reachability }) => cb(reachability));
}
function _subscribeToNativePairedEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_PAIR_STATUS_CHANGED, ({ paired }) => {
        cb(paired);
    });
}
function _subscribeToNativeInstalledEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_INSTALL_STATUS_CHANGED, ({ installed }) => {
        cb(installed);
    });
}
function _subscribeNativeApplicationContextErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_APPLICATION_CONTEXT_ERROR, cb);
}
function _subscribeNativeApplicationContextReceivedErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_APPLICATION_CONTEXT_RECEIVED_ERROR, cb);
}
function _subscribeNativeUserInfoErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_USER_INFO_ERROR, cb);
}
function _subscribeNativeFileReceivedErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_FILE_ERROR, cb);
}
function _subscribeNativeActivationErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_FILE_ERROR, cb);
}
function _subscribeNativeSesssionBecameInactiveErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_FILE_ERROR, cb);
}
function _subscribeNativeSessionDidDeactivateErrorEvent(cb, addListener = native_module_1._addListener) {
    return addListener(native_module_1.WatchEvent.EVENT_WATCH_FILE_ERROR, cb);
}
