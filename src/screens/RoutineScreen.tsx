import React, { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";

import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { AppButton } from "../components/AppButton";

import { Colors } from "../theme/colors";
import { Spacing } from "../theme/spacing";
import { Type } from "../theme/typography";

import { useRoutineStore } from "../store/routineStore";
import { PRODUCTS } from "../data/products";

export function RoutineScreen() {
  const [tab, setTab] = useState<"AM" | "PM">("AM");

  const am = useRoutineStore((s) => s.am);
  const pm = useRoutineStore((s) => s.pm);
  const removeFromRoutine = useRoutineStore((s) => s.removeFromRoutine);
  const clearRoutine = useRoutineStore((s) => s.clearRoutine);

  const items = tab === "AM" ? am : pm;

  const resolved = useMemo(() => {
    return items
      .map((x) => {
        const p = PRODUCTS.find((p) => p.id === x.productId);
        return p ? { ...x, product: p } : null;
      })
      .filter(Boolean) as any[];
  }, [items]);

  return (
    <Screen>
      <Header title="Routine" />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable onPress={() => setTab("AM")}>
          <Badge kind={tab === "AM" ? "premium" : "safe"} label={`AM 🌞`} />
        </Pressable>
        <Pressable onPress={() => setTab("PM")}>
          <Badge kind={tab === "PM" ? "premium" : "safe"} label={`PM 🌙`} />
        </Pressable>
      </View>

      {resolved.length === 0 ? (
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>No {tab} routine yet</Text>
          <Text style={[Type.body, { color: Colors.textSecondary }]}>Go to Products → tap “Add AM / Add PM” to build your routine.</Text>
        </Card>
      ) : (
        <Card style={{ gap: 14 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>{tab} Routine</Text>

          {resolved
            .sort((a, b) => stepOrder(a.step) - stepOrder(b.step))
            .map((x, idx) => (
              <View
                key={`${x.productId}-${idx}`}
                style={{
                  padding: Spacing.md,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  backgroundColor: Colors.surface,
                  gap: 8,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <Badge kind="match" label={`${idx + 1}. ${x.step}`} />
                  <Text style={[Type.sub, { color: Colors.textSecondary }]}>{x.product.category.toUpperCase()}</Text>
                </View>

                <Text style={[Type.h3, { color: Colors.textPrimary }]}>{x.product.name}</Text>
                <Text style={[Type.body, { color: Colors.textSecondary }]}> 
                  {x.product.brand} • {x.product.price} • ⭐ {x.product.rating}
                </Text>

                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {x.product.keyIngredients.slice(0, 4).map((k: string) => (
                    <Badge key={k} kind="safe" label={k} />
                  ))}
                </View>

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <AppButton title="Remove" variant="secondary" onPress={() => removeFromRoutine(tab, x.productId)} />
                  </View>
                </View>
              </View>
            ))}
        </Card>
      )}

      <Card style={{ gap: 10 }}>
        <Text style={[Type.h3, { color: Colors.textPrimary }]}>Tip</Text>
        <Text style={[Type.body, { color: Colors.textSecondary }]}>Start slow with actives (BHA/Retinoid/AHA) and always use SPF in the morning.</Text>
      </Card>
    </Screen>
  );
}

function stepOrder(step: string) {
  const map: Record<string, number> = {
    Cleanser: 1,
    Toner: 2,
    Serum: 3,
    Treatment: 4,
    Moisturizer: 5,
    Sunscreen: 6,
  };
  return map[step] ?? 99;
}
