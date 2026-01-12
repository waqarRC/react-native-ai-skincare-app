import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { BottomTabBarButtonProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { HomeScreen } from "../screens/HomeScreen";
import { ScanScreen } from "../screens/ScanScreen";
import { RoutineScreen } from "../screens/RoutineScreen";
import { ProductsScreen } from "../screens/ProductsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { Colors } from "../theme/colors";
import { Palette } from "../theme/palette";

export type TabsParamList = {
  Home: undefined;
  Scan: undefined;
  Routine: undefined;
  Products: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

function ScanTabButton(props: BottomTabBarButtonProps) {
  const { onPress, accessibilityState } = props;
  const selected = !!accessibilityState?.selected;

  return (
    <View style={styles.scanWrap}>
      <Pressable
        // Pass the event through exactly as RN expects
        onPress={onPress}
        style={({ pressed }) => [
          styles.scanBtn,
          {
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.92 : 1,
            borderColor: selected
              ? Palette.primary
              : "rgba(255,255,255,0.85)",
          },
        ]}
      >
        <Ionicons name="scan" size={26} color="#fff" />
        <Text style={styles.scanText}>Scan</Text>
      </Pressable>
    </View>
  );
}



export function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Palette.primary,
        tabBarInactiveTintColor: "rgba(11,18,32,0.5)",
        tabBarStyle: {
          height: 78,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopColor: Palette.border,
          backgroundColor: "#fff",
        },

        tabBarIcon: ({ color, size, focused }) => {
          if (route.name === "Scan") return null;

          const iconName =
            route.name === "Home"
              ? focused
                ? "home"
                : "home-outline"
              : route.name === "Routine"
              ? focused
                ? "list"
                : "list-outline"
              : route.name === "Products"
              ? focused
                ? "bag"
                : "bag-outline"
              : route.name === "Profile"
              ? focused
                ? "person"
                : "person-outline"
              : "ellipse";

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
       <Tab.Screen name="Routine" component={RoutineScreen} />
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarButton: (props) => <ScanTabButton {...props} />,
          tabBarLabel: "",
        }}
      />
     
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  scanWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  scanBtn: {
    width: 60,
    height: 60,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    shadowColor: "rgba(0,0,0,0.22)",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  scanText: {
    marginTop: 2,
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
  },
});
