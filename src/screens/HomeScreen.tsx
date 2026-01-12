import React from "react";
import { Text, View, Image, FlatList, TouchableOpacity } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { AppButton } from "../components/AppButton";
import { useScanStore } from "../store/scanStore";
import type { RootStackParamList } from "../app/AppNavigator";
import { PRODUCTS } from "../data/products";
import { Spacing } from "../theme/spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const latest = useScanStore((s) => s.latest);

  const goToLastScan = () => {
    if (!latest) return;
    navigation.navigate("Results", {
      skinType: latest.skinType,
      confidence: latest.confidence,
      capturedUri: latest.capturedUri,
      faceCount: latest.faceCount,
    });
  };

  return (
    <Screen>
      <Header title="" />

      <View style={{  gap: Spacing.lg }}>
        {/* Greeting row */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View>
            <Text style={[Type.h2, { color: Colors.textPrimary }]}>Hi Julia 👋</Text>
            <Text style={[Type.body, { color: Colors.textSecondary }]}>Discover your personalized care</Text>
          </View>

          <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 22, overflow: "hidden" }}>
            <Image source={{ uri: "https://placehold.co/80/2EB5A3/white.png" }} style={{ width: "100%", height: "100%" }} />
          </TouchableOpacity>
        </View>

        {/* Promo banner */}
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image source={{ uri: "https://placehold.co/140x140/2EB5A3/white.png" }} style={{ width: 140, height: 140, borderRadius: 100 }} />
            <View style={{ flex: 1, padding: Spacing.md }}>
              <Text style={[Type.h3, { color: Colors.textPrimary }]}>Discover beauty essentials for</Text>
              <Text style={[Type.h3, { color: Colors.premium ?? Colors.primary }]}>glowing skin.</Text>
              <View style={{ height: 8 }} />
              <AppButton title="Use AI to scan your face" onPress={() => navigation.navigate("MainTabs", { screen: "Scan" } as any)} />
            </View>
          </View>
        </Card>

        {/* Featured products horizontal */}
        <View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Text style={[Type.h3, { color: Colors.textPrimary }]}>Featured</Text>
            <TouchableOpacity onPress={() => navigation.navigate("MainTabs", { screen: "Products" } as any)}> 
              <Text style={[Type.cap, { color: Colors.primary }]}>View More</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={PRODUCTS.slice(0, 6)}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Card style={{ width: 140, marginRight: Spacing.md }}>
                <Image source={{ uri: "https://placehold.co/140/2EB5A3/white.png" }} style={{ width: "100%", height: 120, borderRadius: 8 }} />
                <Text style={[Type.sub, { color: Colors.textPrimary, marginTop: 8 }]} numberOfLines={2}>{item.name}</Text>
                <Text style={[Type.cap, { color: Colors.textSecondary }]}>{item.brand} • {item.price}</Text>
              </Card>
            )}
          />
        </View>
      </View>
    </Screen>
  );
}
