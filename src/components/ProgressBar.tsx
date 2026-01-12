import React from "react";
import { View } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";

export function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <View
      style={{
        height: Spacing.sm,
        borderRadius: Radius.pill,
        backgroundColor: Colors.muted,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${v * 100}%`,
          height: "100%",
          backgroundColor: Colors.primary,
        }}
      />
    </View>
  );
}
