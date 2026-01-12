import "expo-file-system";

declare module "expo-file-system" {
  // some Expo SDK versions' types don't include `documentDirectory`.
  // Augment the module with this constant so TS can recognize it.
  export const documentDirectory: string | null;
  // simple EncodingType mapping used by writeAsStringAsync
  export enum EncodingType {
    UTF8 = "utf8",
    UTF16 = "utf16",
    Base64 = "base64",
  }
}
