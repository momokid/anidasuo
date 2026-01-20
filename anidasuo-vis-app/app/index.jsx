import LogoImage from "@/assets/images/welcome.png";
import colors from "@/constants/colors";
import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/customButton";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <>
      <View style={styles.container}>
        <Image source={LogoImage} style={styles.image} />

        <Text style={styles.title}>ANIDASUO</Text>
        <Text style={styles.subtitle}>VIS-APP</Text>
        <Text style={styles.tagline}>Helping you see your path.</Text>

        <CustomButton
          label="Start Navigation"
          onPress={() =>
            router.push({ pathname: "/detect", params: { start: true } })
          }
        />
        <CustomButton
          label="Settings"
          onPress={() => router.push("/settings")}
        />
        <CustomButton
          label="Emergency"
          onPress={() => router.push("/emergency")}
        />
        <CustomButton
          label="How It Works"
          onPress={() => router.push("/help")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 26,
    color: colors.secondary,
    fontWeight: "600",
    marginBottom: 20,
  },
  tagline: {
    fontSize: 18,
    color: "#FACC15",
    marginBottom: 40,
    textAlign: "center",
  },
  image: {
    height: 200,
    width: 200,
    padding: 50,
  },
});
