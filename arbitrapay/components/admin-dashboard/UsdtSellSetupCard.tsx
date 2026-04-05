import { useUsdtSellConfigAdmin } from "@/hooks/useUsdtSellConfigAdmin";
import { styles } from "@/screens/dashboard/AdminDashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function UsdtSellSetupCard() {
  const {
    loading,
    saving,
    editing,
    walletAddress,
    network,
    gamingRate,
    mixedRate,
    stockRate,
    setWalletAddress,
    setNetwork,
    setGamingRate,
    setMixedRate,
    setStockRate,
    startEditing,
    saveChanges,
  } = useUsdtSellConfigAdmin();

  const editable = editing && !saving;

  return (
    <View style={styles.depositSetupCard}>
      <View style={styles.depositHeader}>
        <Text style={styles.depositTitle}>USDT Sell Setup</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={startEditing}
          disabled={loading || saving || editing}
        >
          <Ionicons name="create-outline" size={16} color="#A78BFA" />
          <Text style={styles.editText}>{editing ? "Editing" : "Edit"}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.depositSubtitle}>
        Update wallet address and sell rates shown in user dashboard.
      </Text>

      {loading ? (
        <View style={styles.depositLoadingBox}>
          <ActivityIndicator size="small" color="#A78BFA" />
          <Text style={styles.depositLoadingText}>Loading USDT Sell setup...</Text>
        </View>
      ) : (
        <View style={styles.depositFieldsGroup}>
          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Wallet Address</Text>
            <TextInput
              value={walletAddress}
              onChangeText={setWalletAddress}
              editable={editable}
              placeholder="Enter wallet address"
              placeholderTextColor="#64748B"
              autoCapitalize="none"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>

          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Network</Text>
            <TextInput
              value={network}
              onChangeText={setNetwork}
              editable={editable}
              placeholder="Enter network (e.g. TRC-20)"
              placeholderTextColor="#64748B"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>

          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Rate - Gaming (INR per USDT)</Text>
            <TextInput
              value={gamingRate}
              onChangeText={setGamingRate}
              editable={editable}
              keyboardType="decimal-pad"
              placeholder="Enter gaming rate"
              placeholderTextColor="#64748B"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>

          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Rate - Mixed (INR per USDT)</Text>
            <TextInput
              value={mixedRate}
              onChangeText={setMixedRate}
              editable={editable}
              keyboardType="decimal-pad"
              placeholder="Enter mixed rate"
              placeholderTextColor="#64748B"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>

          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Rate - Stock (INR per USDT)</Text>
            <TextInput
              value={stockRate}
              onChangeText={setStockRate}
              editable={editable}
              keyboardType="decimal-pad"
              placeholder="Enter stock rate"
              placeholderTextColor="#64748B"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.saveBtn, (!editing || loading || saving) && styles.saveBtnDisabled]}
        onPress={saveChanges}
        disabled={!editing || loading || saving}
      >
        {saving ? (
          <ActivityIndicator size="small" color="#FFF" />
        ) : (
          <Text style={styles.saveText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
