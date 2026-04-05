import HeaderBar from "@/components/dashboard-compo/HeaderBar";
import StatsGrid from "@/components/dashboard-compo/StatsGrid";
import TelegramRequiredModal from "@/components/TelegramRequiredModal";
import WalletHero from "@/components/dashboard-compo/WalletCard";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useFinancialSummary } from "@/hooks/useFinancialSummary";
import { useTelegramEnforcement } from "@/hooks/useTelegramEnforcement";
import { styles } from "@/screens/dashboard/UserDashboard.styles";

import { useRef, useState } from "react";
import { Animated, View } from "react-native";

import BannerSlider from "../banner-slider";
import BankStats from "../dashboard-compo/BankStatus";
import OtherResources from "../dashboard-compo/OtherResources";
import QuickLinks from "../dashboard-compo/QuickActions";
import Sidebar from "../dashboard-compo/Sidebar";
import FloatingTelegramButton from "../FloatingTelegramButton";

export default function UserDashboard() {

  const scrollY = useRef(new Animated.Value(0)).current;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { loading, summary } = useFinancialSummary();
  const {
    telegramPromptVisible,
    closeTelegramPrompt,
  } = useTelegramEnforcement({ promptOnMount: true });

  const openMenu = () => {
    setSidebarOpen(true);
  };

  const closeMenu = () => {
    setSidebarOpen(false);
  };

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <HeaderBar
        openMenu={openMenu}
        isOpen={sidebarOpen}
      />

      {/* SIDEBAR */}
      <Sidebar
        visible={sidebarOpen}
        onClose={closeMenu}
      />

      {/* MAIN CONTENT */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >

        <BannerSlider />

        <WalletHero currentBalance={summary.currentBalance} />

        <QuickLinks totalUsdtSold={summary.totalUsdtSold} />

        <StatsGrid
          currentBalance={summary.currentBalance}
          totalDeposits={summary.totalDeposits}
          pendingWithdrawals={summary.pendingWithdrawals}
          totalUsdtSold={summary.totalUsdtSold}
        />

        <BankStats
          totalBankAccounts={summary.totalBankAccounts}
          verifiedBankAccounts={summary.verifiedBankAccounts}
          pendingWithdrawals={summary.pendingWithdrawals}
        />

        <OtherResources />

      </Animated.ScrollView>

      {/* FLOATING SUPPORT BUTTON */}
      <FloatingTelegramButton scrollY={scrollY} />

      <TelegramRequiredModal
        visible={telegramPromptVisible}
        onClose={closeTelegramPrompt}
      />

    </View>
  );
}
