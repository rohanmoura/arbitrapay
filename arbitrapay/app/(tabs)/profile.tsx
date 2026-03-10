import { styles } from "@/screens/profile/Profile.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COUNTRY_CODES = ["+91", "+1", "+44", "+971"];

export default function Profile() {

  const [name, setName] = useState("User");
  const [email] = useState("user@email.com");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [showCodes, setShowCodes] = useState(false);
  const router = useRouter();

  const avatar = "https://i.pravatar.cc/300";

  const handlePhoneChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    if (cleaned.length <= 10) setPhone(cleaned);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.container}>

          <Text style={styles.title}>Profile</Text>

          {/* PROFILE HEADER */}

          <View style={styles.profileCard}>

            <View style={styles.avatarWrapper}>
              <Image source={{ uri: avatar }} style={styles.avatar} />

              <TouchableOpacity style={styles.editAvatar}>
                <Ionicons name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.email}>{email}</Text>

          </View>


          {/* ACCOUNT INFO */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>Account Information</Text>

            <Text style={styles.label}>Full Name</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#6B7280"
              style={styles.input}
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
              value={email}
              editable={false}
              style={[styles.input, { opacity: 0.6 }]}
            />

            <Text style={styles.label}>Phone</Text>

            <View style={styles.phoneContainer}>

              <TouchableOpacity
                style={styles.codeBox}
                onPress={() => setShowCodes(!showCodes)}
              >
                <Text style={styles.codeText}>{countryCode}</Text>
                <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
              </TouchableOpacity>

              <TextInput
                value={phone}
                onChangeText={handlePhoneChange}
                placeholder="9876543210"
                placeholderTextColor="#6B7280"
                keyboardType="number-pad"
                style={styles.phoneInput}
              />

            </View>

            {showCodes && (
              <View style={styles.codeDropdown}>
                {COUNTRY_CODES.map((code) => (
                  <TouchableOpacity
                    key={code}
                    onPress={() => {
                      setCountryCode(code);
                      setShowCodes(false);
                    }}
                    style={styles.codeItem}
                  >
                    <Text style={styles.codeItemText}>{code}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

          </View>


          {/* ACCOUNT STATUS */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.row}>
              <Ionicons name="shield-checkmark" size={18} color="#8B5CF6" />
              <Text style={styles.rowText}>Verification Status</Text>
              <Text style={styles.status}>Verified</Text>
            </View>

            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push("/security")}
            >
              <Ionicons name="lock-closed" size={18} color="#8B5CF6" />
              <Text style={styles.rowText}>Security Settings</Text>
            </TouchableOpacity>

          </View>


          {/* SUPPORT */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>Support</Text>

            <View style={styles.row}>
              <Ionicons name="help-circle" size={18} color="#8B5CF6" />
              <Text style={styles.rowText}>Help Center</Text>
            </View>

            <View style={styles.row}>
              <Ionicons name="mail" size={18} color="#8B5CF6" />
              <Text style={styles.rowText}>Contact Support</Text>
            </View>

          </View>


          {/* SAVE */}

          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>


          {/* LOGOUT */}

          <TouchableOpacity style={styles.logout}>
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>


          <Text style={styles.version}>ArbitraPay v1.0</Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}