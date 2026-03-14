import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { styles } from "./FloatingTelegramButton.styles";

type Props = {
  scrollY?: Animated.Value;
};

export const TELEGRAM_CHANNEL_URL = "https://t.me/arbitraagent";

export default function FloatingTelegramButton({ scrollY }: Props) {

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim = useRef(new Animated.Value(80)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const [disabled, setDisabled] = useState(false);

  /* Pulse animation */
  const startPulse = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.07,
          duration: 700,
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [pulseAnim]);

  /* First load bounce */
  const startBounce = useCallback(() => {
    Animated.spring(bounceAnim, {
      toValue: 0,
      friction: 6,
      useNativeDriver: true
    }).start();
  }, [bounceAnim]);

  useEffect(() => {
    startPulse();
    startBounce();
  }, [startPulse, startBounce]);

  /* Smart Auto Hide */
  useEffect(() => {

    if (!scrollY) return;

    const listener = scrollY.addListener(({ value }) => {

      if (value > 40) {

        setDisabled(true);

        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }).start();

      } else {

        setDisabled(false);

        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        }).start();

      }

    });

    return () => scrollY.removeListener(listener);

  }, [scrollY, opacityAnim]);

  const openTelegram = async () => {
    if (disabled) return;

    const supported = await Linking.canOpenURL(TELEGRAM_CHANNEL_URL);

    if (supported) {
      await Linking.openURL(TELEGRAM_CHANNEL_URL);
    }
  };

  return (
    <Animated.View
      pointerEvents={disabled ? "none" : "auto"}
      style={[
        styles.container,
        {
          opacity: opacityAnim,
          transform: [{ translateY: bounceAnim }]
        }
      ]}
    >

      <Text style={styles.label}>Need Help?</Text>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>

        <LinearGradient
          colors={["rgba(34,158,217,0.35)", "transparent"]}
          style={styles.glow}
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={openTelegram}
        >

          <Image
            source={require("@/assets/telegram.png")}
            style={styles.icon}
          />

          <View style={styles.badge}>
            <Text style={styles.badgeText}>24/7</Text>
          </View>

        </TouchableOpacity>

      </Animated.View>

    </Animated.View>
  );
}
