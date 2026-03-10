import { styles } from "@/screens/security/Biometric.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Biometric() {

  const router = useRouter();
  const [enabled, setEnabled] = useState(false);

  return (

    <SafeAreaView style={styles.safe}>

      <View style={styles.container}>

        {/* HEADER */}

        <View style={styles.header}>

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Biometric Lock</Text>

        </View>


        {/* BIOMETRIC CARD */}

        <View style={styles.card}>

          <View style={styles.iconBox}>
            <Ionicons name="finger-print" size={32} color="#8B5CF6" />
          </View>

          <Text style={styles.heading}>
            Enable Biometric Authentication
          </Text>

          <Text style={styles.desc}>
            Use fingerprint or face unlock to protect access to your account.
          </Text>


          {/* TOGGLE */}

          <View style={styles.toggleRow}>

            <Text style={styles.toggleText}>
              Biometric Lock
            </Text>

            <Switch
              value={enabled}
              onValueChange={setEnabled}
            />

          </View>

        </View>

      </View>

    </SafeAreaView>
  );
}