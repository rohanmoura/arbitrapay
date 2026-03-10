import { styles } from "@/screens/security/Pin.styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Pin() {

  const router = useRouter();

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [step, setStep] = useState(1);

  const handleNext = () => {

    if (step === 1 && pin.length === 4) {
      setStep(2);
      return;
    }

    if (step === 2 && confirmPin === pin) {
      console.log("PIN SET:", pin);
      router.back();
    }

  };

  const mismatch = step === 2 && confirmPin.length === 4 && confirmPin !== pin;

  return (

    <View style={styles.container}>

      {/* HEADER */}

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>
        {step === 1 ? "Set Transaction PIN" : "Confirm PIN"}
      </Text>


      {/* PIN INPUT */}

      <TextInput
        style={styles.pinInput}
        keyboardType="number-pad"
        maxLength={4}
        secureTextEntry
        value={step === 1 ? pin : confirmPin}
        onChangeText={step === 1 ? setPin : setConfirmPin}
      />


      {/* ERROR */}

      {mismatch && (
        <Text style={styles.error}>
          PIN does not match
        </Text>
      )}


      <Text style={styles.helper}>
        This PIN will be required for withdrawals and transfers.
      </Text>


      {/* BUTTON */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleNext}
      >
        <Text style={styles.buttonText}>
          {step === 1 ? "Continue" : "Set PIN"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}