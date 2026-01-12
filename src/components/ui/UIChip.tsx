import React from "react";
import { View, Text, Pressable } from "react-native";
import { Palette } from "../../theme/palette";
import { Tokens } from "../../theme/tokens";
import { TypeScale } from "../../theme/type";

type Kind = "primary" | "neutral" | "success" | "warning" | "danger";

const K: Record<Kind, { bg: string; text: string; border: string }> = {
  primary: { bg: Palette.primarySoft, text: Palette.primary, border: "rgba(46,181,163,0.22)" },
  neutral: { bg: "#F1F5F9", text: Palette.text, border: Palette.border },
  success: { bg: Palette.ok, text: Palette.ok, border: "rgba(16,185,129,0.2)" },
  warning: { bg: Palette.warn, text: Palette.warn, border: "rgba(245,158,11,0.22)" },
  danger: { bg: Palette.danger, text: Palette.danger, border: "rgba(225,29,72,0.2)" },
};

export function UIChip({
  label,
  kind = "neutral",
  active,
  onPress,
}: {
  label: string;
  kind?: Kind;
  active?: boolean;
  onPress?: () => void;
}) {
  const bg = active ? K.primary.bg : K[kind].bg;
  const border = active ? K.primary.border : K[kind].border;
  const text = active ? K.primary.text : K[kind].text;

  const content = (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: Tokens.radius.pill,
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
      }}
    >
      <Text style={[TypeScale.cap, { color: text }]}>{label}</Text>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]} onPress={onPress}>
      {content}
    </Pressable>
  );
}
