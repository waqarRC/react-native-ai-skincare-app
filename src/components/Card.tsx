import React from "react";
import { View, ViewStyle } from "react-native";
import { Colors } from "../theme/colors";
import { Radius } from "../theme/radius";
import { Spacing } from "../theme/spacing";
import { Elevation } from "../theme/elevation";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.surface,
          borderRadius: Radius.md,
          borderWidth: 1,
          borderColor: Colors.border,
          padding: Spacing.md,
          // ...Elevation.medium,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
