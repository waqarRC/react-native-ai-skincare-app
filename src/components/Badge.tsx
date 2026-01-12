
import React from "react";
import { Text, View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Type } from "../theme/typography";
import { Spacing } from "../theme/spacing";

type Kind = "safe" | "caution" | "avoid" | "match" | "premium";

export function Badge({ kind, label }: { kind: Kind; label: string }) {
  const bg =
    kind === "safe"
      ? "rgba(46,181,163,0.14)"
      : kind === "caution"
      ? "rgba(244,184,96,0.18)"
      : kind === "avoid"
      ? "rgba(233,106,106,0.16)"
      : kind === "premium"
      ? "rgba(201,162,77,0.18)"
      : "rgba(30,30,30,0.06)";

  const fg =
    kind === "safe"
      ? Colors.primary
      : kind === "caution"
      ? Colors.warningAmber
      : kind === "avoid"
      ? Colors.dangerSoft
      : kind === "premium"
      ? Colors.premium
      : Colors.textPrimary;

  return (
    <View
      style={{
        backgroundColor: bg,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs,
        borderRadius: Radius.pill,
        alignSelf: "flex-start",
      }}
    >
      <Text style={[Type.cap, { color: fg, fontWeight: "700" }]}>{label}</Text>
    </View>
  );
}
