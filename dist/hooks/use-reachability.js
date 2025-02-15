"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReachability = useReachability;
const reachability_1 = require("../reachability");
const react_1 = require("react");
const events_1 = __importDefault(require("../events"));
function useReachability() {
    const [reachability, setReachability] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        (0, reachability_1.getReachability)().then(setReachability);
        return events_1.default.addListener('reachability', setReachability);
    }, []);
    return reachability;
}
