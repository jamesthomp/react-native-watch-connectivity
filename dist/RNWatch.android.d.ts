export interface WearableDevice {
    name: string;
    id: string;
    isNearby: boolean;
}
export interface CapabilityEvent {
    capability: string;
    numNodes: number;
}
type Callback = (result?: any) => void;
type Listener = (event: any) => void;
export declare function isConnected(): Promise<boolean>;
export declare function sendMessage(message: any, successCallback: Callback, errorCallback: Callback): void;
export declare const watchEvents: {
    addListener: (event: string, cb: Listener) => () => void;
};
export {};
