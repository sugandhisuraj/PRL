import React, { Fragment, useState, useCallback, useEffect, useRef } from "react";
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
import ProfileModel from '../createProfile/Profile.model';
import { Colors, showToast } from "../../../../utils/tools";
import { login } from "../../../store/actions";
import { CheckBox } from 'native-base';
import { createdNewProfile } from '../../../store/actions'
import {
    Root,
    TextInput,
    TouchableButton,
    AuthFooter,
    PasswordInput,
    PRLLogoNew,
    ImageVideoPlaceholder,
    PRLLogo,
    WebViewModal,
    Header
} from "@component";
import { useKeyboardStatus, useLoader, useFirebaseUpload } from "@hooks";
import * as api from "../../../store/api";
import Styles from "./indexCss";
import { getHp } from "@utils";
import { CustomModalDropDown } from "@component";
import { usersCollection } from "../../../firebase";
import PlayPNG from "@assets/play.png";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator } from "react-native";
import { Spinner } from 'native-base';
import { useBackHandler } from '@react-native-community/hooks';

const RegisterModel = {
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
    userNickname: '',
    userCellPhone: '',
    userAvatar: '',
    setData: function (key, data) {
        this[key] = data;
        return { ...this };
    },
    getData: function () {
        return {
            email: this.email.toLowerCase(),
            password: this.password,
            userName: this.userName,
            userNickname: this.userNickname,
            userCellPhone: this.userCellPhone,
            userAvatar: this.userAvatar,
        };
    },
    isDisabled: function () {
        return !(this.email.length > 0 && this.password.length > 0 && this.confirmPassword.length > 0);
    },
    resetForm: function () {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        this.userName = '';
        this.userNickname = '';
        this.userCellPhone = '';
        this.userAvatar = '';
        return { ...this };
    }
}
let ErrorModel = {
    email: '',
    password: '',
    confirmPassword: '',
    setErrors: function (key, data) {
        this[key] = data;
        return { ...this };
    },
    resetError: function () {
        this.email = '';
        this.password = '';
        this.confirmPassword = '';
        return { ...this };
    },

}

const RegisterPageNew = ({ navigation }) => {
    const dispatch = useDispatch();
    const {
        convertToBlob,
        uploadBlobToFirebase
    } = useFirebaseUpload();
    const formsRef = useRef({
        image: useRef()
    });
    const [submitForm, setSubmitForm] = useState(false);
    const isKeyboardOpen = useKeyboardStatus();
    const [registerForm, setRegisterForm] = useState({ ...RegisterModel });
    const [error, setError] = useState(ErrorModel);
    // const [loader, setLoader] = useState(false);
    const [accept, setAccept] = useState(false);
    const [tcHTML, setTcHTML] = useState(false);
    const [ppHTML, setPpHTML] = useState(false);
    const [setLoader, LoaderComponent] = useLoader();
    const appInfoState = useSelector(state => state.appInfoData.appInfoData);
    const fcmData = useSelector(state => state.appInfoData);
    const upperCaseRegEx = new RegExp(/[A-Z]+/);
    const lowerCaseRegEx = new RegExp(/[a-z]+/);
    const numberRegEx = new RegExp(/[0-9]+/);
    const charRegEx = new RegExp(/[!@#$%a^&*()-_+=.,;:'"`~]+/);

    useBackHandler(() => {
        if (submitForm) {
            return true;
        }
        return false;
    });

    const saveToDb = async (createdUser) => {
        try {
            let fcmToken = '';
            // fcmToken: '',
            // isFcmGenerated:false
            if (fcmData?.isFcmGenerated) {
                fcmToken = fcmData.fcmToken;
            }
            const values = await api.registerUser({ ...createdUser, fcmToken });
            console.log("REGISTER_VALUES - ", JSON.stringify(values));
            //await dispatch(createdNewProfile(values.user));
            setTimeout(() => {
                // formsRef.current.image.current.reset();
                // setRegisterForm(registerForm.resetForm());
                setSubmitForm(false);
                setTimeout(() => {
                    Alert.alert('Message', 'User Successfully Registered!', [
                        {
                            text: 'Okay',
                            onPress: () => {
                                navigation.navigate('LoginScreen');
                            }
                        }
                    ]);
                }, 500);
            }, 500);
        } catch (error) {
            setSubmitForm(false);
            setTimeout(() => {
                return Alert.alert('Message', 'Email already registered!');
            }, 500);
        }
    }
    const handleSubmit = async () => {
        try {
            Keyboard.dismiss();
            let errorObj;
            let isError = false;
            if (registerForm.email.length == 0) {
                isError = true;
                errorObj = error.setErrors("email", "Enter Email!");
            }
            if (registerForm.email.length > 1 && !registerForm.email.validateEmail()) {
                isError = true;
                errorObj = error.setErrors("email", "Invalid Email!");
            }
            if (registerForm.password.length == 0) {
                isError = true;
                errorObj = error.setErrors("password", "Enter Password!");
            }
            if (registerForm.password.length > 0 && registerForm.password.length < 6) {
                isError = true;
                errorObj = error.setErrors("password", "Minimum Password Length should be 6!");
            }
            if (registerForm.confirmPassword.length == 0) {
                isError = true;
                errorObj = error.setErrors("confirmPassword", "Enter Confirm Password!");
            }
            if (registerForm.password != registerForm.confirmPassword) {
                isError = true;
                errorObj = error.setErrors("confirmPassword", "Password should be matched!");
            }
            // if (registerForm.password.length < 6 &&
            //     lowerCaseRegEx.test(registerForm.password) &&
            //     numberRegEx.test(registerForm.password) &&
            //     upperCaseRegEx.test(registerForm.password) &&
            //     charRegEx.test(registerForm.password)) {
            //     Alert.alert("Password should have One special character, one digit, one capital text");
            //     isError = true;
            //     errorObj = error.setErrors("password", "Password min lenght should be 6!");
            // }

            if (isError) {
                setError(errorObj);
                return;
            }
            if (!accept) {
                return Alert.alert('Message', 'Please accept Terms and Conditions');
            }
            setSubmitForm(true);
            const checkUserExist = await usersCollection.where('email', '==', registerForm.email.toLowerCase()).get();
            if (checkUserExist.size > 0) {
                setTimeout(() => {
                    setSubmitForm(false);
                    return Alert.alert('Message', 'Email already registered!');
                }, 500);
                return;
            }
            let saveData = registerForm.getData();
            if (saveData.userAvatar?.includes("file:/")) {
                const userAvatarBlob = await convertToBlob(saveData.userAvatar, 'profileImages/');
                uploadBlobToFirebase(userAvatarBlob)
                    .then(async (userAvatarURL) => {
                        saveData.userAvatar = userAvatarURL;
                        return saveToDb(saveData);
                    }).catch(error => {
                        console.log("REGISTER_ERROR - ", error);
                        setSubmitForm(false);
                        setTimeout(() => {
                            Alert.alert("Message", "Something went wrong!");
                        }, 500);
                    });
            } else {
                return saveToDb(saveData);
            }

        } catch (error) {
            console.log("REGISTER_ERROR - ", error);
            setSubmitForm(false);
            setTimeout(() => {
                Alert.alert("Message", "Something went wrong!");
            }, 500);

        }

    }
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            setAccept(i => false);
            setError(error.resetError());
            setSubmitForm(false);
            setRegisterForm(registerForm.resetForm());
            if (formsRef.current.image.current?.reset) {
                formsRef.current.image?.current.reset();
            }
        }
    }, [isFocused]);

    const RenderExtras = ({ title, content }) => {
        return (
            <TouchableOpacity style={Styles.renderExtrasContainer}
                disabled={submitForm}
                onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={Styles.renderExtrasHeading}>{title}</Text>

                <Text style={Styles.clickHereText}> {content}</Text>

            </TouchableOpacity>
        );
    }
    const RenderError = ({ error }) => {
        return (
            <View style={Styles.errorContainer}>
                <Text style={Styles.errorTextStyle}>{error}</Text>
            </View>
        );
    }
    const RenderTermsConditions = () => {
        return (
            <View style={Styles.termsConditionContainer}>
                <CheckBox
                    checked={accept}
                    onPress={() => {
                        Keyboard.dismiss();
                        if (submitForm) {
                            return;
                        }
                        setAccept(i => !i)
                    }}
                />
                <Text style={Styles.privacyPolicyStyle}>
                    {`I accept the `}
                    <TouchableOpacity
                        disabled={submitForm}
                        onPress={() => {
                            Keyboard.dismiss();
                            setTcHTML(i => !i)
                        }}>
                        <Text style={Styles.privactyTouchTextStyle}>{`Terms and Conditions`}</Text>
                    </TouchableOpacity>
                    {`\nand `}
                    <TouchableOpacity
                        disabled={submitForm}
                        onPress={() => {
                            Keyboard.dismiss();
                            setPpHTML(i => !i)
                        }}>
                        <Text style={Styles.privactyTouchTextStyle}>{`Privacy Policy`}</Text>
                    </TouchableOpacity>
                </Text>
            </View>
        );
    }
    return (
        <Root childViewStyle={Styles.childViewStyle}>
            {/* <LoaderComponent /> */}
            <View style={{ height: '92%' }}>
                <KeyboardAwareScrollView
                    style={Styles.container}
                    keyboardShouldPersistTaps={"always"}
                // keyboardDismissMode={"on-drag"}
                >
                    <Header
                        containerStyle={{ height: 20 }}
                        disableBack={submitForm}
                        hideMenu
                        heading={''}
                        leftOnPress={() => navigation.goBack()}
                    />
                    <PRLLogo
                        containerStyle={Styles.imageBoxContainer}
                        imgStyle={Styles.logoStyle}
                    />

                    <View style={Styles.formContainer}>
                        <Text style={Styles.formHeadingText}>Create an Account</Text>
                        <TextInput
                            editable={!submitForm}
                            containerStyle={Styles.inputContainerStyle}
                            placeholder={"E-mail*"}
                            value={registerForm.email}
                            onChangeText={email => {
                                if (error.email.length > 0) {
                                    setError(error.setErrors("email", ""));
                                }
                                setRegisterForm(registerForm.setData("email", email));

                            }}
                        />
                        {error.email.length > 0 && <RenderError error={error.email} />}
                        <TextInput
                            editable={!submitForm}
                            containerStyle={Styles.inputContainerStyle}
                            placeholder={"Enter Name"}
                            value={registerForm.userName}
                            onChangeText={userName => {
                                setRegisterForm(registerForm.setData("userName", userName));
                            }}
                        />

                        <TextInput
                            editable={!submitForm}
                            containerStyle={Styles.inputContainerStyle}
                            placeholder={"Enter Nick Name "}
                            value={registerForm.userNickname}
                            onChangeText={userNickname => {
                                setRegisterForm(registerForm.setData("userNickname", userNickname));
                            }}
                        />

                        <TextInput
                            editable={!submitForm}
                            containerStyle={Styles.inputContainerStyle}
                            placeholder={"Enter Cell Phone Number"}
                            value={registerForm.userCellPhone}
                            onChangeText={userCellPhone => {
                                setRegisterForm(registerForm.setData("userCellPhone", userCellPhone));
                            }}
                        />
                        <View style={{ alignItems: 'center', marginVertical: getHp(5) }}>
                            <ImageVideoPlaceholder
                                ref={formsRef.current.image}
                                containerStyle={Styles.avatarContainerStyle}
                                imageStyle={Styles.avatarImageStyle}
                                type={'photo'}
                                renderText={'Add Picture/Avatar'}
                                selectedData={userAvatar => {
                                    setRegisterForm(registerForm.setData("userAvatar", userAvatar));
                                }}
                                resetViewURI={() => {
                                    setRegisterForm(registerForm.setData("userAvatar", ''));
                                }}
                                disabledOnPress={submitForm}
                            />
                        </View>
                        <PasswordInput
                            disabled={submitForm}
                            containerStyle={Styles.inputContainerStyle}
                            placeholder={"Password*"}
                            onChangeText={password => {
                                if (error.password.length > 0) {
                                    setError(error.setErrors("password", ""));
                                }
                                setRegisterForm(registerForm.setData("password", password))
                            }}
                            value={registerForm.password}
                        />
                        {error.password.length > 0 && <RenderError error={error.password} />}
                        <PasswordInput
                            disabled={submitForm}
                            containerStyle={Styles.inputContainerStyle}
                            placeholder={"Confirm Password*"}
                            onChangeText={confirmPassword => {
                                if (error.confirmPassword.length > 0) {
                                    setError(error.setErrors("confirmPassword", ""));
                                }
                                setRegisterForm(registerForm.setData("confirmPassword", confirmPassword))
                            }}
                            value={registerForm.confirmPassword}
                        />
                        {error.confirmPassword.length > 0 && <RenderError error={error.confirmPassword} />}
                        <RenderTermsConditions />


                        {
                            submitForm == true ?
                                <View style={{ marginTop: 20 }}>
                                    <Spinner
                                        color={'grey'}
                                        size={'large'}
                                    />
                                </View>

                                : <Fragment><View style={Styles.bottomButtonTrayContainer}>
                                    <TouchableButton
                                        type={"small"}
                                        backgroundColor={"#EC2939"}
                                        title={"Sign Up"}
                                        onPress={handleSubmit}
                                    />
                                    <TouchableButton
                                        type={"small"}
                                        backgroundColor={"#EDCF80"}
                                        title={"Clear"}
                                        onPress={() => {
                                            formsRef.current.image.current.reset();
                                            setRegisterForm(registerForm.resetForm());
                                        }}
                                    />
                                    <TouchableButton
                                        type={"small"}
                                        backgroundColor={"#0B214D"}
                                        title={"Cancel"}
                                        onPress={() => {
                                            navigation.navigate('LoginScreen')

                                        }}
                                    />
                                </View>
                                </Fragment>
                        }

                    </View>

                    {
                        submitForm == true ? null : <RenderExtras title={"Already have an account?"} routeName={"LoginScreen"} />
                    }
                    <View style={{ height: 20 }} />
                </KeyboardAwareScrollView>
            </View>

            {submitForm == false && !isKeyboardOpen && <AuthFooter />}
            <WebViewModal
                modalVisible={tcHTML}
                onClose={() => setTcHTML(i => !i)}
                html={appInfoState['htmlTermsOfUse']}
            />
            <WebViewModal
                modalVisible={ppHTML}
                onClose={() => setPpHTML(i => !i)}
                html={appInfoState['htmlPrivacyPolicy']}
            />
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

export default RegisterPageNew;
