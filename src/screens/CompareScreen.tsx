import React, { useMemo } from "react";
import { Text, View, ScrollView, Image, TouchableOpacity, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { Spacing } from "../theme/spacing";

import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { AppButton } from "../components/AppButton";

import { PRODUCTS, INGREDIENT_HELP } from "../data/products";
import { useProductsStore } from "../store/productsStore";
import { useRoutineStore } from "../store/routineStore";

export function CompareScreen() {
  const compare = useProductsStore((s) => s.compare);
  const clearCompare = useProductsStore((s) => s.clearCompare);

  const comparedProducts = useMemo(() => {
    return compare.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as typeof PRODUCTS;
  }, [compare]);

  const a = comparedProducts[0];
  const b = comparedProducts[1];
  const addToRoutine = useRoutineStore((s) => s.addToRoutine);

  if (compare.length < 2 || !a || !b) {
    return (
      <Screen>
        <Header title="Compare" />
        <View style={{ gap: Spacing.md }}>
          <Card>
            <Text style={[Type.body, { color: Colors.textSecondary }]}>Select 2 products to compare from Products tab.</Text>
          </Card>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Compare"
        right={
          <Pressable onPress={clearCompare} style={{ padding: 6 }} accessibilityLabel="clear-compare">
            <Ionicons name="trash" size={20} color={Colors.textPrimary} />
          </Pressable>
        }
      />
      <ScrollView>
        {/* top product strip */}
        <View style={styles.topStrip}>
          <View style={styles.stripItem}>
            <Image source={{ uri: "https://placehold.co/160/2EB5A3/white.png" }} style={styles.thumb} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={[Type.sub, { color: Colors.textPrimary }]} numberOfLines={1}>{a.name}</Text>
              <Text style={[Type.cap, { color: Colors.textSecondary }]} numberOfLines={1}>{a.brand}</Text>
            </View>
            {/* <Pressable onPress={() => {  }} style={styles.smallRemove}>
              <Ionicons name="close" size={14} color={Colors.textSecondary} />
            </Pressable> */}
          </View>

          <View style={{ width: 12 }} />

          <View style={styles.stripItem}>
            {/* <Image source={{ uri: b.image || "https://via.placeholder.com/160" }} style={styles.thumb} /> */}
            <Image source={{ uri: "https://placehold.co/160/2EB5A3/white.png" }} style={styles.thumb} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={[Type.sub, { color: Colors.textPrimary }]} numberOfLines={1}>{b.name}</Text>
              <Text style={[Type.cap, { color: Colors.textSecondary }]} numberOfLines={1}>{b.brand}</Text>
            </View>
          </View>
        </View>

        {/* comparison table */}
        <Card style={{ marginTop: Spacing.md, padding: Spacing.md }}>
          <View style={styles.tableHeader}>
            <View style={{ width: 120 }}>
              <Text style={[Type.cap, { color: Colors.textSecondary }]}>Attribute</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[Type.cap, { color: Colors.textSecondary }]}>Product A</Text>
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Text style={[Type.cap, { color: Colors.textSecondary }]}>Product B</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.cell} numberOfLines={2}>{a.name}</Text>
            <Text style={styles.cell} numberOfLines={2}>{b.name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.cell}>{a.price}</Text>
            <Text style={styles.cell}>{b.price}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Rating</Text>
            <View style={styles.cell}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ flexDirection: "row" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons key={i} name={i < Math.round(a.rating ?? 4) ? "star" : "star-outline"} size={12} color="#F6C24E" />
                  ))}
                </View>
                <Text style={[Type.cap, { color: Colors.textSecondary }]}>{a.rating?.toFixed(1)}</Text>
              </View>
            </View>
            <View style={styles.cell}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ flexDirection: "row" }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Ionicons key={i} name={i < Math.round(b.rating ?? 4) ? "star" : "star-outline"} size={12} color="#F6C24E" />
                  ))}
                </View>
                <Text style={[Type.cap, { color: Colors.textSecondary }]}>{b.rating?.toFixed(1)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Key ingredients</Text>
            <View style={styles.cell}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {a.keyIngredients.slice(0, 6).map((x) => (
                  <Badge key={x} label={x} kind={b.keyIngredients.includes(x) ? "match" : "safe"} />
                ))}
              </View>
            </View>
            <View style={styles.cell}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {b.keyIngredients.slice(0, 6).map((x) => (
                  <Badge key={x} label={x} kind={a.keyIngredients.includes(x) ? "match" : "safe"} />
                ))}
              </View>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>How to use</Text>
            <Text style={styles.cell}>{a.howToUse}</Text>
            <Text style={styles.cell}>{b.howToUse}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Actions</Text>
            <View style={styles.cell}>
              <AppButton title="Add AM" variant="secondary" onPress={() => addToRoutine("AM", { productId: a.id, step: a.category })} />
            </View>
            <View style={styles.cell}>
              <AppButton title="Add AM" variant="secondary" onPress={() => addToRoutine("AM", { productId: b.id, step: b.category })} />
            </View>
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}




const styles = StyleSheet.create({
  banner: {
    backgroundColor: Colors.premium ?? Colors.primary,
    padding: Spacing.lg,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  itemsList: {
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: Colors.bg,
    borderRadius: 12,
  },
  topStrip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  stripItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 10,
  },
  smallRemove: {
    padding: 6,
  },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    flexBasis: 120,
    color: Colors.textSecondary,
    width: 120,
    paddingRight: 12,
  },
  cell: {
    flex: 1,
    color: Colors.textPrimary,
  },
  tableCard: {
    borderRadius: 12,
    overflow: "hidden",
  },
});
