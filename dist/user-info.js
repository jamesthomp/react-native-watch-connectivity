"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferCurrentComplicationUserInfo = transferCurrentComplicationUserInfo;
exports.transferUserInfo = transferUserInfo;
exports._getMissedUserInfo = _getMissedUserInfo;
const native_module_1 = require("./native-module");
const lodash_sortby_1 = __importDefault(require("lodash.sortby"));
function transferCurrentComplicationUserInfo(info) {
    native_module_1.NativeModule.transferCurrentComplicationUserInfo(info);
}
function transferUserInfo(info) {
    native_module_1.NativeModule.transferUserInfo(info);
}
function processUserInfoQueue(queue) {
    const userInfoArr = (0, lodash_sortby_1.default)(Object.entries(queue).map(([id, userInfo]) => ({
        id,
        userInfo,
        timestamp: parseInt(id, 10),
    })), (u) => u.timestamp);
    return userInfoArr;
}
/**
 * @private
 */
async function _getMissedUserInfo() {
    const userInfoCache = await native_module_1.NativeModule.getQueuedUserInfo();
    const items = processUserInfoQueue(userInfoCache);
    return items.map((q) => q.userInfo);
}
