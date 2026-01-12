import React from "react";
import { Text, View, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../app/AppNavigator";
import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { AppButton } from "../components/AppButton";
import { ProgressBar } from "../components/ProgressBar";
import { Spacing } from "../theme/spacing";
import { PRODUCTS } from "../data/products";
import { Badge } from "../components/Badge";


type Props = NativeStackScreenProps<RootStackParamList, "Results">;

export function ResultsScreen({ navigation, route }: Props) {
 const { skinType, confidence, capturedUri, faceCount } = route.params;


  const concerns = [
    { label: "Moisture level", v: 0.76 },
    { label: "Oil balance", v: 0.58 },
    { label: "UV Exposure", v: 0.65 },
    { label: "Pore visibility", v: 0.83 },
  ];

  return (
    <Screen>
      <Header title="Results" />

      <View style={{ gap: 14, marginTop: 8 }}>
        {/* Analysis banner */}
        <Card style={{ padding: Spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={[Type.h3, { color: Colors.textPrimary }]}>The analysis of your skin is complete</Text>
              <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 6 }]}>Personalized recommendations:</Text>
            </View>
            {capturedUri ? (
              <Image source={{ uri: capturedUri }} style={{ width: 65, height: 65, borderRadius: 12 }} />
            ) : null}
          </View>
        </Card>

        {/* Stat tiles */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.md }}>
          {concerns.map((c) => (
            <Card key={c.label} style={{ width: "48%", padding: Spacing.md }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[Type.sub, { color: Colors.textSecondary }]}>{c.label}</Text>
                <Text style={[Type.h3, { color: Colors.primary }]}>{Math.round(c.v * 100)}%</Text>
              </View>
              <View style={{ height: 8 }} />
              <ProgressBar value={c.v} />
            </Card>
          ))}
        </View>

        {/* Recommendation chips */}
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.primary }}>
            <Text style={[Type.body, { color: "#fff" }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.bg }}>
            <Text style={[Type.body, { color: Colors.textPrimary }]}>Skincare</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.bg }}>
            <Text style={[Type.body, { color: Colors.textPrimary }]}>Makeup</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal recommendations */}
        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={PRODUCTS.slice(0, 8)}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Card style={{ width: 160, marginRight: Spacing.md }}>
                {/* <Image source={{ uri: item.image || "https://via.placeholder.com/160" }} style={{ width: "100%", height: 120, borderRadius: 8 }} /> */}
                <Image source={{ uri: "https://placehold.co/160/2EB5A3/white.png" }} style={{ width: "100%", height: 120, borderRadius: 8 }} />
                <Text style={[Type.sub, { color: Colors.textPrimary, marginTop: 8 }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[Type.cap, { color: Colors.textSecondary }]}>{item.brand}</Text>
              </Card>
            )}
          />
        </View>

        <View style={{ marginTop: "auto", gap: 10 }}>
          <AppButton title="Open Routine" onPress={() => navigation.navigate("MainTabs")} />
          <AppButton title="Scan Again" variant="secondary" onPress={() => navigation.navigate("MainTabs")} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({});

