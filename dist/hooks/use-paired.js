"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePaired = usePaired;
const react_1 = require("react");
const events_1 = __importDefault(require("../events"));
const paired_1 = require("../paired");
function usePaired() {
    const [paired, setPaired] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        (0, paired_1.getIsPaired)().then(setPaired);
        return events_1.default.addListener('paired', setPaired);
    }, []);
    return paired;
}
