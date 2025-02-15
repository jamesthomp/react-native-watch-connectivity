"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFileTransfer = startFileTransfer;
exports._transformFilePayload = _transformFilePayload;
exports.getFileTransfers = getFileTransfers;
exports._getMissedFile = _getMissedFile;
const lodash_sortby_1 = __importDefault(require("lodash.sortby"));
const native_module_1 = require("./native-module");
function startFileTransfer(uri, metadata = {}) {
    return native_module_1.NativeModule.transferFile(uri, metadata);
}
/**
 * @private
 */
function _transformFilePayload({ startTime, endTime, ...rest }) {
    return {
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        ...rest,
    };
}
async function getFileTransfers() {
    const adapted = {};
    const transfers = await native_module_1.NativeModule.getFileTransfers();
    Object.values(transfers).forEach((t) => {
        adapted[t.id] = _transformFilePayload(t);
    });
    return adapted;
}
function processFileQueue(queue) {
    const fileArr = (0, lodash_sortby_1.default)(Object.entries(queue).map(([id, file]) => ({
        id,
        url: file.url,
        metadata: file.metadata,
        timestamp: parseInt(id, 10),
    })), (u) => u.timestamp);
    return fileArr;
}
/**
 * @private
 */
async function _getMissedFile() {
    const fileCache = await native_module_1.NativeModule.getQueuedFiles();
    const items = processFileQueue(fileCache);
    return items;
}
