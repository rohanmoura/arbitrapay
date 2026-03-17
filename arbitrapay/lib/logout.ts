import { Alert } from "react-native";
import { supabase } from "@/lib/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export async function handleLogout() {
    try {
        if (GoogleSignin.hasPreviousSignIn()) {
            await GoogleSignin.signOut();
        }

        const { error } = await supabase.auth.signOut();

        if (error) {
            Alert.alert("Logout Error", error.message);
            return;
        }

    } catch (err: any) {
        Alert.alert("Logout Error", err.message);
    }
}
