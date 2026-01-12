import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/AppNavigator";
import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { AppButton } from "../components/AppButton";

type Props = NativeStackScreenProps<RootStackParamList, "Budget">;

const OPTIONS = ["Affordable", "Mid-range", "Premium"];

export function BudgetScreen({ navigation }: Props) {
  const [picked, setPicked] = useState<string>("Mid-range");

  return (
    <Screen>
      <Header title="Budget preference" />

      <View style={{ gap: 12, marginTop: 8 }}>
        <Text style={[Type.h2, { color: Colors.textPrimary }]}>Budget preference</Text>
        <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 6 }]}>We’ll tailor recommendations to your range.</Text>

        <View style={{ marginTop: 14, gap: 12 }}>
          {OPTIONS.map((o) => {
             const active = picked === o;
            return (
              <Pressable key={o} onPress={() => setPicked(o)}>
                <Card
                  style={{
                    borderColor: active ? "rgba(46,181,163,0.35)" : Colors.border,
                    backgroundColor: active ? "rgba(46,181,163,0.10)" : Colors.card,
                  }}
                >
                  <Text style={[Type.h3, { color: Colors.textPrimary }]}>{o}</Text>
                  <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 4 }]}>
                    {o === "Affordable"
                      ? "Best value options across brands."
                      : o === "Mid-range"
                      ? "Balanced price & performance."
                      : "Dermatology-inspired premium picks."}
                  </Text>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: "auto" }}>
          {/* Important: Go to Tabs (where Scan exists) */}
          <AppButton title="Start Skin Scan" onPress={() => navigation.replace("MainTabs")} />
        </View>
      </View>
    </Screen>
  );
}
