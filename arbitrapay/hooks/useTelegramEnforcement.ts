import { useCallback, useEffect, useRef, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { hasTelegramId } from "@/services/profileService";

type UseTelegramEnforcementOptions = {
  promptOnMount?: boolean;
};

export function useTelegramEnforcement(
  options: UseTelegramEnforcementOptions = {}
) {
  const { profile } = useAuth();
  const [visible, setVisible] = useState(false);
  const hasPromptedOnMountRef = useRef(false);
  const telegramMissing = !hasTelegramId(profile?.telegram_id);

  const closeTelegramPrompt = useCallback(() => {
    setVisible(false);
  }, []);

  const showTelegramPrompt = useCallback(() => {
    if (!telegramMissing) {
      return false;
    }

    setVisible(true);
    return true;
  }, [telegramMissing]);

  useEffect(() => {
    if (!telegramMissing) {
      setVisible(false);
      hasPromptedOnMountRef.current = false;
      return;
    }

    if (!options.promptOnMount || hasPromptedOnMountRef.current) {
      return;
    }

    hasPromptedOnMountRef.current = true;
    setVisible(true);
  }, [options.promptOnMount, telegramMissing]);

  return {
    telegramMissing,
    telegramPromptVisible: visible,
    showTelegramPrompt,
    closeTelegramPrompt,
  };
}
