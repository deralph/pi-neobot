import * as React from "react";
import { AppRegistry } from "react-native";
import { PaperProvider } from "react-native-paper";
import { expo } from "./app.json";
import Navigation from "./navigations";

export default function Main() {
  return (
    <PaperProvider>
      <Navigation />{" "}
    </PaperProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => Main);
