import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Palette } from "../../theme/palette";
import { TypeScale } from "../../theme/type";

export function UIHeader({
  title,
  subtitle,
  actionIcon,
  onAction,
}: {
  title: string;
  subtitle?: string;
  actionIcon?: keyof typeof Ionicons.glyphMap;
  onAction?: () => void;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[TypeScale.h2, { color: Palette.text }]}>{title}</Text>
        {!!subtitle && <Text style={[TypeScale.body, { color: Palette.sub }]}>{subtitle}</Text>}
      </View>

      {actionIcon && onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [
            {
              width: 42,
              height: 42,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: Palette.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name={actionIcon} size={20} color={Palette.text} />
        </Pressable>
      ) : null}
    </View>
  );
}
