import {
  NativeEventEmitter,
  NativeModules,
  Platform,
  type EmitterSubscription,
} from "react-native";

type SmsReceiverStatus = {
  enabled: boolean;
  readSmsGranted: boolean;
  receiveSmsGranted: boolean;
};

export type SmsOtpCandidate = {
  sender: string;
  body: string;
  receivedAt: number;
};

type SmsReceiverNativeModule = {
  getStatus(): Promise<SmsReceiverStatus>;
  setEnabled(enabled: boolean): Promise<boolean>;
  getBufferedMessages(): Promise<SmsOtpCandidate[]>;
  clearBufferedMessages(): Promise<void>;
};

const { SmsReceiverModule } = NativeModules as {
  SmsReceiverModule?: SmsReceiverNativeModule;
};

const smsEventEmitter = SmsReceiverModule
  ? new NativeEventEmitter(SmsReceiverModule as never)
  : null;

const EMPTY_STATUS: SmsReceiverStatus = {
  enabled: false,
  readSmsGranted: false,
  receiveSmsGranted: false,
};

export function isSmsReceiverModuleAvailable() {
  return Platform.OS === "android" && Boolean(SmsReceiverModule);
}

export async function getSmsReceiverStatus() {
  if (!isSmsReceiverModuleAvailable()) {
    return EMPTY_STATUS;
  }

  return SmsReceiverModule!.getStatus();
}

export async function setSmsReceiverEnabled(enabled: boolean) {
  if (!isSmsReceiverModuleAvailable()) {
    return false;
  }

  return SmsReceiverModule!.setEnabled(enabled);
}

export async function getBufferedSmsOtpCandidates() {
  if (!isSmsReceiverModuleAvailable()) {
    return [];
  }

  return SmsReceiverModule!.getBufferedMessages();
}

export async function clearBufferedSmsOtpCandidates() {
  if (!isSmsReceiverModuleAvailable()) {
    return;
  }

  return SmsReceiverModule!.clearBufferedMessages();
}

export function subscribeToSmsOtpCandidates(
  listener: (candidate: SmsOtpCandidate) => void
): EmitterSubscription {
  if (!smsEventEmitter) {
    return {
      remove() {},
    } as EmitterSubscription;
  }

  return smsEventEmitter.addListener("smsOtpCandidateReceived", listener);
}
