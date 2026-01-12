import "react-native";

declare module "react-native" {
  // allow `gap` style in ViewStyle where modern RN or runtime uses it
  interface ViewStyle {
    gap?: number | string;
  }
}
