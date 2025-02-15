import type { TurboModule } from 'react-native';
export type Payload = {};
export type ReplyCallback = (reply: Payload) => void;
export type ErrorCallback = (err: string) => void;
export type SendMessage = (message: Payload, cb: ReplyCallback, errCb: ErrorCallback) => void;
export interface Spec extends TurboModule {
    sendMessage: SendMessage;
}
declare const _default: Spec;
export default _default;
