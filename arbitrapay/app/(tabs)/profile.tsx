import { styles } from "@/screens/profile/Profile.styles";
import FullScreenLoader from "@/components/FullScreenLoader";
import { useProfile } from "@/hooks/useProfile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const router = useRouter();
  const {
    profile,
    loading,
    saving,
    loggingOut,
    uploadingAvatar,
    setName,
    setPhone,
    setTelegramId,
    saveProfile,
    pickAvatar,
    logout,
  } = useProfile();
  const avatarSource = profile.avatar
    ? { uri: profile.avatar }
    : require("@/assets/images/icon.png");

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.container}>

          <Text style={styles.title}>Profile</Text>

          {/* PROFILE HEADER */}

          <View style={styles.profileCard}>

            <View style={styles.avatarWrapper}>
              <Image source={avatarSource} style={styles.avatar} />

              <TouchableOpacity
                style={styles.editAvatar}
                onPress={pickAvatar}
                disabled={uploadingAvatar || saving || loggingOut}
              >
                {uploadingAvatar ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="camera" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.email}>{profile.email}</Text>

          </View>


          {/* ACCOUNT INFO */}

          <View style={styles.card}>

            <Text style={styles.sectionTitle}>Account Information</Text>

            <Text style={styles.label}>Full Name</Text>

            <TextInput
              value={profile.name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor="#6B7280"
              style={styles.input}
              editable={!saving && !loggingOut && !uploadingAvatar}
            />

            <Text style={styles.label}>Email</Text>

            <TextInput
              value={profile.email}
              editable={false}
              style={[styles.input, { opacity: 0.6 }]}
            />

            <Text style={styles.label}>Phone</Text>

            <View style={styles.phoneContainer}>

              <View style={styles.codeBox}>
                <Text style={styles.codeText}>+91</Text>
              </View>

              <TextInput
                value={profile.phone}
                onChangeText={setPhone}
                placeholder="9876543210"
                placeholderTextColor="#6B7280"
                keyboardType="number-pad"
                style={styles.phoneInput}
                editable={!saving && !loggingOut && !uploadingAvatar}
              />

            </View>

            <Text style={styles.label}>Telegram ID</Text>

            <TextInput
              value={profile.telegramId}
              onChangeText={setTelegramId}
              placeholder="@yourtelegramid"
              placeholderTextColor="#6B7280"
              autoCapitalize="none"
              style={styles.input}
              editable={!saving && !loggingOut && !uploadingAvatar}
            />

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

            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push("/help-center")}
            >
              <Ionicons name="help-circle" size={18} color="#8B5CF6" />
              <Text style={styles.rowText}>Help Center</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push("/help-center")}
            >
              <Ionicons name="mail" size={18} color="#8B5CF6" />
              <Text style={styles.rowText}>Contact Support</Text>
            </TouchableOpacity>

          </View>


          {/* SAVE */}

          <TouchableOpacity
            style={[styles.saveBtn, (saving || loggingOut || uploadingAvatar) && styles.disabledButton]}
            onPress={saveProfile}
            disabled={saving || loggingOut || uploadingAvatar}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveText}>Save Changes</Text>
            )}
          </TouchableOpacity>


          {/* LOGOUT */}

          <TouchableOpacity
            style={[styles.logout, loggingOut && styles.disabledButton]}
            onPress={logout}
            disabled={loggingOut || saving || uploadingAvatar}
          >
            <Ionicons name="log-out-outline" size={18} color="#EF4444" />
            {loggingOut ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Text style={styles.logoutText}>Logout</Text>
            )}
          </TouchableOpacity>


          <Text style={styles.version}>ArbitraPay v1.0</Text>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
