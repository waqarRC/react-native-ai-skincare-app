import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/AppNavigator";
import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { AppButton } from "../components/AppButton";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "Welcome">;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <Screen>
      <Header title="" />

      <View style={styles.container}>
        <View style={styles.heroWrap}>
          <Image source={{ uri: "https://placehold.co/720x900/2EB5A3/white.png" }} style={styles.hero} />
        </View>

        <View style={styles.textWrap}>
          <Text style={[Type.h2, { color: Colors.textPrimary }]}>Personalized
            {"\n"}AI-Powered
            {"\n"}Skincare Journey</Text>
          <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 8 }]}>Let’s learn your skin and build a routine tailored to you.</Text>
        </View>

        <View style={styles.footer}> 
          <TouchableOpacity style={styles.ghost} onPress={() => navigation.navigate("Welcome") }>
            <Text style={[Type.cap, { color: Colors.textPrimary }]}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primary} onPress={() => navigation.navigate("Goals")}>
            <Text style={[Type.body, { color: "#fff" }]}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  heroWrap: {
    alignItems: "center",
    paddingTop: 12,
  },
  hero: {
    width: 320,
    height: 420,
    borderRadius: 28,
    backgroundColor: Colors.bg,
  },
  textWrap: {
    paddingHorizontal: 28,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.surface,
  },
  ghost: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 28,
  }
});

