import React, { useMemo, useCallback, useState } from "react";
import { Text, View, ScrollView, Image, Pressable } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";

import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { AppButton } from "../components/AppButton";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";

import { PRODUCTS, INGREDIENT_HELP } from "../data/products";
import { useScanStore } from "../store/scanStore";
import { useRoutineStore } from "../store/routineStore";
import { recommendProducts } from "../utils/recommendProducts";

export function ProductsDetailScreen() {
  const route = useRoute<any>();
  const { productId } = route.params;

  const latest = useScanStore((s) => s.latest);
  const addToRoutine = useRoutineStore((s) => s.addToRoutine);

  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId), [productId]);

  const recMeta = useMemo(() => {
    if (!product) return null;
    const list = recommendProducts({
      concerns: latest?.concerns,
      avoidTags: latest?.avoidTags,
      limit: 50,
    });
    return list.find((x) => x.product.id === product.id) ?? null;
  }, [product, latest?.concerns, latest?.avoidTags]);

  const [activeTab, setActiveTab] = useState<"ingredients" | "reviews" | "howto">("ingredients");

  const onAddAM = useCallback(() => {
    if (!product) return;
    addToRoutine("AM", { productId: product.id, step: mapCategoryToStep(product.category) });
  }, [addToRoutine, product]);

  const onAddPM = useCallback(() => {
    if (!product) return;
    addToRoutine("PM", { productId: product.id, step: mapCategoryToStep(product.category) });
  }, [addToRoutine, product]);

  if (!product) {
    return (
      <Screen>
        <Header title="Product not found" />
        <View>
          <Text style={[Type.h2, { color: Colors.textPrimary }]}>Product not found</Text>
        </View>
      </Screen>
    );
  }

  const matchPercent = recMeta ? recMeta.matchPercent : 0;

  return (
    <Screen>
      <Header title={product.name} />
      <ScrollView contentContainerStyle={{ gap: Spacing.xs }}>

        {/* Top small claim chips */}
        <View style={{ alignItems: "center", gap: Spacing.sm }}>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {product.claims.slice(0, 6).map((c) => (
              <Badge key={c} kind="premium" label={c} />
            ))}
          </View>
        </View>

        {/* Centered product image (placeholder) */}
        <View style={{ alignItems: "center" }}>
          <View style={{ width: "100%", height: 260, borderRadius: Radius.lg, backgroundColor: Colors.surface, alignItems: "center", justifyContent: "center" }}>
            {/* <Text style={[Type.h3, { color: Colors.textSecondary }]}>{product.brand}</Text> */}
           <Image source={{ uri: "https://placehold.co/260/2EB5A3/white.png" }} style={{ width: "100%", height: 210, borderRadius: 8 }} />
          </View>
        </View>

        {/* Title / price */}
        <View>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>{product.name}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
            <View>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>{product.brand}</Text>
              <Text style={[Type.h3, { color: Colors.textPrimary }]}>{product.price} <Text style={[Type.cap, { color: Colors.textSecondary }]}> • ⭐ {product.rating}</Text></Text>
            </View>
            <Pressable>
              <Text style={[Type.sub, { color: Colors.primary }]}>♡</Text>
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", gap: 12, marginTop: Spacing.sm }}>
          <Pressable onPress={() => setActiveTab("ingredients") } style={{ paddingVertical: 8 }}>
            <Text style={[Type.sub, { color: activeTab === "ingredients" ? Colors.primary : Colors.textSecondary }]}>Ingredients</Text>
            {activeTab === "ingredients" && <View style={{ height: 3, backgroundColor: Colors.primary, marginTop: 6, borderRadius: 3 }} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab("reviews") } style={{ paddingVertical: 8 }}>
            <Text style={[Type.sub, { color: activeTab === "reviews" ? Colors.primary : Colors.textSecondary }]}>Reviews</Text>
            {activeTab === "reviews" && <View style={{ height: 3, backgroundColor: Colors.primary, marginTop: 6, borderRadius: 3 }} />}
          </Pressable>
          <Pressable onPress={() => setActiveTab("howto") } style={{ paddingVertical: 8 }}>
            <Text style={[Type.sub, { color: activeTab === "howto" ? Colors.primary : Colors.textSecondary }]}>How to use</Text>
            {activeTab === "howto" && <View style={{ height: 3, backgroundColor: Colors.primary, marginTop: 6, borderRadius: 3 }} />}
          </Pressable>
        </View>


        {/* Action / Add to routine */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Add to routine</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <AppButton title="Add to AM" onPress={onAddAM} />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton title="Add to PM" variant="secondary" onPress={onAddPM} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            <AppButton title="Info" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
            <AppButton title="Edit" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
            <AppButton title="Share" variant="secondary" onPress={() => {}} style={{ flex: 1 }} />
          </View>
          <Text style={[Type.cap, { color: Colors.textSecondary }]}>
            Adding a product replaces the same step in that routine (e.g. Serum).
          </Text>
        </Card>

        {/* Why recommended */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Why this is recommended</Text>

          {!latest ? (
            <Text style={[Type.body, { color: Colors.textSecondary }]}>
              Scan your face to personalize match scoring.
            </Text>
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                <Badge kind="match" label={`${matchPercent}% Match`} />
                {(recMeta?.why ?? []).slice(0, 3).map((w) => (
                  <Badge key={w} kind="premium" label={w} />
                ))}
              </View>

              {(recMeta?.warnings?.length ?? 0) > 0 ? (
                <Badge kind="caution" label={recMeta!.warnings[0]} />
              ) : (
                <Badge kind="safe" label="No major conflicts detected" />
              )}
            </>
          )}
        </Card>

        {/* Key ingredients (tabbed) */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Key ingredients</Text>
          {activeTab === "ingredients" && (
            <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
              {product.keyIngredients.map((x) => (
                <Badge key={x} kind="safe" label={x} />
              ))}
            </View>
          )}
          {activeTab === "reviews" && (
            <View>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>No reviews yet.</Text>
            </View>
          )}
          {activeTab === "howto" && (
            <View>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>{product.howToUse}</Text>
            </View>
          )}
        </Card>

        {/* Ingredients summary */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Ingredients</Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={[Type.sub, { color: Colors.textSecondary }]}>No concerns</Text>
              <Text style={[Type.h3, { color: Colors.textPrimary }]}>{product.keyIngredients.length}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[Type.sub, { color: Colors.textSecondary }]}>Warnings</Text>
              <Text style={[Type.h3, { color: Colors.warningAmber }]}>{(recMeta?.warnings?.length ?? 0)}</Text>
            </View>
          </View>
          <Text style={[Type.cap, { color: Colors.textSecondary, marginTop: 8 }]}>More information</Text>
        </Card>

        {/* Bottom action bar spacer */}
        <View style={{ height: 88 }} />

        {/* Sticky action bar */}
        <View style={{ position: "absolute", left: Spacing.xl, right: Spacing.xl, bottom: Spacing.md, flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <AppButton title="Add to Bag" variant="secondary" onPress={() => {}} />
          </View>
          <View style={{ flex: 1 }}>
            <AppButton title="Buy Now" onPress={() => {}} />
          </View>
        </View>

        {/* Ingredient explanations */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Ingredient explanations</Text>
          <View style={{ gap: 10 }}>
            {product.keyIngredients.slice(0, 6).map((tag) => (
              <View key={tag} style={{ gap: 6 }}>
                <Badge kind="safe" label={tag} />
                <Text style={[Type.body, { color: Colors.textSecondary }]}>
                  {INGREDIENT_HELP[tag] ?? "Supports skin goals."}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Full ingredient list */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Full ingredient list</Text>
          <Text style={[Type.body, { color: Colors.textSecondary }]}>{product.ingredientsText}</Text>
        </Card>

        {/* How to use */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>How to use</Text>
          <Text style={[Type.body, { color: Colors.textSecondary }]}>{product.howToUse}</Text>
        </Card>

        {/* Claims */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Claims</Text>
          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            {product.claims.map((c) => (
              <Badge key={c} kind="premium" label={c} />
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

function mapCategoryToStep(cat: string) {
  switch (cat) {
    case "cleanser":
      return "Cleanser";
    case "toner":
      return "Toner";
    case "serum":
      return "Serum";
    case "treatment":
      return "Treatment";
    case "moisturizer":
      return "Moisturizer";
    case "sunscreen":
      return "Sunscreen";
    default:
      return "Step";
  }
}
