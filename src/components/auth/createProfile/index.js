import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
// import Loader from 'react-native-loading-spinner-overlay';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';

import { usersCollection } from '../../../firebase';
import { Root, PRLLogo, TextInput, TouchableButton, AuthFooter, ImageVideoPlaceholder } from '@component';
import { useKeyboardStatus, useLoader, useFirebaseUpload } from '@hooks';
import * as api from '../../../store/api';
import Styles from './indexCss';
import ProfileModel from './Profile.model';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CreateProfileScreen = ({ navigation }) => {
    const createdUserData = useSelector(state => state.profile.createdUserData);
    const dispatch = useDispatch();
    const isKeyboardOpen = useKeyboardStatus();
    const [profileModel, setProfileModel] = useState(ProfileModel);
    const [setLoader, LoaderComponent] = useLoader();
    const {
        convertToBlob,
        uploadBlobToFirebase
    } = useFirebaseUpload();
    const formsRef = useRef({
        image: useRef()
    });
    const handleSubmit = async () => {
        try {
                // if(profileModel.userCellPhone.length <= 10 && 
                //     profileModel.userCellPhone.length >= 15)
                //     {
                //         Alert.alert('please enter valid Mobile number');  
                //     }
                    
            let validateFormResult = profileModel.validateForm();
            if (!validateFormResult.isValidate) {
                return Alert.alert('Message', validateFormResult.message);
            }
            setLoader(true);
            let profileData = profileModel.saveToFirebase();
            const pictureBlob = await convertToBlob(profileData.userAvatar, 'profileImages/');
            uploadBlobToFirebase(pictureBlob)
                .then(async (userAvatar) => {
                    profileData.userAvatar = userAvatar;
                    const updatedUserResponse = await usersCollection.doc(createdUserData.uid).update(profileData);
                    console.log("USER_PROFILE_UPDATED_SUCCESS - ", updatedUserResponse);
                    setLoader(false);
                    setTimeout(() => {
                        Alert.alert("Message", "Profile Successfully Created!", [
                            {
                                text: 'Okay',
                                onPress: () => navigation.navigate('LoginScreen')
                            }
                        ]);
                    }, 200);
                });
        } catch (error) {
            console.log("CREATE_PROFILE_ERROR - ", error);
            setLoader(false);
            setTimeout(() => {
                Alert.alert("Message", "Something went wrong!");
            }, 200);
        }

    }
    const isFocused = useIsFocused();

    useEffect(() => {
        if (isFocused) {
            setProfileModel(profileModel.reset());
        }
    }, [isFocused]);

    const RenderError = ({ error }) => {
        return (
            <View style={Styles.errorContainer}>
                <Text style={Styles.errorTextStyle}>{error}</Text>
            </View>
        );
    }

    return (
        <Root childViewStyle={Styles.childViewStyle}>
            <LoaderComponent />
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={Styles.container}
            // keyboardShouldPersistTaps={'always'}
            // keyboardDismissMode={'on-drag'}
            >
                <View style={Styles.imageBoxContainer}>
                    <PRLLogo imgStyle={Styles.logoImgStyle} />
                </View>
                <View style={Styles.formContainer}>
                    <Text style={Styles.formHeadingText}>Create Initial Profile</Text>

                    <TextInput
                        containerStyle={Styles.inputContainerStyle}
                        placeholder={"Enter Name*"}
                        value={profileModel.userName}
                        onChangeText={userName => {
                            setProfileModel(profileModel.update("userName", userName));
                        }}
                    />

                    <TextInput
                        containerStyle={Styles.inputContainerStyle}
                        placeholder={"Enter Nick Name "}
                        value={profileModel.userNickname}
                        onChangeText={userNickname => {
                            setProfileModel(profileModel.update("userNickname", userNickname));
                        }}
                    />

                    <TextInput
                        containerStyle={Styles.inputContainerStyle}
                        placeholder={"Enter Cell Phone Number*"}
                        value={profileModel.userCellPhone}
                        onChangeText={userCellPhone => {
                            setProfileModel(profileModel.update("userCellPhone", userCellPhone));
                        }}
                    />
                    <ImageVideoPlaceholder
                        ref={formsRef.current.image}
                        containerStyle={Styles.avatarContainerStyle}
                        imageStyle={Styles.avatarImageStyle}
                        type={'photo'}
                        renderText={'Add Picture/Avatar'}
                        selectedData={userAvatar => {
                            setProfileModel(profileModel.update("userAvatar", userAvatar));
                        }}
                        resetViewURI={() => {
                            setProfileModel(profileModel.update("userAvatar", ''));
                        }}
                    />
                    <View style={Styles.bottomButtonsTray}>
                        <TouchableButton
                            //disabled={!profileModel.isDisabled()}
                            type={"small"}
                            backgroundColor={"#EC2939"}
                            title={"Create"}
                            onPress={handleSubmit}
                        />
                        <TouchableButton
                            type={"small"}
                            backgroundColor={"#EDCF80"}
                            title={"Clear"}
                            onPress={() => {
                                formsRef.current.image.current.reset();
                                setProfileModel(profileModel.reset())
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

                </View>
            </KeyboardAwareScrollView>
            {!isKeyboardOpen && <AuthFooter />}
        </Root>
    );
}

export default CreateProfileScreen;