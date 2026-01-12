import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Type } from "../theme/typography";
import { Spacing } from "../theme/spacing";
import { Elevation } from "../theme/elevation";

type Variant = "primary" | "secondary" | "premium";

export function AppButton({
  title,
  onPress,
  variant = "primary",
  style,
  disabled,
}: {
  title: string;
  onPress: () => void;
  variant?: Variant;
  style?: ViewStyle;
  disabled?: boolean;
}) {
  const bg = variant === "primary" ? Colors.primary : variant === "premium" ? Colors.premium : "transparent";

  const border = variant === "secondary" ? { borderWidth: 1, borderColor: Colors.border } : {};

  const textColor = variant === "secondary" ? Colors.textPrimary : "#fff";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          borderRadius: Radius.pill,
          paddingVertical: Spacing.sm,
          paddingHorizontal: Spacing.lg,
          alignItems: "center",
          opacity: disabled ? 0.6 : pressed ? 0.96 : 1,
          transform: [{ scale: pressed ? 0.995 : 1 }],
          ... (variant === "primary" ? { ...Elevation.low } : {}),
        },
        border,
        style,
      ]}
    >
      <Text style={[Type.sub, { color: textColor, fontWeight: "500" }]}>{title}</Text>
    </Pressable>
  );
}
