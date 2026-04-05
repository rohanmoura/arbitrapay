import FullScreenLoader from "@/components/FullScreenLoader";
import TelegramRequiredModal from "@/components/TelegramRequiredModal";
import { useTelegramEnforcement } from "@/hooks/useTelegramEnforcement";
import { useUsdtSell } from "@/hooks/useUsdtSell";
import {
  buildTelegramUrl,
  fetchAdminTelegramId,
} from "@/services/adminSettingsService";
import { styles } from "@/screens/feature-compo/UsdtSell.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UsdtSellScreen() {
  const router = useRouter();
  const {
    telegramPromptVisible,
    showTelegramPrompt,
    closeTelegramPrompt,
  } = useTelegramEnforcement();
  const {
    loading,
    submitting,
    pickingScreenshot,
    amountUsdt,
    transactionHash,
    screenshot,
    toast,
    copied,
    lastSell,
    errors,
    configuration,
    setAmountUsdt,
    setTransactionHash,
    setErrors,
    copyWalletAddress,
    pickScreenshot,
    submitUsdtSellRequest,
  } = useUsdtSell();

  const isValid =
    amountUsdt &&
    Number(amountUsdt) > 0 &&
    transactionHash.trim().length > 0 &&
    Boolean(screenshot);

  const openTelegram = async () => {
    let telegramUrl = buildTelegramUrl();

    try {
      const telegramId = await fetchAdminTelegramId();
      telegramUrl = buildTelegramUrl(telegramId);
    } catch {
      telegramUrl = buildTelegramUrl();
    }

    const supported = await Linking.canOpenURL(telegramUrl);

    if (supported) {
      await Linking.openURL(telegramUrl);
    }
  };

  const handleSubmitRequest = () => {
    if (showTelegramPrompt()) {
      return;
    }

    void submitUsdtSellRequest();
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.replace("/")}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>USDT Sell</Text>
        </View>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>ARBITRAPAY CRYPTO DESK</Text>
          <Text style={styles.heroTitle}>Sell USDT for INR</Text>
          <Text style={styles.heroSubTitle}>
            Submit your transfer details and get INR after verification.
          </Text>

          <View style={styles.walletMeta}>
            <View>
              <Text style={styles.metaLabel}>Network</Text>
              <Text style={styles.metaValue}>{configuration.network}</Text>
            </View>

            <View>
              <Text style={styles.metaLabel}>Last Request</Text>
              <Text style={styles.metaValue}>{lastSell}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.telegramBtn} onPress={openTelegram}>
          <Ionicons name="paper-plane-outline" size={18} color="#8BC3FF" />
          <Text style={styles.telegramText}>Join Telegram Channel</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>USDT Transfer Wallet</Text>
          <Text style={styles.sectionDesc}>
            Send USDT to this wallet address using {configuration.network}.
          </Text>

          <View style={styles.walletBox}>
            <View style={styles.walletRow}>
              <View style={styles.walletTextWrap}>
                <Text style={styles.walletLabel}>Wallet Address</Text>
                <Text style={styles.walletValue}>{configuration.walletAddress}</Text>
              </View>

              <TouchableOpacity style={styles.copyBtn} onPress={copyWalletAddress}>
                <Ionicons
                  name={copied ? "checkmark" : "copy-outline"}
                  size={18}
                  color={copied ? "#22C55E" : "#8BC3FF"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.rateList}>
            <View style={styles.rateRow}>
              <Text style={styles.rateText}>
                1 USDT = ₹{configuration.rates.gaming} Gaming
              </Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateText}>
                1 USDT = ₹{configuration.rates.mixed} Mixed
              </Text>
            </View>
            <View style={[styles.rateRow, styles.rateRowLast]}>
              <Text style={styles.rateText}>
                1 USDT = ₹{configuration.rates.stock} Stock
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Submit USDT Sell Request</Text>
          <Text style={styles.sectionDesc}>
            After sending USDT, submit details for verification and INR release.
          </Text>

          <Text style={styles.inputLabel}>Amount of USDT Sent</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter USDT amount"
            placeholderTextColor="#6B7FA5"
            keyboardType="decimal-pad"
            value={amountUsdt}
            editable={!submitting}
            onChangeText={(text) => {
              const normalized = text.replace(/[^0-9.]/g, "");
              const split = normalized.split(".");
              const nextValue =
                split.length > 2
                  ? `${split[0]}.${split.slice(1).join("")}`
                  : normalized;

              setAmountUsdt(nextValue);
              setErrors((current) => ({ ...current, amountUsdt: "" }));
            }}
          />
          {errors.amountUsdt ? <Text style={styles.errorText}>{errors.amountUsdt}</Text> : null}

          <Text style={styles.inputLabel}>Transaction Hash</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter transaction hash"
            placeholderTextColor="#6B7FA5"
            value={transactionHash}
            autoCapitalize="none"
            editable={!submitting}
            onChangeText={(text) => {
              setTransactionHash(text);
              setErrors((current) => ({ ...current, transactionHash: "" }));
            }}
          />
          {errors.transactionHash ? (
            <Text style={styles.errorText}>{errors.transactionHash}</Text>
          ) : null}

          <TouchableOpacity
            style={styles.uploadBox}
            onPress={pickScreenshot}
            disabled={submitting || pickingScreenshot}
          >
            {screenshot ? (
              <>
                <Image source={{ uri: screenshot }} style={styles.previewImage} />
                <Text style={styles.uploadChange}>Change Screenshot</Text>
              </>
            ) : (
              <>
                {pickingScreenshot ? (
                  <ActivityIndicator size="large" color="#22D3EE" />
                ) : (
                  <Ionicons name="cloud-upload-outline" size={34} color="#22D3EE" />
                )}

                <Text style={styles.uploadText}>Upload Payment Screenshot</Text>
                <Text style={styles.uploadSub}>
                  Upload a clear screenshot for easier verification.
                </Text>
              </>
            )}
          </TouchableOpacity>
          {errors.screenshot ? <Text style={styles.errorText}>{errors.screenshot}</Text> : null}

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Important Information</Text>
            <Text style={styles.infoText}>
              Make sure transaction hash and screenshot are accurate. Incorrect details can
              delay verification and INR settlement.
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!isValid || submitting || pickingScreenshot) && styles.submitDisabled,
            ]}
            disabled={!isValid || submitting || pickingScreenshot}
            onPress={handleSubmitRequest}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>Submit USDT Sell Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {toast !== "" ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      <TelegramRequiredModal
        visible={telegramPromptVisible}
        onClose={closeTelegramPrompt}
      />
    </SafeAreaView>
  );
}
