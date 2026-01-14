import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View, Alert, Image, Pressable, Platform, ScrollView } from "react-native";
import { Screen } from "../components/ui/Screen";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { buildExportPayload, exportScanHistoryPDF, exportFullReportPDF } from "../utils/exportScans";


import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Notifications from "expo-notifications";

import { Colors } from "../theme/colors";
import { Type } from "../theme/typography";
import { Card } from "../components/Card";
import { AppButton } from "../components/AppButton";
import { Badge } from "../components/Badge";
import { useScanStore } from "../store/scanStore";
import type { RootStackParamList } from "../app/AppNavigator";
import { Spacing } from "../theme/spacing";

type Nav = NativeStackNavigationProp<RootStackParamList>;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // new NotificationBehavior fields (shouldShowBanner / shouldShowList)
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function ProfileScreen() {
  const navigation = useNavigation<Nav>();

  const latest = useScanStore((s) => s.latest);
  const history = useScanStore((s) => s.history);

  const clearAll = useScanStore((s) => s.clearAll);
  const removeScan = useScanStore((s) => s.removeScan);
  const [includeThumbs, setIncludeThumbs] = useState(false);
  const reminderEnabled = useScanStore((s) => s.reminderEnabled);
  const reminderNotificationId = useScanStore((s) => s.reminderNotificationId);
  const setReminder = useScanStore((s) => s.setReminder);

  const confirmClearAll = () => {
    Alert.alert(
      "Clear saved scans?",
      "This will remove your latest scan and scan history from this device.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: clearAll },
      ]
    );
  };

  const openScan = (item: any) => {
  navigation.navigate("Results", {
    ...item
  });
};

  const confirmDeleteOne = (id: string) => {
    Alert.alert("Delete this scan?", "This will remove it from your history.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => removeScan(id) },
    ]);
  };

  const exportHistory = useCallback(async () => {
    try {
      if (history.length === 0) {
        Alert.alert("Nothing to export", "Scan history is empty.");
        return;
      }

      const payload = {
        exportedAt: new Date().toISOString(),
        count: history.length,
        latest,
        history,
      };

      const fileUri = FileSystem.documentDirectory + `ai-skincare-scan-history-${Date.now()}.json`;
      await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(payload, null, 2), {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (!canShare) {
        Alert.alert("Sharing not available", `Saved file at:\n${fileUri}`);
        return;
      }

      await Sharing.shareAsync(fileUri, {
        mimeType: "application/json",
        dialogTitle: "Export Scan History",
        UTI: "public.json",
      });
    } catch (e: any) {
      Alert.alert("Export failed", e?.message ?? "Unknown error");
    }
  }, [history, latest]);

  const ensureNotificationPermissions = useCallback(async () => {
    const settings = await Notifications.getPermissionsAsync();
    if (settings.status === "granted") return true;

    const req = await Notifications.requestPermissionsAsync();
    return req.status === "granted";
  }, []);

  const ensureAndroidChannel = useCallback(async () => {
    if (Platform.OS !== "android") return;
    await Notifications.setNotificationChannelAsync("scan-reminders", {
      name: "Scan reminders",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }, []);

  const scheduleWeeklyReminder = useCallback(async () => {
    const ok = await ensureNotificationPermissions();
    if (!ok) {
      Alert.alert("Permission needed", "Enable notifications to receive reminders.");
      return;
    }

    await ensureAndroidChannel();

    // Cancel existing if any
    if (reminderNotificationId) {
      await Notifications.cancelScheduledNotificationAsync(reminderNotificationId);
    }

    // Schedule weekly: next occurrence at 9:00 AM local time (Expo uses device local)
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Weekly skin scan reminder",
        body: "Run a quick scan to keep your routine updated.",
        sound: false,
      },
      trigger: {
        weekday: 1, // Monday
        hour: 9,
        minute: 0,
        repeats: true,
        channelId: Platform.OS === "android" ? "scan-reminders" : undefined,
      } as any,
    });

    setReminder(true, id);
    Alert.alert("Reminder set", "You'll get a reminder every Monday at 9:00 AM.");
  }, [ensureNotificationPermissions, ensureAndroidChannel, reminderNotificationId, setReminder]);

  const cancelWeeklyReminder = useCallback(async () => {
    try {
      if (reminderNotificationId) {
        await Notifications.cancelScheduledNotificationAsync(reminderNotificationId);
      }
      setReminder(false, null);
      Alert.alert("Reminder cancelled", "Weekly reminders have been turned off.");
    } catch (e: any) {
      Alert.alert("Cancel failed", e?.message ?? "Unknown error");
    }
  }, [reminderNotificationId, setReminder]);

  const toggleReminder = useCallback(() => {
    if (reminderEnabled) cancelWeeklyReminder();
    else scheduleWeeklyReminder();
  }, [reminderEnabled, cancelWeeklyReminder, scheduleWeeklyReminder]);

  return (
    <Screen>
      <Header title="Profile" />

      <ScrollView contentContainerStyle={{ gap: 14, marginTop: 8, paddingBottom: Spacing.xl }} showsVerticalScrollIndicator={false}>
        {/* main content follows */}

        {/* Reminders */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Reminders</Text>
          <Text style={[Type.body, { color: Colors.textSecondary }]}>
            Get a weekly reminder to re-scan and keep your routine updated.
          </Text>

          <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
            <Badge kind={reminderEnabled ? "safe" : "caution"} label={reminderEnabled ? "Enabled" : "Disabled"} />
            {reminderEnabled && reminderNotificationId ? <Badge kind="premium" label="Scheduled" /> : null}
          </View>

          <AppButton
            title={reminderEnabled ? "Turn off weekly reminder" : "Turn on weekly reminder"}
            onPress={toggleReminder}
          />
        </Card>

        {/* Latest */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Latest scan</Text>

          {!latest ? (
            <Text style={[Type.body, { color: Colors.textSecondary }]}>No scan stored yet.</Text>
          ) : (
            <>
              <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
                <Badge kind="match" label={`${latest.skin_type} Skin`} />
                <Badge kind="safe" label={`${Math.round(latest.confidence_scores * 100)}% Confidence`} />
              </View>

              <Text style={[Type.cap, { color: Colors.textSecondary }]}>
                {new Date(latest.scannedAt).toLocaleString()}
              </Text>

              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    overflow: "hidden",
                    backgroundColor: "rgba(30,30,30,0.06)",
                    borderWidth: 1,
                    borderColor: Colors.border,
                  }}
                >
                  {latest.capturedUri ? (
                    <Image
                      source={{ uri: latest.capturedUri }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>

                <View style={{ flex: 1, justifyContent: "center", gap: 10 }}>
                  <AppButton title="View" onPress={() => openScan(latest)} />
                  <AppButton title="Clear all scans" variant="secondary" onPress={confirmClearAll} />
                </View>
              </View>
            </>
          )}
        </Card>

        {/* Export */}
        <Card style={{ gap: 10 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Export</Text>
          <Text style={[Type.body, { color: Colors.textSecondary }]}>
            Export your scan history as JSON, CSV, or PDF. Full Report includes routine + alerts.
          </Text>

          <Pressable
            onPress={() => setIncludeThumbs((p) => !p)}
            style={({ pressed }) => [{
              opacity: pressed ? 0.85 : 1,
              padding: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.border,
              backgroundColor: "#fff",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }]}
          >
            <Text style={[Type.sub, { color: Colors.textPrimary }]}>Include thumbnails in PDF (bigger file)</Text>
            <Badge kind={includeThumbs ? "safe" : "caution"} label={includeThumbs ? "ON" : "OFF"} />
          </Pressable>

        

         
          <AppButton
            title="Export PDF (History)"
            variant="secondary"
            onPress={async () => {
              try {
                const payload = await buildExportPayload(latest, history);
                await exportScanHistoryPDF(payload, { includeHistoryThumbs: includeThumbs });
              } catch (e: any) {
                Alert.alert("Export failed", e?.message ?? "Unknown error");
              }
            }}
          />

          {/* ✅ Full Report */}
          <AppButton
            title="Export Full Report (PDF)"
            onPress={async () => {
              try {
                const payload = await buildExportPayload(latest, history);

                // Use same routine arrays you use in RoutineScreen (you can import them or generate)
                // For now, simple placeholders:
                const routineAM = [
                  { step: "Cleanser", product: "Gentle Cleanser", match: 0.92, price: "$" },
                  { step: "Serum", product: "Niacinamide Serum", match: 0.95, price: "$$" },
                  { step: "Moisturizer", product: "Barrier Moisturizer", match: 0.9, price: "$$" },
                  { step: "Sunscreen", product: "SPF 50 Mineral", match: 0.93, price: "$$" },
                ];
                const routinePM = [
                  { step: "Cleanser", product: "Gentle Cleanser", match: 0.92, price: "$" },
                  { step: "Treatment", product: "Azelaic Acid", match: 0.89, price: "$$" },
                  { step: "Moisturizer", product: "Barrier Moisturizer", match: 0.9, price: "$$" },
                ];

                const alerts = [
                  { title: "Fragrance", severity: "caution", note: "Prefer fragrance-free if you experience irritation." },
                  { title: "Alcohol denat.", severity: "caution", note: "May be drying for some skin types." },
                  { title: "Ceramides", severity: "safe", note: "Supports barrier repair." },
                ] as const;

                await exportFullReportPDF(payload, {
                  includeHistoryThumbs: includeThumbs,
                  routineAM,
                  routinePM,
                  alerts: alerts as any,
                });
              } catch (e: any) {
                Alert.alert("Export failed", e?.message ?? "Unknown error");
              }
            }}
          />
        </Card>



        {/* History */}
        <Card style={{ gap: 12 }}>
          <Text style={[Type.h3, { color: Colors.textPrimary }]}>Scan history</Text>

          {history.length === 0 ? (
            <Text style={[Type.body, { color: Colors.textSecondary }]}>
              No history yet. Your next scans will appear here.
            </Text>
          ) : (
            <View style={{ gap: 10 }}>
              {history.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => openScan(item)}
                  onLongPress={() => confirmDeleteOne(item.id)} // ✅ long press delete
                  delayLongPress={350}
                  style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "center",
                      padding: 10,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: Colors.border,
                      backgroundColor: "#fff",
                    }}
                  >
                    <View
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        overflow: "hidden",
                        backgroundColor: "rgba(30,30,30,0.06)",
                        borderWidth: 1,
                        borderColor: Colors.border,
                      }}
                    >
                      {item.capturedUri ? (
                        <Image
                          source={{ uri: item.capturedUri }}
                          style={{ width: "100%", height: "100%" }}
                          resizeMode="cover"
                        />
                      ) : null}
                    </View>

                    <View style={{ flex: 1, gap: 6 }}>
                      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                        <Badge kind="match" label={item.skin_type} />
                        <Badge kind="safe" label={`${Math.round(item.confidence_scores * 100)}%`} />
                      </View>
                      <Text style={[Type.cap, { color: Colors.textSecondary }]}>
                        {new Date(item.scannedAt).toLocaleString()}
                      </Text>
                      <Text style={[Type.cap, { color: Colors.textSecondary }]}>
                        Long-press to delete
                      </Text>
                    </View>

                    <Text style={[Type.cap, { color: Colors.textSecondary }]}>View</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}
