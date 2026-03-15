import { useDepositConfigAdmin } from "@/hooks/useDepositConfigAdmin";
import { styles } from "@/screens/dashboard/AdminDashboard.styles";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function SecurityDepositSetupCard() {
  const {
    loading,
    saving,
    editing,
    activeTab,
    upiId,
    accountNumber,
    ifscCode,
    bankName,
    setActiveTab,
    setUpiId,
    setAccountNumber,
    setIfscCode,
    setBankName,
    startEditing,
    saveChanges,
  } = useDepositConfigAdmin();

  const isUpiTab = activeTab === "upi";
  const editable = editing && !saving;

  return (
    <View style={styles.depositSetupCard}>
      <View style={styles.depositHeader}>
        <Text style={styles.depositTitle}>Security Deposit Setup</Text>

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
        Configure how users send security deposits.
      </Text>

      <View style={styles.methodTabs}>
        <TouchableOpacity
          style={isUpiTab ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("upi")}
          disabled={saving}
        >
          <Text style={isUpiTab ? styles.activeTabText : styles.tabText}>UPI</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={!isUpiTab ? styles.activeTab : styles.tab}
          onPress={() => setActiveTab("bank")}
          disabled={saving}
        >
          <Text style={!isUpiTab ? styles.activeTabText : styles.tabText}>
            Bank Transfer
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.depositLoadingBox}>
          <ActivityIndicator size="small" color="#A78BFA" />
          <Text style={styles.depositLoadingText}>Loading deposit setup...</Text>
        </View>
      ) : isUpiTab ? (
        <View style={styles.depositInfoCard}>
          <Text style={styles.depositLabel}>UPI ID</Text>
          <TextInput
            value={upiId}
            onChangeText={setUpiId}
            editable={editable}
            placeholder="Enter UPI ID"
            placeholderTextColor="#64748B"
            style={[styles.depositInput, !editable && styles.depositInputReadonly]}
          />
        </View>
      ) : (
        <View style={styles.depositFieldsGroup}>
          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Account Number</Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              editable={editable}
              placeholder="Enter account number"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>

          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>IFSC Code</Text>
            <TextInput
              value={ifscCode}
              onChangeText={setIfscCode}
              editable={editable}
              placeholder="Enter IFSC code"
              placeholderTextColor="#64748B"
              autoCapitalize="characters"
              style={[styles.depositInput, !editable && styles.depositInputReadonly]}
            />
          </View>

          <View style={styles.depositInfoCard}>
            <Text style={styles.depositLabel}>Bank Name</Text>
            <TextInput
              value={bankName}
              onChangeText={setBankName}
              editable={editable}
              placeholder="Enter bank name"
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
