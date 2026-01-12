import React, { useMemo, useRef, useState } from "react";
import { Text, View, Pressable, StyleSheet, ActivityIndicator, Platform, Image } from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { Badge } from "../components/Badge";
import { AppButton } from "../components/AppButton";
import { Header } from "../components/Header";
import { Screen } from "../components/ui/Screen";
import { Spacing } from "../theme/spacing";
import { Radius } from "../theme/radius";
import type { RootStackParamList } from "../app/AppNavigator";
import { useScanStore } from "../store/scanStore";

type Nav = NativeStackNavigationProp<RootStackParamList>;

type FaceDetectorModule = typeof import("expo-face-detector");
let FaceDetector: FaceDetectorModule | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  FaceDetector = require("expo-face-detector");
} catch {
  FaceDetector = null;
}

type Step = "camera" | "preview" | "processing";

export function ScanScreen() {
  const navigation = useNavigation<Nav>();
  const cameraRef = useRef<CameraView>(null);

  const addScan = useScanStore((s) => s.addScan);

  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("front");

  const [step, setStep] = useState<Step>("camera");
  const [busy, setBusy] = useState(false);

  const [hint, setHint] = useState<string | null>(null);
  const [faceOk, setFaceOk] = useState<boolean | null>(null);

  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const isGranted = !!permission?.granted;

  const statusText = useMemo(() => {
    if (!permission) return "Loading camera permission…";
    if (!permission.granted) return "Camera permission is required to scan.";
    return "Good lighting • Face centered • No glasses";
  }, [permission]);

  const toggleFacing = () => setFacing((p) => (p === "front" ? "back" : "front"));

  const runFaceCheckOnImage = async (uri: string) => {
    if (!FaceDetector) return { available: false, count: 0 };

    const result = await FaceDetector.detectFacesAsync(uri, {
      mode: FaceDetector.FaceDetectorMode.fast,
      detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
      runClassifications: FaceDetector.FaceDetectorClassifications.none,
      minDetectionInterval: 0,
      tracking: false,
    });

    const count = Array.isArray(result) ? result.length : result?.faces?.length ?? 0;
    return { available: true, count };
  };

  const onCapture = async () => {
    if (!cameraRef.current) return;

    setHint(null);
    setFaceOk(null);
    setBusy(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: Platform.OS === "android",
      });

      if (!photo?.uri) {
        setHint("Could not capture image. Please try again.");
        return;
      }

      setPreviewUri(photo.uri);
      setStep("preview");
    } catch {
      setHint("Capture failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const onRetake = () => {
    setHint(null);
    setFaceOk(null);
    setPreviewUri(null);
    setStep("camera");
  };

  const onContinue = async () => {
    if (!previewUri) return;

    setHint(null);
    setFaceOk(null);
    setStep("processing");
    setBusy(true);

    try {
      const face = await runFaceCheckOnImage(previewUri);
      console.log("Face detection result:", face);
      if (face.available) {
        if (face.count !== 1) {
          setFaceOk(false);
          setHint(
            face.count === 0
              ? "No face detected. Retake with your face inside the guide."
              : "Multiple faces detected. Please scan with one face only."
          );
          setStep("preview");
          return;
        }
        setFaceOk(true);
      } else {
        setHint("Face detection not available. Continuing without it.");
      }

      // ✅ TODO: replace with your real AI inference
      const result = {
        skinType: "Combination",
        confidence: 0.92,
        capturedUri: previewUri,
        faceCount: face.available ? face.count : undefined,
        scannedAt: new Date().toISOString(),
      };

      // ✅ Save globally so Home/Routine auto-update
      const saved = addScan({
        skinType: result.skinType,
        confidence: result.confidence,
        capturedUri: result.capturedUri,
        faceCount: result.faceCount,
        scannedAt: result.scannedAt,
      });

    setTimeout(() => {
        navigation.navigate("Results", {
        skinType: result.skinType,
        confidence: result.confidence,
        capturedUri: result.capturedUri, 
        faceCount: result.faceCount,
      });
    }, 5000); // Simulate processing delay
    } catch {
      setHint("Scan failed. Please try again.");
      setStep("preview");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Header
        title={step === "preview" ? "Preview" : step === "processing" ? "Analyzing" : "AI Skin Scan"}
        right={
          step === "camera" ? (
            <Pressable onPress={toggleFacing} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <View style={styles.iconBtn}>
                <Ionicons name="camera-reverse-outline" size={20} color={Colors.textPrimary} />
                <Text style={[Type.cap, { color: Colors.textPrimary, marginLeft: 8 }]}>
                  {facing === "front" ? "Front" : "Back"}
                </Text>
              </View>
            </Pressable>
          ) : undefined
        }
      />

      <View style={{ gap: Spacing.md }}>
        <View style={styles.previewWrap}>
          {!permission ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : !isGranted ? (
            <View style={[styles.center, { padding: 18, gap: 10 }]}>
              <Text style={[Type.body, { color: Colors.textSecondary, textAlign: "center" }]}>
                {statusText}
              </Text>
              <AppButton title="Allow Camera" onPress={requestPermission} />
            </View>
          ) : step === "camera" ? (
            <>
              <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing} />

              <View style={styles.dim} pointerEvents="none" />

              <View style={styles.guideWrap} pointerEvents="none">
                <View style={styles.oval} />
                <Text style={[Type.cap, { color: "#fff", marginTop: 10, opacity: 0.9 }]}>
                  Align your face inside the guide
                </Text>
              </View>

              <View style={styles.sheet}>
                <Card style={{ backgroundColor: "rgba(255,255,255,0.92)" }}>
                  <View style={{ gap: 8 }}>
                    <Text style={[Type.sub, { color: Colors.textPrimary }]}>{statusText}</Text>

                    <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                      <Badge kind="safe" label="Good lighting" />
                      <Badge kind="safe" label="Face centered" />
                      <Badge kind="caution" label="Avoid harsh shadows" />
                    </View>

                    {hint && (
                      <Text style={[Type.body, { color: Colors.textSecondary, marginTop: 6 }]}>
                        {hint}
                      </Text>
                    )}

                    <View style={{ marginTop: 10 }}>
                      <AppButton title={busy ? "Capturing…" : "Capture Photo"} onPress={onCapture} disabled={busy} />
                      <Text style={[Type.cap, { color: Colors.textSecondary, marginTop: 10 }]}>
                        Note: This is not a medical diagnosis.
                      </Text>
                    </View>
                  </View>
                </Card>
              </View>
            </>
          ) : (
            // ✅ Preview + Processing UI
            <>
              {previewUri && (
                <Image
                  source={{ uri: previewUri }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
              )}

              <View style={styles.previewTopBar}>
                <Badge kind="premium" label="Preview" />
              </View>

              <View style={styles.previewActions}>
                <Card style={{ backgroundColor: "rgba(255,255,255,0.94)" }}>
                  <View style={{ gap: 10 }}>
                    <Text style={[Type.h3, { color: Colors.textPrimary }]}>Check your photo</Text>
                    <Text style={[Type.body, { color: Colors.textSecondary }]}>
                      Make sure your face is centered and the lighting is even.
                    </Text>

                    {faceOk === true && <Badge kind="safe" label="Face detected" />}
                    {faceOk === false && <Badge kind="avoid" label="Face check failed" />}
                    {hint && <Text style={[Type.body, { color: Colors.textSecondary }]}>{hint}</Text>}

                    <View style={{ gap: 10, marginTop: 6 }}>
                      <AppButton title="Retake" variant="secondary" onPress={onRetake} disabled={busy} />
                      <AppButton
                        title={step === "processing" || busy ? "Analyzing…" : "Continue"}
                        onPress={onContinue}
                        disabled={busy}
                      />
                    </View>
                  </View>
                </Card>
              </View>

              {(step === "processing" || busy) && (
                <View style={styles.busyOverlay} pointerEvents="none">
                  <View style={styles.busyCard}>
                    <ActivityIndicator />
                    <Text style={[Type.sub, { color: "#fff", marginTop: 10 }]}>Analyzing…</Text>
                    <Text style={[Type.cap, { color: "rgba(255,255,255,0.85)", marginTop: 6 }]}>
                      This may take a few seconds
                    </Text>
                  </View>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  previewWrap: {
    height: 640,
    borderRadius: Radius.lg,
    overflow: "hidden",
    backgroundColor: Colors.muted,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  dim: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.18)" },

  guideWrap: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 100,
  },
  oval: {
    width: 250,
    height: 340,
    borderRadius: 170,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.92)",
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  sheet: { position: "absolute", left: 12, right: 12, bottom: 12 },

  previewTopBar: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  previewActions: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
  },

  busyOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  busyCard: {
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.60)",
    alignItems: "center",
    width: "78%",
  },
});
