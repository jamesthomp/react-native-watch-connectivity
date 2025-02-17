import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  readonly getConstants: () => {
    readonly NAME: string;
  };

  /**
   * Send a message to connected wearable devices
   */
  sendMessage(
    message: Object,
    successCallback: (result: string) => void,
    errorCallback: (error: string) => void,
  ): void;

  /**
   * Check if there are any connected wearable devices with matching capability
   */
  isConnected(
    callback: (error: string | null, result?: boolean) => void,
  ): void;

  // Event emitter methods
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('WearConnectivity');
