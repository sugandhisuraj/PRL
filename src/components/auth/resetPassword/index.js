// External Imports
import React, { useState, useCallback, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import styles from "./indexCss";
import { Button } from "native-base";
import { firebase } from "@PRLFirebase";
import { useDispatch, useSelector } from "react-redux";
import { Root, TextInput, PRLLogo } from "@component";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ResetData = {
  email: "",
  setData: function (key, data) {
    this[key] = data;
    return { ...this };
  },
  getData: function () {
    return { email: this.email };
  },
  isDisabled: function () {
    return !(this.email.length > 0);
  },
  resetForm: function () {
    this.email = "";
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

function ResetPassword({ navigation }) {
  const [ResetForm, setResetForm] = useState(ResetData);
  const [error, setError] = useState(ErrorModel);
  const dispatch = useDispatch();

  const handleReset = async () => {
    try {
      var auth = firebase.auth();
      var emailAddress = ResetForm.email;
      auth
        .sendPasswordResetEmail(emailAddress)
        .then(() => {
          Alert.alert(
            "Message",
            `Reset password link has been sent to ${emailAddress} !`,
            [
              {
                text: "Ok",
                onPress: () => {
                  navigation.navigate("LoginScreen");
                },
              },
            ]
          );
        })
        .catch(function (error) {
          console.log(error);
 
          Alert.alert("Message", `Incorrect Email Id`, [
            {
              text: "Ok",
              onPress: () => {
                setResetForm(ResetForm.setData("email", ''));
                //navigation.navigate("LoginScreen");
              },
 
            },
          ]);
        });
    } catch (error) { }
  };

  return (
    <Root>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        style={{
          flex: 1,
          height: '100%',
          width: '100%',
          backgroundColor: '#FFF',
        }}
      >
        <View style={{ alignItems: "center" }}>
          <PRLLogo
            containerStyle={styles.imageBoxContainer}
            imgStyle={styles.logoStyle}
          />
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                textAlign: "center",
                paddingHorizontal: 40,
                paddingVertical: 20,
                color: 'black'
              }}
            >
              Enter your email address below to reset your password
            </Text>
          </View>
          <View style={{ width: "80%", paddingBottom: 40, paddingTop: 10 }}>
            <TextInput

              placeholder={"E-mail"}
              value={ResetForm.email}
              onChangeText={(email) => {
                if (error.email.length > 0) {
                  setError(error.setErrors("email", ""));
                }
                setResetForm(ResetForm.setData("email", email));
              }}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Button
                disabled={ResetForm.isDisabled()}
                style={[
                  styles.SubmitButton,
                  {
                    marginRight: 25,
                    backgroundColor: ResetForm.isDisabled()
                      ? "#E6E6E6"
                      : "#EC2939",
                  },
                ]}
                onPress={() => handleReset()}
              >
                <Text style={[styles.SubmitButtonView, { marginLeft: 25 }]}>
                  Submit{" "}
                </Text>
              </Button>
            </View>

            <View>
              <Button
                style={[styles.CancelButton, { marginLeft: 25 }]}
                onPress={() => {
                  setResetForm(ResetForm.resetForm());
                  navigation.navigate("LoginScreen");
                }}
              >
                <Text style={[styles.CancelButtonView, { marginLeft: 25 }]}>
                  Cancel
                </Text>
              </Button>
            </View>
          </View>

          <View style={{ paddingTop: 40, paddingHorizontal: 40 }}>
            <Text style={{ fontWeight: "normal", textAlign: "center", color: 'black' }}>
              A password reset email has been sent on the registered email
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </Root>
  );
}

export default ResetPassword;
