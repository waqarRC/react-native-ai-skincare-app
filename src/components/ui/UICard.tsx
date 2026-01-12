import React from "react";
import { View, ViewStyle } from "react-native";
import { Palette } from "../../theme/palette";
import { Tokens } from "../../theme/tokens";

export function UICard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return (
    <View
      style={[
        {
          backgroundColor: Palette.card,
          borderRadius: Tokens.radius.lg,
          borderWidth: 1,
          borderColor: Palette.border,
          padding: Tokens.space.lg,
          ...Tokens.shadow.card,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
