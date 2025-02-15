type Callback = (data: any) => void;
export declare const sendMessage: (message: any, cb: Callback, errCb: Callback) => any;
export declare const watchEvents: {
    addListener: (event: string, cb: Callback) => () => void;
};
export declare function getReachability(): boolean;
export {};
