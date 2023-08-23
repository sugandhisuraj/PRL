import Toast from "react-native-toast-message";

export const Colors = {
  red: "#EC2939",
  blue: "#0B214D",
  gold: "#EDCF80",
  gray: "#949AB1",
  black: "#01080C",
  shadow: "#DCE4F9",
  white: "#FFFFFF",
};

export const showToast = (type, text1, text2) => {
  switch (type) {
    case "success":
      Toast.show({
        type: "success",
        text1,
        text2,
        position: "bottom",
        visibilityTime: 4000,
        bottomOffest: 50,
      });
      break;
    case "error":
      Toast.show({
        type: "error",
        text1,
        text2,
        position: "bottom",
        visibilityTime: 1000,
        bottomOffest: 50,
      });
      break;
    default:
      null;
  }
};
