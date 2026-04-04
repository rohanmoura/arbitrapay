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

export type SmsUploadQueueStatus = {
  pendingCount: number;
  retryingCount: number;
  latestFailureReason: string | null;
};

export type SmsForwardingRuleConfig = {
  id: string;
  bankName: string | null;
  senderPattern: string;
  bodyPattern: string;
  messageType: string;
  priority: number;
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
  configureUpload(config: {
    endpointUrl: string;
    anonKey: string;
    accessToken: string;
    userId: string;
    deviceId: string;
    appVersion: string;
    platform: string;
    channel: string;
  }): Promise<boolean>;
  clearUploadConfig(): Promise<void>;
  getQueueStatus(): Promise<SmsUploadQueueStatus>;
  flushUploadQueue(): Promise<boolean>;
  configureRules(rules: SmsForwardingRuleConfig[]): Promise<boolean>;
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

export async function configureSmsUpload(config: {
  endpointUrl: string;
  anonKey: string;
  accessToken: string;
  userId: string;
  deviceId: string;
  appVersion: string;
  platform: string;
  channel: string;
}) {
  if (!isSmsReceiverModuleAvailable()) {
    return false;
  }

  return SmsReceiverModule!.configureUpload(config);
}

export async function clearSmsUploadConfig() {
  if (!isSmsReceiverModuleAvailable()) {
    return;
  }

  return SmsReceiverModule!.clearUploadConfig();
}

export async function getSmsUploadQueueStatus() {
  if (!isSmsReceiverModuleAvailable()) {
    return {
      pendingCount: 0,
      retryingCount: 0,
      latestFailureReason: null,
    } satisfies SmsUploadQueueStatus;
  }

  return SmsReceiverModule!.getQueueStatus();
}

export async function flushSmsUploadQueue() {
  if (!isSmsReceiverModuleAvailable()) {
    return false;
  }

  return SmsReceiverModule!.flushUploadQueue();
}

export async function configureSmsForwardingRules(
  rules: SmsForwardingRuleConfig[]
) {
  if (!isSmsReceiverModuleAvailable()) {
    return false;
  }

  return SmsReceiverModule!.configureRules(rules);
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
