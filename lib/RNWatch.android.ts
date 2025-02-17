import {NativeEventEmitter, NativeModules} from 'react-native';

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const WearConnectivity = isTurboModuleEnabled
  ? require('./NativeWearConnectivity').default
  : NativeModules.WearConnectivity;

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

const eventEmitter = new NativeEventEmitter(WearConnectivity);

export function isConnected(): Promise<boolean> {
  return WearConnectivity.isConnected();
}

export function sendMessage(
  message: any,
  successCallback: Callback,
  errorCallback: Callback,
): void {
  WearConnectivity.sendMessage(message, successCallback, errorCallback);
}

export const watchEvents = {
  addListener: (event: string, cb: Listener) => {
    const sub = eventEmitter.addListener(event, cb);
    return () => sub.remove();
  },
}
