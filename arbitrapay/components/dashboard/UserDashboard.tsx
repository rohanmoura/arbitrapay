import HeaderBar from "@/components/dashboard-compo/HeaderBar";
import StatsGrid from "@/components/dashboard-compo/StatsGrid";
import WalletHero from "@/components/dashboard-compo/WalletCard";
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

  const openMenu = () => {
    setSidebarOpen(true);
  };

  const closeMenu = () => {
    setSidebarOpen(false);
  };

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

        <WalletHero />

        <QuickLinks />

        <StatsGrid />

        <BankStats />

        <OtherResources />

      </Animated.ScrollView>

      {/* FLOATING SUPPORT BUTTON */}
      <FloatingTelegramButton scrollY={scrollY} />

    </View>
  );
}