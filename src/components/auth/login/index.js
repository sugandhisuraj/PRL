import React, { useState, useCallback, useEffect, Fragment } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard
} from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
// import Toast from 'react-native-toast-message';

import { Colors, showToast } from "../../../../utils/tools";
import { login } from "../../../store/actions";
 

import {
  Root,
  TextInput,
  TouchableButton,
  AuthFooter,
  PasswordInput,
  PRLLogo,
} from "@component";
import { useKeyboardStatus, useLoader } from "@hooks";
import * as api from "../../../store/api";
import Styles from "./indexCss";
import { getHp } from "@utils";
import { CustomModalDropDown } from "@component";
import { usersCollection } from "../../../firebase";
import PlayPNG from "@assets/play.png";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CheckBox } from "react-native-elements";
import { Spinner } from 'native-base';
import { useBackHandler } from '@react-native-community/hooks';
import { validateEmail } from "../../../app/utils/validation";

const LoginModel = {
  email: "",
  password: "",
  setData: function (key, data) {
    this[key] = data;
    return { ...this };
  },
  getData: function () {
    return { email: this.email.toLowerCase(), password: this.password };
  },
  isDisabled: function () {
    return !(this.email.length > 0 && this.password.length > 0);
  },
  resetForm: function () {
    this.email = "";
    this.password = "";
    return { ...this };
  },
};
let ErrorModel = {
  email: "",
  password: "",
  setErrors: function (key, data) {
    this[key] = data;
    return { ...this };
  },
  resetError: function () {
    this.email = "";
    this.password = "";
    return { ...this };
  },
};

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isKeyboardOpen = useKeyboardStatus();
  const [loginForm, setLoginForm] = useState(LoginModel);
  const [error, setError] = useState(ErrorModel);
  const [isLoading, setIsLoading] = useState(false);
  const [accept, setAccept] = useState(false);
  let isError = false;
  const isFocused = useIsFocused();
  const [checked, setChecked] = useState(false)

  useBackHandler(() => {
    if (isLoading) {
      return true;
    }
    return false;
  });
  const initialFunc = async () => {
    let user = { USEREMAIL: "", USERPASSWORD: "" }
    user.USEREMAIL = await AsyncStorage.getItem("UserEmail")
    user.USERPASSWORD = await AsyncStorage.getItem("UserPassword")
    console.log("ASYNC EMAIL PASSWORD :", user.USEREMAIL, user.USERPASSWORD)
    if (user.USEREMAIL == null || user.USERPASSWORD == null) {
      setLoginForm(loginForm.setData("email", ""));
      setLoginForm(loginForm.setData("password", ""));
      setChecked(false)
    }

    else if (user.USEREMAIL.length > 0 || user.USERPASSWORD.length > 0) {
      setLoginForm(loginForm.setData("email", user.USEREMAIL));
      setLoginForm(loginForm.setData("password", user.USERPASSWORD));
      setChecked(true)
    } else {
      setLoginForm(loginForm.setData("email", ""));
      setLoginForm(loginForm.setData("password", ""));
      setChecked(false)
    }

  }
  useEffect(() => {
    if (isFocused) {
      setAccept(i => false);
      initialFunc()
      // setLoginForm(loginForm.resetForm());
      setError(error.resetError());
    }
  }, [isFocused]);

  const handleSubmit = async () => {
    Keyboard.dismiss();
    if (checked) {
      await AsyncStorage.setItem("UserEmail", loginForm.email.toLowerCase());
      await AsyncStorage.setItem("UserPassword", loginForm.password);
    } else {
      await AsyncStorage.removeItem("UserEmail");
      await AsyncStorage.removeItem("UserPassword");
    }

    if (!validateEmail(loginForm.email)) {
      setError(error.setErrors("email", "Invalid Email!"));
      isError = true;
    }
    if (loginForm.password.length < 6) {
      setError(error.setErrors("password", "Password min lenght should be 6!"));
      isError = true;
    }
    if (isError) {
      return;
    }
    setIsLoading(true);
    try {
      const loginResponse = await api.login(loginForm.getData());
      const userColResponse = await usersCollection
        .doc(loginResponse.user.uid)
        .get();
      let userResData = userColResponse.data();
      if (!userResData) {
        throw new Error("Invalid Credentianls");
      }
      let loginRes = { ...loginResponse, userCol: userResData };
      console.log("LOGIN_RESPONSE - ", JSON.stringify(loginRes));

      await AsyncStorage.setItem("userInfo", JSON.stringify(loginRes));
      setTimeout(async () => {
        await dispatch(login(loginRes));
      }, 1000);
    } catch (error) {
      console.log("LOGIN_ERROR - ", error);
      setIsLoading(false);
      return Alert.alert("Message", `Invalid Credentials`);
    }
  };

  const RenderExtras = ({ title, routeName = undefined }) => {
    return (
      <View style={Styles.renderExtrasContainer}>
        <Text style={Styles.renderExtrasHeading}>{title}</Text>
        <TouchableOpacity
          onPress={() => {
            setLoginForm(loginForm.resetForm());
            setError(error.resetError());
            navigation.navigate(routeName);
          }}
        >
          <Text style={Styles.clickHereText}> Click here</Text>
        </TouchableOpacity>
      </View>
    );
  };
  const RenderError = ({ error }) => {
    return (
      <View style={Styles.errorContainer}>
        <Text style={Styles.errorTextStyle}>{error}</Text>
      </View>
    );
  };
  const handleCheck = () => {
    console.log("loginForm.email", loginForm.email)
    if (loginForm.email.length > 0 && loginForm.password.length > 0) {
      setChecked(!checked)
    }
    else {
      Alert.alert("Message", "Enter Credentials!")
    }
  }
  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <KeyboardAwareScrollView
        contentContainerStyle={Styles.container}
        keyboardShouldPersistTaps={"always"}
      // keyboardDismissMode={"on-drag"}
      >
        <PRLLogo
          containerStyle={Styles.imageBoxContainer}
          imgStyle={Styles.logoStyle}
        />

        <View style={Styles.formContainer}>
          <Text style={Styles.formHeadingText}>Login To Your Account</Text>

          <TextInput
            editable={!isLoading}
            containerStyle={Styles.inputContainerStyle}
            placeholder={"E-mail"}
            value={loginForm.email}
            onChangeText={(email) => {
              if (error.email.length > 0) {
                setError(error.setErrors("email", ""));
              }
              setLoginForm(loginForm.setData("email", email));
            }}
          />
          {error.email.length > 0 && <RenderError error={error.email} />}
          <PasswordInput
            disabled={isLoading}
            containerStyle={Styles.inputContainerStyle}
            placeholder={"Password"}
            onChangeText={(password) => {
              if (error.password.length > 0) {
                setError(error.setErrors("password", ""));
              }
              setLoginForm(loginForm.setData("password", password));
            }}
            value={loginForm.password}
          />
          {error.password.length > 0 && <RenderError error={error.password} />}

          {
            isLoading == true ?
              <View style={{ marginTop: 30 }}>
                <Spinner color={'grey'} size={'large'} />
              </View>
              : <Fragment>
                <View style={Styles.checkboxContainer}>
                  <CheckBox
                    checked={checked}
                    color={"#0B214D"}
                    style={Styles.CheckboxStyle}
                    onPress={() => {
                      Keyboard.dismiss();
                      handleCheck();
                    }}
                  />
                  <Text style={Styles.label}>Remember the credentials?</Text>
                </View>
                <TouchableButton
                  containerStyle={[
                    { marginBottom: getHp(20), marginTop: getHp(0) },
                  ]}
                  type={"redBig"}
                  title={"Login"}
                  onPress={handleSubmit}
                  disabled={loginForm.isDisabled()}
                />
                <RenderExtras title={"Register?"} routeName={"RegisterPageNew"} />
                <RenderExtras
                  title={"Forgot Password?"}
                  routeName={"ResetPasswordScreen"}
                />
              </Fragment>
          }
        </View>
      </KeyboardAwareScrollView>
      {isLoading == false && !isKeyboardOpen && <AuthFooter />}
    </Root>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#fff",
  },
  container: {
    padding: 50,
    alignItems: "center",
  },
  inputStyle: {
    fontSize: 15,
    color: Colors.blue,
  },
  inputContainerStyle: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.gold,
  },
  logo: {
    width: "100%",
    height: 150,
  },
});

export default LoginScreen;
