import React, { Fragment } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

const MyWrapper = Platform.select({
  ios: SafeAreaView,
  android: View,
});

const RootComponent = ({
  children,
  headerColor,
  footerColor,
  barStyle,
  childViewStyle = {},
}) => {
  const setBarStyle =
    barStyle === "dark"
      ? "dark-content"
      : barStyle === "light"
      ? "light-content"
      : "default";
  return (
    <Fragment>
      <StatusBar barStyle={setBarStyle} />
      <MyWrapper
        style={[
          style.customStatusBar,
          headerColor && { backgroundColor: headerColor },
        ]}
      />
      <SafeAreaView
        style={[
          style.body,
          childViewStyle,
          footerColor && { backgroundColor: footerColor },
        ]}
      >
        {children}
      </SafeAreaView>
    </Fragment>
  );
};

const style = StyleSheet.create({
  customStatusBar: {
    flex: 0,
    backgroundColor: "#F8F8F8",
  },
  body: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
});
export default RootComponent;
