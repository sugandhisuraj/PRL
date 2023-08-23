import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, Image, ScrollView, Text, TouchableOpacity, Alert } from 'react-native';
// import Loader from 'react-native-loading-spinner-overlay';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
import { useDispatch, useSelector, connect } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
// import Toast from 'react-native-toast-message';
import { updateUserColData } from '../../store/actions';
import { usersCollection } from '../../firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Root, PRLLogo, TextInput, Header, TouchableButton, AuthFooter, ImageVideoPlaceholder, CollapsibleViewWithHeading } from '@component';
import { useKeyboardStatus, useLoader, useFirebaseUpload, usePermissions } from '@hooks';
import { getHp, getWp } from '@utils';

import * as api from '../../store/api';
import Styles from './indexCss';
import SettingModal from './setting.modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { transformFirebaseValues } from "@utils";
import { Switch } from 'native-base';

import { openSettings, RESULTS  } from 'react-native-permissions';

const UserSetting = ({ navigation }) => {
  var { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  const createdUserData = useSelector(state => state.profile.createdUserData);
  const dispatch = useDispatch();
  let {
    auth,
    firebaseAllCollectionData: { isReady, loading, error },
  } = useSelector((state) => state);
  const isScreenFocused = useIsFocused(); 
  const [settingModal, setSettingModal] = useState(SettingModal);
  const [setLoader, LoaderComponent] = useLoader();
  const { permissions, permissionAccessibility, requestPermission } = usePermissions();
  
  const formsRef = useRef({
    image: useRef()
  });

  let saveSettingDataToFirebase = async (firebaseData) => {
    try {
      const updateProfileResponse = await usersCollection.doc(firebaseData.id).update(firebaseData.data);
      let newAuthReduxData = {
        ...auth,
        userCol: {
          ...auth.userCol,
          ...firebaseData.data
        }
      };
      await AsyncStorage.setItem("userInfo", JSON.stringify(newAuthReduxData));
      dispatch(updateUserColData(newAuthReduxData.userCol));
      setLoader(false);
      setTimeout(() => {
        return Alert.alert('Message', 'Profile Successfully Updated!', [
          {
            text: 'Okay',
            onPress: () => {
              navigation.navigate('Home', {
                screen: 'HomeScreen'
              })
            }
          }
        ]);
      }, 500);
    } catch (error) {
      console.log('saveSettingDataToFirebase - ', error);
      throw new Error(error);
    }
  }
  const handleSubmit = async () => {
    try {
      setLoader(true);
      let firebaseSaveData = settingModal.saveToFirebase();
      console.log('JSON_STRING - ', JSON.stringify(firebaseSaveData));

      if (firebaseSaveData?.data?.userAvatar?.includes("file:/")) {
        const userAvatarBlob = await convertToBlob(firebaseSaveData.data.userAvatar, 'profileImages/');
        uploadBlobToFirebase(userAvatarBlob)
          .then((userAvatarURL) => {
            firebaseSaveData.data.userAvatar = userAvatarURL;
            return saveSettingDataToFirebase(firebaseSaveData);
          });

      } else {
        return saveSettingDataToFirebase(firebaseSaveData);
      }
    } catch (error) {
      console.log("UPDATE_PROFILE_ERROR - ", error);
      setLoader(false);
      setTimeout(() => {
        Alert.alert("Message", "Something went wrong!");
      }, 200);
    }
  };

  useEffect(() => {
    if (isScreenFocused) {
      setSettingModal(settingModal.init(auth.userCol));
    }
  }, [isScreenFocused]);

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
        style={{ maxHeight: '100%' }}
      // keyboardShouldPersistTaps={'always'}
      // keyboardDismissMode={'on-drag'}
      >
        <Header
          hideMenu
          heading={"Profile Setting"}
          menuOnPress={() => navigation.openDrawer()}
          leftOnPress={() => navigation.goBack()}
        />
        <View style={Styles.imageBoxContainer}>
          <PRLLogo imgStyle={Styles.logoImgStyle} />
        </View>
        <View style={Styles.formContainer}>
          <Text style={Styles.formHeadingText}>Update your Profile</Text>

          <TextInput
            textContentType={"name"}
            autoCompleteType={"name"}
            containerStyle={Styles.inputContainerStyle}
            placeholder={"Enter Name*"}
            value={settingModal.editField.userName}
            onChangeText={userName => {
              setSettingModal(settingModal.updateEditFields('userName', userName));
            }}

          />

          <TextInput
            textContentType={"nickname"}
            autoCompleteType={"name"}
            containerStyle={Styles.inputContainerStyle}
            placeholder={"Enter Nick Name "}
            value={settingModal.editField.userNickname}
            onChangeText={userNickname => {
              setSettingModal(settingModal.updateEditFields('userNickname', userNickname));
            }}
          />

          <TextInput
            textContentType={"telephoneNumber"}
            autoCompleteType={"cc-number"}
            containerStyle={Styles.inputContainerStyle}
            placeholder={"Enter Cell Phone Number*"}
            value={settingModal.editField.userCellPhone}
            onChangeText={userCellPhone => {
              setSettingModal(settingModal.updateEditFields("userCellPhone", userCellPhone));
            }}
          />
          {/* <ImageVideoPlaceholder
            ref={formsRef.current.image}
            containerStyle={Styles.avatarContainerStyle}
            imageStyle={Styles.avatarImageStyle}
            type={'photo'}
            viewUri={profileModel.userAvatar}
            renderText={'Add Picture/Avatar'}
            selectedData={userAvatar => {
              setProfileModel(profileModel.update("userAvatar", userAvatar));
            }}
            // resetViewURI={() => {
            //   setProfileModel(profileModel.update("userAvatar", ''));
            // }}
          /> */}
          <ImageVideoPlaceholder
            renderText={'Upload Profile Picture'}
            ref={formsRef.current.image}
            edit={true}
            selectedData={userAvatar => {
              setSettingModal(settingModal.updateEditFields("userAvatar", userAvatar));
            }}
            viewURI={settingModal.editField.userAvatar}
            type={"photo"}
            mode={"select"}
            containerStyle={Styles.avatarContainerStyle}
            imageStyle={Styles.avatarImageStyle}
            resetViewURI={() => setSettingModal(settingModal.updateEditFields("userAvatar", ''))}
            renderChildren={false}
          ></ImageVideoPlaceholder>

          <View style={Styles.permissionContainer}>
            <CollapsibleViewWithHeading
              defaultCollapseValue={false}
              heading={"Permissions"}
              // collapseStyle={{ minHeight: getHp(300) }}
              headingContainerStyle={{
                justifyContent: 'space-between',
                width: '85%'
              }}
            >
              {
                permissionAccessibility.map((acc, index) => {
                  return <View style={Styles.singlePermissionContainer}>
                    <Switch
                      value={acc.value === RESULTS.GRANTED}
                      disabled={(acc.value !== RESULTS.DENIED)}
                      style={Styles.switchStyle}
                      onValueChange={() => requestPermission(index)}
                      trackColor={{ true: `#0B214D` }}
                    />

                    <Text style={Styles.permissionTextStyle}>{acc.title}</Text>
                  </View>
                })
              }
              <Text>
                You can update your permissions in device settings.
              </Text>
              <View style={{width: '100%', alignItems: 'flex-end', marginTop: 10}}>
                <TouchableOpacity 
                  onPress={openSettings}
                  style={{
                    width: 120,
                    height: 36,
                    borderRadius: 3,
                    backgroundColor: 'blue',
                    justifyContent: 'center',
                    alignItems:'center'
                  }}>
                  <Text style={{color: 'white'}}>
                    Open Settings
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: getHp(30) }} />
            </CollapsibleViewWithHeading>
          </View>
          <View style={Styles.bottomButtonsTray}>
            <TouchableButton
              //disabled={settingModal.shouldDisableUpdate()}
              type={"small"}
              backgroundColor={"#EC2939"}
              title={"Save"}
              onPress={handleSubmit}
            />
            <TouchableButton
              type={"small"}
              backgroundColor={"#EDCF80"}
              title={"Reset"}
              onPress={() => {
                setSettingModal(settingModal.init(auth.userCol));
              }}
            />
            <TouchableButton
              type={"small"}
              backgroundColor={"#0B214D"}
              title={"Cancel"}
              onPress={() => {
                navigation.navigate('HomeScreen')

              }}
            />
          </View>

        </View>
        <View style={{ height: getHp(100) }} />
      </KeyboardAwareScrollView>

      {/* {!isKeyboardOpen && <AuthFooter />} */}
    </Root>
  );
}

export default connect()(UserSetting);