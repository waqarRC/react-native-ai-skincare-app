import React, { useMemo, useState } from "react";
import { View, TextInput, FlatList, Pressable, Text, Alert, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { AppButton } from "../components/AppButton";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import { Type } from "../theme/typography";

import { useScanStore } from "../store/scanStore";
import { useRoutineStore } from "../store/routineStore";
import { useProductsStore } from "../store/productsStore";

import { PRODUCTS } from "../data/products";
import { recommendProducts } from "../utils/recommendProducts";
import type { RootStackParamList } from "../app/AppNavigator";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type Tab = "recommended" | "shop" | "favorites";
type SortKey = "best_match" | "rating" | "price_low" | "price_high" | "name";

const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "cleanser", label: "Cleanser" },
  { key: "toner", label: "Toner" },
  { key: "serum", label: "Serum" },
  { key: "treatment", label: "Treatment" },
  { key: "moisturizer", label: "Moisturizer" },
  { key: "sunscreen", label: "SPF" },
] as const;

export function ProductsScreen() {
  const navigation = useNavigation<Nav>();
  const latest = useScanStore((s) => s.latest);

  const addToRoutine = useRoutineStore((s) => s.addToRoutine);

  const favorites = useProductsStore((s) => s.favorites);
  const toggleFavorite = useProductsStore((s) => s.toggleFavorite);

  const compare = useProductsStore((s) => s.compare);
  const addCompare = useProductsStore((s) => s.addCompare);
  const removeCompare = useProductsStore((s) => s.removeCompare);
  const clearCompare = useProductsStore((s) => s.clearCompare);

  const [tab, setTab] = useState<Tab>("recommended");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]["key"]>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("best_match");

  const topConcerns = (latest?.concerns ?? [])
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const recommended = useMemo(() => {
    return recommendProducts({
      concerns: latest?.concerns,
      avoidTags: latest?.avoidTags,
      category: category as any,
      query,
      limit: 60,
    });
  }, [latest?.concerns, latest?.avoidTags, category, query]);

  const recommendedSorted = useMemo(() => {
    const list = recommended.slice();
    if (sort === "rating") list.sort((a, b) => b.product.rating - a.product.rating);
    if (sort === "name") list.sort((a, b) => a.product.name.localeCompare(b.product.name));
    if (sort === "price_low") list.sort((a, b) => priceValue(a.product.price) - priceValue(b.product.price));
    if (sort === "price_high") list.sort((a, b) => priceValue(b.product.price) - priceValue(a.product.price));
    return list;
  }, [recommended, sort]);

  const shopList = useMemo(() => {
    let list = PRODUCTS.slice();
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const hay = `${p.name} ${p.brand} ${p.category} ${p.keyIngredients.join(" ")}`.toLowerCase();
        return hay.includes(q);
      });
    }
    if (category !== "all") list = list.filter((p) => p.category === category);

    list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "price_low") return priceValue(a.price) - priceValue(b.price);
      if (sort === "price_high") return priceValue(b.price) - priceValue(a.price);
      return 0;
    });

    return list;
  }, [query, category, sort]);

  const favoritesList = useMemo(() => {
    const set = new Set(favorites);
    return PRODUCTS.filter((p) => set.has(p.id));
  }, [favorites]);

  const toggleCompare = (id: string) => {
    if (compare.includes(id)) {
      removeCompare(id);
      return;
    }
    const res = addCompare(id);
    if (!res.ok) Alert.alert("Compare", res.reason ?? "You can compare only 2 products.");
  };

  return (
    <Screen>
      <Header
        title="Products"
        right={
          <Pressable onPress={() => navigation.navigate("Compare")} style={{ padding: 6 }} accessibilityLabel="compare-header">
            <Ionicons name="swap-horizontal" size={22} color={Colors.textPrimary} />
          </Pressable>
        }
      />
{/* Search (moved to top) - primary and secondary */}
      <View>
        <View
          style={{
            backgroundColor: Colors.surface,
            borderRadius: Radius.lg,
            borderWidth: 1,
            borderColor: Colors.border,
            paddingHorizontal: Spacing.md,
            paddingVertical: Spacing.sm,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Ionicons name="search" size={18} color={Colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products, brands, ingredients…"
            placeholderTextColor={Colors.textMuted}
            style={{ flex: 1, color: Colors.textPrimary, fontSize: 14, fontWeight: "600" }}
          />
          {!!query && (
            <Pressable onPress={() => setQuery("")} style={{ padding: 6 }}>
              <Ionicons name="close" size={18} color={Colors.textMuted} />
            </Pressable>
          )}
        </View>
{/* Tabs */}
      <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap", marginTop: Spacing.md }}>
        <Pressable onPress={() => setTab("recommended")} accessibilityLabel="Recommended tab">
          <Badge label="Recommended" kind={tab === "recommended" ? "match" : "safe"} />
        </Pressable>
        <Pressable onPress={() => setTab("shop")} accessibilityLabel="Shop tab">
          <Badge label="Shop" kind={tab === "shop" ? "match" : "safe"} />
        </Pressable>
        <Pressable onPress={() => setTab("favorites")} accessibilityLabel="Favorites tab">
          <Badge label="Favorites" kind={tab === "favorites" ? "match" : "safe"} />
        </Pressable>
      </View>
      {/* Category (one-line icon-only scroll) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: Spacing.sm }} contentContainerStyle={{ paddingHorizontal: Spacing.md, gap: Spacing.sm }}>
        {CATEGORIES.map((c) => (
          <Pressable key={c.key} onPress={() => setCategory(c.key)} accessibilityLabel={`category-${c.key}`}>
            <View style={{paddingHorizontal: Spacing.sm, height: 20, borderRadius: 10, backgroundColor: category === c.key ? Colors.primary : Colors.surface, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: category === c.key ? Colors.primary : Colors.border }}>
              <Text style={[Type.cap, { color: category === c.key ? "#fff" : Colors.textPrimary }]}>{c.label.toUpperCase()}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>


      </View>

      
      {/* Scan summary */}
      {/* <Card style={{ gap: Spacing.sm }}>
        <Text style={[Type.h3, { color: Colors.textPrimary }]}>Based on your scan</Text>

        {!latest ? (
          <Text style={[Type.body, { color: Colors.textSecondary }]}>Scan your face to unlock smart recommendations.</Text>
        ) : (
          <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              <Badge kind="match" label={`${latest.skinType} Skin`} />
              <Badge kind="match" label={`${Math.round(latest.confidence * 100)}% Confidence`} />
              {(latest.avoidTags ?? []).slice(0, 2).map((t) => (
                <Badge key={t} kind="avoid" label={`Avoid: ${t}`} />
              ))}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {topConcerns.map((c) => (
                <Badge key={c.key} kind="safe" label={`${c.key} ${Math.round(c.score * 100)}%`} />
              ))}
            </View>
          </>
        )}
      </Card> */}
    


      {/* Compare Bar */}
      {compare.length > 0 && (
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Compare</Text>
          <Text style={[Type.body, { color: Colors.textSecondary }]}>Select 2 products. You selected {compare.length}/2.</Text>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <AppButton
                title={compare.length < 2 ? "Select 2 products" : "Compare now"}
                onPress={() => compare.length === 2 && navigation.navigate("Compare")}
                variant={compare.length < 2 ? "secondary" : "primary"}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AppButton title="Clear" variant="secondary" onPress={clearCompare} />
            </View>
          </View>
        </Card>
      )}

      {/* Lists */}
      {tab === "recommended" && (
        <FlatList
          data={recommendedSorted}
          keyExtractor={(x) => x.product.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: Spacing.md }}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => {
            const p = item.product;
            return (
              <GridCard
                item={p}
                index={index}
                onPress={() => navigation.navigate("ProductsDetail", { productId: p.id })}
                onFav={() => toggleFavorite(p.id)}
                fav={favorites.includes(p.id)}
                    compared={compare.includes(p.id)}
                onCompare={() => toggleCompare(p.id)}
                onAddAM={() => addToRoutine("AM", { productId: p.id, step: mapCategoryToStep(p.category) })}
                onAddPM={() => addToRoutine("PM", { productId: p.id, step: mapCategoryToStep(p.category) })}
              />
            );
          }}
          ListEmptyComponent={
            <Card>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>No products found.</Text>
            </Card>
          }
        />
      )}

      {tab === "shop" && (
        <FlatList
          data={shopList}
          keyExtractor={(x) => x.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: Spacing.md }}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => (
            <GridCard
              item={item}
              index={index}
              onPress={() => navigation.navigate("ProductsDetail", { productId: item.id })}
              onFav={() => toggleFavorite(item.id)}
              fav={favorites.includes(item.id)}
              compared={compare.includes(item.id)}
              onCompare={() => toggleCompare(item.id)}
              onAddAM={() => addToRoutine("AM", { productId: item.id, step: mapCategoryToStep(item.category) })}
              onAddPM={() => addToRoutine("PM", { productId: item.id, step: mapCategoryToStep(item.category) })}
            />
          )}
          ListEmptyComponent={
            <Card>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>No products found.</Text>
            </Card>
          }
        />
      )}

      {tab === "favorites" && (
        <FlatList
          data={favoritesList}
          keyExtractor={(x) => x.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between", marginBottom: Spacing.md }}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item, index }) => (
            <GridCard
              item={item}
              index={index}
              onPress={() => navigation.navigate("ProductsDetail", { productId: item.id })}
              onFav={() => toggleFavorite(item.id)}
              fav={favorites.includes(item.id)}
              compared={compare.includes(item.id)}
              onCompare={() => toggleCompare(item.id)}
              onAddAM={() => addToRoutine("AM", { productId: item.id, step: mapCategoryToStep(item.category) })}
              onAddPM={() => addToRoutine("PM", { productId: item.id, step: mapCategoryToStep(item.category) })}
            />
          )}
          ListEmptyComponent={
            <Card>
              <Text style={[Type.body, { color: Colors.textSecondary }]}>No favorites yet. Tap ❤️ on any product.</Text>
            </Card>
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  gridImage: {
    width: "100%",
    height: 140,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  cardImageBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardImage: {
    width: "90%",
    height: "90%",
    resizeMode: "contain",
  },
  title: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 16,
  },
  price: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "700",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  saleRibbon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#E53935",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    transform: [{ rotate: "-18deg" }],
  },
});

function GridCard({ item, index, onPress, onFav, fav, compared, onCompare, onAddAM, onAddPM }: { item: any; index: number; onPress?: () => void; onFav?: () => void; fav?: boolean; compared?: boolean; onCompare?: () => void; onAddAM?: () => void; onAddPM?: () => void }) {
  const stars = Math.round(item.rating || 4);
  return (
    <TouchableOpacity onPress={onPress} style={{ width: "48%" }}>
      <Card style={{ padding: 8, minHeight: 240 }}>
        <View style={styles.cardImageBox}>
          <Image source={{ uri: "https://placehold.co/160/2EB5A3/white.png" }} style={styles.cardImage} />
        </View>

        <Text style={[Type.sub, { color: Colors.textPrimary }, styles.title]} numberOfLines={1}>{item.name}</Text>

        <View style={styles.ratingRow}>
          <View style={{ flexDirection: "row" }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Ionicons key={i} name={i < stars ? "star" : "star-outline"} size={12} color="#F6C24E" />
            ))}
          </View>
          <Text style={[Type.cap, { color: Colors.textSecondary }]}>{item.rating?.toFixed(1) ?? "4.0"}</Text>
        </View>

        <Text style={[Type.sub, { color: Colors.primary }, styles.price]}>{item.price}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, height: 40 }}>
          <Pressable onPress={(e) => { e.stopPropagation?.(); onAddAM?.(); }} style={{ flexDirection: "row", alignItems: "center", gap: 6 }} accessibilityLabel="add-am">
            <Ionicons name="sunny" size={14} color={Colors.textPrimary} />
            <Text style={[Type.cap, { color: Colors.textPrimary }]}>AM</Text>
          </Pressable>

          <Pressable onPress={(e) => { e.stopPropagation?.(); onAddPM?.(); }} style={{ flexDirection: "row", alignItems: "center", gap: 6 }} accessibilityLabel="add-pm">
            <Ionicons name="moon" size={14} color={Colors.textPrimary} />
            <Text style={[Type.cap, { color: Colors.textPrimary }]}>PM</Text>
          </Pressable>

          <View />

          <Pressable onPress={(e) => { e.stopPropagation?.(); onCompare?.(); }}  accessibilityLabel="compare">
            <Ionicons name={compared ? "checkmark-circle" : "swap-horizontal"} size={18} color={compareIconColor(fav, compared)} />
          </Pressable>

          <Pressable onPress={(e) => { e.stopPropagation?.(); onFav?.(); }} accessibilityLabel="favorite">
            <Ionicons name={fav ? "heart" : "heart-outline"} size={18} color={fav ? Colors.dangerSoft : Colors.textMuted} />
          </Pressable>

        </View>

        {index % 3 === 0 ? (
          <View style={styles.saleRibbon}>
            <Text style={[Type.cap, { color: "#fff", fontSize: 11 }]}>SALE</Text>
          </View>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
}

function compareIconColor(fav?: boolean, compared?: boolean) {
  if (compared) return Colors.primary;
  return fav ? Colors.primary : Colors.textMuted;
}

function priceValue(p: "$" | "$$" | "$$$") {
  return p === "$" ? 1 : p === "$$" ? 2 : 3;
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
