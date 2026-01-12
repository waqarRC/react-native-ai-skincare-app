import React from "react";
import { Pressable, Text, ViewStyle } from "react-native";
import { Palette } from "../../theme/palette";
import { Tokens } from "../../theme/tokens";
import { TypeScale } from "../../theme/type";

export function UIButton({
  title,
  variant = "primary",
  onPress,
  style,
}: {
  title: string;
  variant?: "primary" | "secondary";
  onPress: () => void;
  style?: ViewStyle;
}) {
  const primary = variant === "primary";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.9 : 1,
          borderRadius: Tokens.radius.md,
          paddingVertical: 12,
          paddingHorizontal: 14,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: primary ? Palette.primary : "#fff",
          borderWidth: 1,
          borderColor: primary ? "rgba(46,181,163,0.25)" : Palette.border,
        },
        style,
      ]}
    >
      <Text style={[TypeScale.sub, { color: primary ? "#fff" : Palette.text }]}>{title}</Text>
    </Pressable>
  );
}
