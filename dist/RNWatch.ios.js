"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsWatchAppInstalled = exports.getIsPaired = exports.watchEvents = exports.getFileTransfers = exports.startFileTransfer = void 0;
__exportStar(require("./messages"), exports);
__exportStar(require("./message-data"), exports);
__exportStar(require("./reachability"), exports);
var files_1 = require("./files");
Object.defineProperty(exports, "startFileTransfer", { enumerable: true, get: function () { return files_1.startFileTransfer; } });
Object.defineProperty(exports, "getFileTransfers", { enumerable: true, get: function () { return files_1.getFileTransfers; } });
__exportStar(require("./user-info"), exports);
__exportStar(require("./application-context"), exports);
__exportStar(require("./hooks"), exports);
__exportStar(require("./errors"), exports);
var events_1 = require("./events");
Object.defineProperty(exports, "watchEvents", { enumerable: true, get: function () { return __importDefault(events_1).default; } });
var paired_1 = require("./paired");
Object.defineProperty(exports, "getIsPaired", { enumerable: true, get: function () { return paired_1.getIsPaired; } });
var installed_1 = require("./installed");
Object.defineProperty(exports, "getIsWatchAppInstalled", { enumerable: true, get: function () { return installed_1.getIsWatchAppInstalled; } });
