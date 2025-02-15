import {NativeModules, NativeEventEmitter} from 'react-native';

type Callback = (data: any) => void;

// @ts-expect-error
const isTurboModuleEnabled = global.__turboModuleProxy != null;
const WearConnectivityModule = isTurboModuleEnabled
  ? require('./NativeWearConnectivity').default
  : NativeModules.WearConnectivity;

const _addListener = (event: string, cb: Callback) => {
  const nativeWatchEventEmitter = new NativeEventEmitter(
    NativeModules.AndroidWearCommunication,
  );
  if (!event) {
    throw new Error('Must pass event');
  }

  switch (event) {
    case 'message':
    case 'file-received':
    case 'reachability':
      break;
    default:
      throw new Error(`Unknown watch event "${event}"`);
  }

  const sub = nativeWatchEventEmitter.addListener(event, cb);
  return () => sub.remove();
};

const noOp = () => {};

export const sendMessage = (message: any, cb: Callback, errCb: Callback) => {
  const json = {...message, event: 'message'};
  const callbackWithDefault = cb ?? noOp;
  const errCbWithDefault = errCb ?? noOp;
  return WearConnectivityModule.sendMessage(
    json,
    callbackWithDefault,
    errCbWithDefault,
  );
};

export const watchEvents = {
  addListener: _addListener,
};

export function getReachability() {
  return false;
}
