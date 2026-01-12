import React, { useMemo, useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/AppNavigator";
import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Radius } from "../theme/radius";
import { AppButton } from "../components/AppButton";

type Props = NativeStackScreenProps<RootStackParamList, "Goals">;

const ALL = ["Acne", "Pigmentation", "Redness", "Dryness", "Sensitivity", "Aging"];

export function GoalsScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const canContinue = useMemo(() => selected.length > 0, [selected]);

  return (
    <Screen>
      <Header title="Your skin goals" />

      <View style={{ gap: 12, marginTop: 8 }}>
        <Text style={[Type.h2, { color: Colors.textPrimary }]}>Your skin goals</Text>
        <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 6 }]}>Select what you want to improve.</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
          {ALL.map((label) => {
            const active = selected.includes(label);
            return (
              <Pressable
                key={label}
                onPress={() =>
                  setSelected((prev) =>
                    prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
                  )
                }
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: Radius.pill,
                  backgroundColor: active ? "rgba(46,181,163,0.14)" : Colors.card,
                  borderWidth: 1,
                  borderColor: active ? "rgba(46,181,163,0.35)" : Colors.border,
                }}
              >
                <Text style={[Type.sub, { color: Colors.textPrimary }]}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginTop: "auto" }}>
          <AppButton title="Continue" onPress={() => navigation.navigate("Budget")} disabled={!canContinue} />
        </View>
      </View>
    </Screen>
  );
}
