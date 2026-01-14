// import React from "react";
// import { Text, View, Image, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import { Screen } from "../components/ui/Screen";
// import { Header } from "../components/Header";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../app/AppNavigator";
// import { Colors } from "../theme/colors";
// import { Type } from "../theme/typography";
// import { Card } from "../components/Card";
// import { AppButton } from "../components/AppButton";
// import { ProgressBar } from "../components/ProgressBar";
// import { Spacing } from "../theme/spacing";
// import { PRODUCTS } from "../data/products";
// import { Badge } from "../components/Badge";


// type Props = NativeStackScreenProps<RootStackParamList, "Results">;

// export function ResultsScreen({ navigation, route }: Props) {
//  const { skinType, confidence, capturedUri, faceCount } = route.params;


//   const concerns = [
//     { label: "Moisture level", v: 0.76 },
//     { label: "Oil balance", v: 0.58 },
//     { label: "UV Exposure", v: 0.65 },
//     { label: "Pore visibility", v: 0.83 },
//   ];

//   return (
//     <Screen>
//       <Header title="Results" />

//       <View style={{ gap: 14, marginTop: 8 }}>
//         {/* Analysis banner */}
//         <Card style={{ padding: Spacing.md }}>
//           <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//             <View>
//               <Text style={[Type.h3, { color: Colors.textPrimary }]}>The analysis of your skin is complete</Text>
//               <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 6 }]}>Personalized recommendations:</Text>
//             </View>
//             {capturedUri ? (
//               <Image source={{ uri: capturedUri }} style={{ width: 65, height: 65, borderRadius: 12 }} />
//             ) : null}
//           </View>
//         </Card>

//         {/* Stat tiles */}
//         <View style={{ flexDirection: "row", flexWrap: "wrap", gap: Spacing.md }}>
//           {concerns.map((c) => (
//             <Card key={c.label} style={{ width: "48%", padding: Spacing.md }}>
//               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                 <Text style={[Type.sub, { color: Colors.textSecondary }]}>{c.label}</Text>
//                 <Text style={[Type.h3, { color: Colors.primary }]}>{Math.round(c.v * 100)}%</Text>
//               </View>
//               <View style={{ height: 8 }} />
//               <ProgressBar value={c.v} />
//             </Card>
//           ))}
//         </View>

//         {/* Recommendation chips */}
//         <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
//           <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.primary }}>
//             <Text style={[Type.body, { color: "#fff" }]}>All</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.bg }}>
//             <Text style={[Type.body, { color: Colors.textPrimary }]}>Skincare</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={{ paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: Colors.bg }}>
//             <Text style={[Type.body, { color: Colors.textPrimary }]}>Makeup</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Horizontal recommendations */}
//         <View>
//           <FlatList
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             data={PRODUCTS.slice(0, 8)}
//             keyExtractor={(i) => i.id}
//             renderItem={({ item }) => (
//               <Card style={{ width: 160, marginRight: Spacing.md }}>
//                 {/* <Image source={{ uri: item.image || "https://via.placeholder.com/160" }} style={{ width: "100%", height: 120, borderRadius: 8 }} /> */}
//                 <Image source={{ uri: "https://placehold.co/160/2EB5A3/white.png" }} style={{ width: "100%", height: 120, borderRadius: 8 }} />
//                 <Text style={[Type.sub, { color: Colors.textPrimary, marginTop: 8 }]} numberOfLines={2}>{item.name}</Text>
//                 <Text style={[Type.cap, { color: Colors.textSecondary }]}>{item.brand}</Text>
//               </Card>
//             )}
//           />
//         </View>

//         <View style={{ marginTop: "auto", gap: 10 }}>
//           <AppButton title="Open Routine" onPress={() => navigation.navigate("MainTabs")} />
//           <AppButton title="Scan Again" variant="secondary" onPress={() => navigation.navigate("MainTabs")} />
//         </View>
//       </View>
//     </Screen>
//   );
// }

// const styles = StyleSheet.create({});



import React from "react";
import { Text, View, Image, FlatList, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
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
  const {
    skin_type,
    acne_level,
    oiliness,
    dryness,
    redness,
    dark_circles,
    fine_lines,
    pores,
    overall_skin_health,
    skincare_advice,
    capturedUri,
    face_detected,
    recommended_products
  } = route.params;
const normalizeLevel = (level?: string) => {
  if (!level) return "";

  const l = level.toLowerCase();

  // no issue
  if (["none", "no", "absent"].some(k => l.includes(k))) return "none";

  if (l.includes("minimal")) return "minimal";
  if (["low", "normal"].some(k => l.includes(k))) return "low";
  if (l.includes("mild")) return "mild";
  if (["medium", "average", "moderate"].some(k => l.includes("moderate") || l.includes("medium") || l.includes("average"))) return "moderate";
  if (l.includes("visible")) return "moderate";
  if (l.includes("good") || l.includes("healthy")) return "good";
  if (l.includes("high")) return "high";
  if (l.includes("severe")) return "severe";

  // Handle ranges like "moderate_to_high" or "low_to_moderate"
  if (l.includes("_to_")) {
    const parts = l.split("_to_");
    // Take the higher value in the range
    return normalizeLevel(parts[1]);
  }

  return "";
};


  // Convert AI text levels to 0-1 for progress bars
const mapLevelToNumber = (level: string) => {
  if (!level) return 0;
  const normalized = normalizeLevel(level);
  switch (normalized) {
    case "none":       return 0;
    case "minimal":    return 0.1;
    case "low":        return 0.25;
    case "mild":       return 0.33;
    case "moderate":   return 0.5;
    case "good":       return 0.75;
    case "high":       return 0.85; // increased slightly to differentiate from good
    case "severe":     return 1;
    default:           return 0;
  }
};



const concerns = [
  { label: "Acne Level", v: mapLevelToNumber(acne_level) },          // "low" → 0.25
  { label: "Oiliness", v: mapLevelToNumber(oiliness) },              // "moderate" → 0.5
  { label: "Dryness", v: mapLevelToNumber(dryness) },                // "low" → 0.25
  { label: "Redness", v: mapLevelToNumber(redness) },                // "low" → 0.25
  { label: "Dark Circles", v: mapLevelToNumber(dark_circles) },      // "moderate_to_high" → 0.85
  { label: "Fine Lines", v: mapLevelToNumber(fine_lines) },          // "low" → 0.25
  { label: "Pores", v: mapLevelToNumber(pores) },                    // "moderate" → 0.5
  { label: "Overall Skin Health", v: mapLevelToNumber(overall_skin_health) } // "good" → 0.75
];



  return (
    <Screen>
      <Header title="Results" />

      <ScrollView contentContainerStyle={{ gap: 14, marginTop: 8, paddingBottom: Spacing.xl }} showsVerticalScrollIndicator={false}>

        {/* Analysis Banner */}
        <Card style={{ padding: Spacing.md }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View>
              <Text style={[Type.h3, { color: Colors.textPrimary }]}>
                Your skin analysis is complete
              </Text>
              <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 6 }]}>
                Skin type: {skin_type}, Overall health: {overall_skin_health}
              </Text>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>
                Face count detected: {face_detected ? 'Yes' : 'No'}
              </Text>
            </View>
            {capturedUri && (
              <Image source={{ uri: capturedUri }} style={{ width: 50, height: 50, borderRadius: 12,marginLeft:5 }} />
            )}
          </View>
        </Card>

        {/* Concern Tiles */}
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

        {/* Skincare Advice Chips */}
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {skincare_advice?.map((advice, i) => (
            <Badge
              key={i}
              label={advice} // ✅ was 'text', now correct
              kind={"match"}            />
          ))}
        </View>


        {/* Product Recommendations */}
        <View style={{ marginTop: 16 }}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recommended_products}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <Card style={{ width: 160, marginRight: Spacing.md }}>
                <Image
                  source={{ uri: item.image || "https://placehold.co/160/2EB5A3/white.png" }}
                  style={{ width: "100%", height: 120, borderRadius: 8 }}
                />
                <Text style={[Type.sub, { color: Colors.textPrimary, marginTop: 8 }]} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={[Type.cap, { color: Colors.textSecondary }]}>{item.brand}</Text>
              </Card>
            )}
          />
        </View>

        {/* Buttons */}
        <View style={{ marginTop: "auto", gap: 10, marginBottom: 20 }}>
          <AppButton title="Open Routine" onPress={() => navigation.navigate("MainTabs")} />
          <AppButton title="Scan Again" variant="secondary" onPress={() => navigation.navigate("MainTabs")} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({});
