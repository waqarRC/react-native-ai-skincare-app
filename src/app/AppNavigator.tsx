import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TabsNavigator } from "./TabsNavigator";

import { WelcomeScreen } from "../screens/WelcomeScreen";
import { GoalsScreen } from "../screens/GoalsScreen";
import { BudgetScreen } from "../screens/BudgetScreen";
import { ResultsScreen } from "../screens/ResultsScreen";
import { ProductsDetailScreen } from "../screens/ProductsDetailScreen";
import { CompareScreen } from "../screens/CompareScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Goals: undefined;
  Budget: undefined;
  MainTabs: undefined;
  Compare: undefined;
  Results: {
    skin_type: string;
    acne_level: string;
    oiliness: string;
    dryness: string;
    redness: string;
    dark_circles: string;
    fine_lines: string;
    pores: string;
    face_detected: any;
    confidence_scores: any;
    overall_skin_health: string;
    skincare_advice: string[];
    recommended_products: any;
    capturedUri?: string;
    faceCount?: number;
};

  ProductsDetail: { productId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Goals" component={GoalsScreen} />
        <Stack.Screen name="Budget" component={BudgetScreen} />
        <Stack.Screen name="MainTabs" component={TabsNavigator} />
        <Stack.Screen name="Compare" component={CompareScreen} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="ProductsDetail" component={ProductsDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
