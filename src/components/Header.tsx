import React from "react";
import { View, Text, Pressable } from "react-native";
import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";

export function Header({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: Spacing.sm,
        paddingHorizontal: 0,
      }}
    >
      <View>
        <Text style={[Type.h2, { color: Colors.textPrimary }]}>{title}</Text>
      </View>

      <View style={{ marginLeft: 12 }}>{right}</View>
    </View>
  );
}
