import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import Loader from "react-native-loading-spinner-overlay";
import { useDispatch } from "react-redux";
// import Toast from 'react-native-toast-message';
import {
  AuthFooter,
  PasswordInput,
  PRLLogo,
  Root,
  TextInput,
  TouchableButton,
  WebViewModal,
} from "@component";
import { useKeyboardStatus } from "@hooks";
import { CheckBox } from "native-base";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect, useSelector } from "react-redux";
import { createdNewProfile } from "../../../store/actions";
import * as api from "../../../store/api";
import Styles from "./indexCss";

const RegisterModel = {
  email: "",
  password: "",
  confirmPassword: "",
  setData: function (key, data) {
    this[key] = data;
    return { ...this };
  },
  getData: function () {
    return { email: this.email.toLowerCase(), password: this.password };
  },
  isDisabled: function () {
    return !(
      this.email.length > 0 &&
      this.password.length > 0 &&
      this.confirmPassword.length > 0
    );
  },
  resetForm: function () {
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    return { ...this };
  },
};
let ErrorModel = {
  email: "",
  password: "",
  confirmPassword: "",
  setErrors: function (key, data) {
    this[key] = data;
    return { ...this };
  },
  resetError: function () {
    this.email = "";
    this.password = "";
    this.confirmPassword = "";
    return { ...this };
  },
};
const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isKeyboardOpen = useKeyboardStatus();
  const [registerForm, setRegisterForm] = useState({ ...RegisterModel });
  const [error, setError] = useState(ErrorModel);
  const [loader, setLoader] = useState(false);
  const [accept, setAccept] = useState(false);
  const [tcHTML, setTcHTML] = useState(false);
  const [ppHTML, setPpHTML] = useState(false);
  const appInfoState = useSelector((state) => state.appInfoData.appInfoData);
  const handleSubmit = async () => {
    try {
      const upperCaseRegEx = new RegExp(/[A-Z]+/);
      const lowerCaseRegEx = new RegExp(/[a-z]+/);
      const numberRegEx = new RegExp(/[0-9]+/);
      const charRegEx = new RegExp(/[!@#$%a^&*()-_+=.,;:'"`~]+/);
      let errorObj;
      let isError = false;
      if (!registerForm.email.validateEmail()) {
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            registerForm.email
          )
        ) {
          isError = true;
          errorObj = error.setErrors("email", "Invalid Email!");
        }
      }
      if (
        registerForm.password.length < 6 &&
        lowerCaseRegEx.test(registerForm.password) &&
        numberRegEx.test(registerForm.password) &&
        upperCaseRegEx.test(registerForm.password) &&
        charRegEx.test(registerForm.password)
      ) {
        Alert.alert(
          "Password should have One special character, one digit, one capital text"
        );
        isError = true;
        errorObj = error.setErrors(
          "password",
          "Password min lenght should be 6!"
        );
      }
      if (registerForm.password != registerForm.confirmPassword) {
        isError = true;
        errorObj = error.setErrors(
          "confirmPassword",
          "Password should be matched!"
        );
      }
      if (isError) {
        setError(errorObj);
        return;
      }
      if (!accept) {
        return Alert.alert(
          "Message",
          "Please read accept Terms and Conditions"
        );
      }
      setLoader(true);
      const values = await api.registerUser(registerForm.getData());
      console.log("REGISTER_VALUES - ", JSON.stringify(values));
      await dispatch(createdNewProfile(values.user));
      setLoader(false);
      setTimeout(() => {
        Alert.alert("Message", "User Successfully Registered!", [
          {
            text: "Okay",
            onPress: () => navigation.navigate("CreateInitialProfileScreen"),
          },
        ]);
        //await dispatch(registerUser(values));
        //navigation.navigate("Main");
      }, 100);
    } catch (error) {
      console.log("REGISTER_ERROR - ", error);
      setLoader(false);
      setTimeout(() => {
        Alert.alert("Message", "Invalid Credentials!");
      }, 200);
    }
  };
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setAccept((i) => false);
      setError(error.resetError());
      setRegisterForm(registerForm.resetForm());
    }
  }, [isFocused]);

  const RenderExtras = ({ title, content }) => {
    return (
      <View style={Styles.renderExtrasContainer}>
        <Text style={Styles.renderExtrasHeading}>{title}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
          <Text style={Styles.clickHereText}> {content}</Text>
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
  const RenderTermsConditions = () => {
    return (
      <View style={Styles.termsConditionContainer}>
        <CheckBox checked={accept} onPress={() => setAccept((i) => !i)} />
        <Text style={Styles.privacyPolicyStyle}>
          {`I accept the `}
          <TouchableOpacity onPress={() => setTcHTML((i) => !i)}>
            <Text
              style={Styles.privactyTouchTextStyle}
            >{`Terms and Conditions`}</Text>
          </TouchableOpacity>
          {`\nand `}
          <TouchableOpacity onPress={() => setPpHTML((i) => !i)}>
            <Text
              style={Styles.privactyTouchTextStyle}
            >{`Privacy Policy`}</Text>
          </TouchableOpacity>
        </Text>
      </View>
    );
  };
  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <Loader visible={loader} />
      <KeyboardAwareScrollView
        contentContainerStyle={Styles.container}
        // keyboardShouldPersistTaps={'always'}
        // keyboardDismissMode={'on-drag'}
      >
        <View style={Styles.imageBoxContainer}>
          <PRLLogo
            containerStyle={Styles.imageBoxContainer}
            imgStyle={Styles.logoStyle}
          />
        </View>
        <View style={Styles.formContainer}>
          <Text style={Styles.formHeadingText}>Create an Account</Text>
          <TextInput
            containerStyle={Styles.inputContainerStyle}
            placeholder={"E-mail"}
            value={registerForm.email}
            onChangeText={(email) => {
              if (error.email.length > 0) {
                setError(error.setErrors("email", ""));
              }
              setRegisterForm(registerForm.setData("email", email));
            }}
          />
          {error.email.length > 0 && <RenderError error={error.email} />}
          <PasswordInput
            containerStyle={Styles.inputContainerStyle}
            placeholder={"Password"}
            onChangeText={(password) => {
              if (error.password.length > 0) {
                setError(error.setErrors("password", ""));
              }
              setRegisterForm(registerForm.setData("password", password));
            }}
            value={registerForm.password}
          />
          {error.password.length > 0 && <RenderError error={error.password} />}
          <PasswordInput
            containerStyle={Styles.inputContainerStyle}
            placeholder={"Confirm Password"}
            onChangeText={(confirmPassword) => {
              if (error.confirmPassword.length > 0) {
                setError(error.setErrors("confirmPassword", ""));
              }
              setRegisterForm(
                registerForm.setData("confirmPassword", confirmPassword)
              );
            }}
            value={registerForm.confirmPassword}
          />
          <RenderTermsConditions />
          {error.confirmPassword.length > 0 && (
            <RenderError error={error.confirmPassword} />
          )}
          <TouchableButton
            containerStyle={Styles.inputContainerStyle}
            type={"redBig"}
            title={"Sign up"}
            onPress={handleSubmit}
            disabled={registerForm.isDisabled()}
          />
          <RenderExtras title={"Already have an account?"} content={"Login"} />
        </View>
      </KeyboardAwareScrollView>
      {!isKeyboardOpen && <AuthFooter />}
      <WebViewModal
        modalVisible={tcHTML}
        onClose={() => setTcHTML((i) => !i)}
        html={appInfoState["htmlTermsOfUse"]}
      />
      <WebViewModal
        modalVisible={ppHTML}
        onClose={() => setPpHTML((i) => !i)}
        html={appInfoState["htmlPrivacyPolicy"]}
      />
    </Root>
  );
};

export default connect()(AuthScreen);
