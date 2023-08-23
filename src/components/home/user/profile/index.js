import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import Modal from 'react-native-loading-spinner-overlay';
import { useSelector, connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';

import {
    playerEventProfileCollection, usersCollection,
} from '../../../../firebase';
import {
    Root,
    Header,
    SingleHeading,
    PlayerProfileShowcase,
    ProfileQuestionInput,
    ImageVideoPlaceholder,
    TouchableButton
} from '@component';
import { useLoader, useFirebaseUpload } from '@hooks';
import Styles from './indexCss';
import ProfileModel from './Profile.model';
import Entypo from 'react-native-vector-icons/Entypo';
import { useAdsBanner } from '@hooks';

Entypo.loadFont();
Feather.loadFont();
const Profile = (props) => {
    const formsRef = useRef({
        photo: useRef(),
        video: useRef()
    });
    const isFocus = useIsFocused();
    const [setLoader, LoaderComponent] = useLoader();
    //const { auth } = useSelector(state => state);
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileModel, setProfileModel] = useState(ProfileModel);
    const { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
    const { firebaseAllCollectionData, auth } = useSelector(s => s);
    const [
        renderAdsBanner,
        BannerAdsComponent
    ] = useAdsBanner(auth);
    const {
        userID,
        eventID,
        event = {},
        allEvents = [],
        onBackPress = null
    } = props.route.params;
    console.log('PROFILE_TEST_HERE_USER_ID - ', userID);
    console.log('PROFILE_TEST_HERE_EVENT_ID - ', eventID);
    const loadProfileData = async () => {
        const profileData = await playerEventProfileCollection.where('eventID', '==', eventID).get();
        const charitiesData = [...firebaseAllCollectionData.firebaseCollectionData.charityData];
        const eventsData = [...firebaseAllCollectionData.firebaseCollectionData.eventsData];
        const userData = await usersCollection.get();

        return setProfileModel(
            profileModel.loadContents(
                profileData,
                charitiesData,
                eventsData,
                userID,
                userData));

    }
    useEffect(() => {
        setProfileModel(profileModel.updates([{ 'loading': true, isAllActionDone: false }]));
        loadProfileData();
    }, [eventID,userID]); //userID, 

    const RenderProfile = () => {
        return (
            <View style={Styles.profileContainer}>
                <ImageVideoPlaceholder
                    ref={formsRef.current.photo}
                    mode={'view'}
                    type={'photo'}
                    viewURI={auth.userCol?.userAvatar}
                    containerStyle={Styles.profileImgContainer}
                    imageStyle={Styles.profileImgContainer} />
                <View style={Styles.profileInfoContainer}>
                    <Text style={Styles.userEmailTextStyle}>{auth.userCol?.userName || ''}</Text>
                    {/* <Text style={Styles.userIdTextStyle}>@{auth.userCol?.userNickname || ''}</Text> */}
                </View>
            </View>
        );
    }

    const saveData = async (saveContentForEditField) => {
        try {
            let updateDataFirebaseRes = await playerEventProfileCollection.doc(saveContentForEditField.id).update(saveContentForEditField.data);
            setTimeout(async () => {
                let getUpdatedTuple = await playerEventProfileCollection.doc(saveContentForEditField.id).get();
                setProfileModel(profileModel.switchEditMode('UPDATE_TUPLE', getUpdatedTuple));
                setLoader(false);
            }, 500);
        } catch (error) {
            throw new Error(error);
        }

    }
    const handleEditSaveProfile = async () => {
        try {
            setLoader(true);
            let saveContentForEditField = profileModel.getEditedFields();
            console.log('EDIT_PLAYER_PROFILE - ', JSON.stringify(saveContentForEditField));

            if (saveContentForEditField.data.profilePlayerPicture?.includes("file:/")) {
                const pictureBlob = await convertToBlob(
                    saveContentForEditField.data.profilePlayerPicture,
                    "profilePlayerPicture/"
                );
                uploadBlobToFirebase(pictureBlob)
                    .then(async (profilePlayerPictureURL) => {
                        saveContentForEditField.data.profilePlayerPicture = profilePlayerPictureURL;

                        if (saveContentForEditField.data.profileVideo?.includes("file:/")) {
                            const videoBlob = await convertToBlob(
                                saveContentForEditField.data.profileVideo,
                                "profileVideo/"
                            );
                            return uploadBlobToFirebase(videoBlob);
                        } else {
                            return await saveData(saveContentForEditField);
                        }
                    })
                    .then(async (profileVideoURL) => {
                        saveContentForEditField.data.profileVideo = profileVideoURL;
                        return await saveData(saveContentForEditField);
                    })
                    .catch(error => { throw new Error(error) });
            }
            else if (saveContentForEditField.data.profileVideo?.includes("file:/")) {
                const videoBlob = await convertToBlob(
                    saveContentForEditField.data.profileVideo,
                    "profileVideo/"
                );
                uploadBlobToFirebase(videoBlob).then(async (profilePlayerPictureURLURL) => {
                    saveContentForEditField.data.profileVideo = profilePlayerPictureURLURL;
                    return await saveData(saveContentForEditField);
                })
                    .catch(error => { throw new Error(error) });;
            }
            else {
                return await saveData(saveContentForEditField);
            }
        } catch (error) {
            console.log('handleEditSaveProfile_error - ', error);
            setLoader(false);
            setTimeout(() => {
                Alert.alert('Message', 'Something went wrong!');
            }, 300);
        }
    }

    const RenderNoCurrentProfileAvailable = () => {
        return (
            <Text style={Styles.noSignupEventText}>
                Oops, You didn't signup for any event yet!
            </Text>
        );
    }
     
    return (
        <Root childViewStyle={Styles.childViewStyle}>
            <LoaderComponent />
            <Modal visible={profileModel.loading} />
            <ScrollView
                contentContainerStyle={Styles.container}
                keyboardShouldPersistTaps={'always'}
                keyboardDismissMode={'interactive'}>
                <Header
                    hideMenu
                    heading={"Profile"}
                    menuOnPress={() => props.navigation.openDrawer()}
                    leftOnPress={() => {
                        if (onBackPress) {
                            return onBackPress();
                        }
                        return props.navigation.goBack();
                    }}
                    RightComponent={RenderProfile}
                />



                <SingleHeading
                    placeholder={profileModel.showSpecificProfile == true &&
                        profileModel.isSpecificProfileFound == false ? null : profileModel.getCurrentProfileData().eventName}
                    containerStyle={Styles.headingCommonContainerStyle}
                />
                <PlayerProfileShowcase
                    //hideLeft={profileModel.showOnlyCurrentLoggedInProfile}
                    //hideRight={profileModel.showOnlyCurrentLoggedInProfile}
                    name={profileModel.getCurrentProfileData().name}
                    nickName={profileModel.getCurrentProfileData().nickName}
                    charity={profileModel.getCurrentProfileData().charity}
                    eventName={profileModel.getCurrentProfileData().eventName}
                    userAvatar={profileModel.getCurrentProfileData().userAvatar}
                    onLeftPress={() => setProfileModel(profileModel.switchIndex('-'))}
                    onRightPress={() => setProfileModel(profileModel.switchIndex('+'))}
                    viewDisableContent={{
                        render: profileModel.loading == false && profileModel.isCurrentUserFind == true
                            ? false : true,
                        content: profileModel.isAllActionDone == false ? null : 'Profile not found for this Player'
                    }}
                // disabledRight = {profileModel.getCurrentProfileData().disabledRight}
                // disabledLeft = {profileModel.getCurrentProfileData().disabledLeft}
                />


                {
                    profileModel.loading == false && profileModel.isCurrentUserFind == true
                        ? <Fragment>
                            <SingleHeading
                                textColor={'white'}
                                placeholder={'Player Profile'}
                                onRightComponent={() => {
                                    if (auth.userCol.userType == 'admin') {
                                        return <TouchableOpacity onPress={() => setProfileModel(profileModel.switchEditMode(true))}>
                                            <Entypo name={'edit'} color={'white'} size={23} />
                                        </TouchableOpacity>
                                    }
                                    else if (!profileModel.getIsCurrentUser(auth.userId)) {
                                        return null;
                                    }
                                    else if (profileModel.editMode) {
                                        return null;
                                    }
                                    return <TouchableOpacity onPress={() => setProfileModel(profileModel.switchEditMode(true))}>
                                        <Entypo name={'edit'} color={'white'} size={23} />
                                    </TouchableOpacity>
                                }}
                                containerStyle={[Styles.headingCommonContainerStyle, Styles.headingPlayerProfileContainer]}
                            />

                            <View style={Styles.playerProfileContainer}>
                                <ProfileQuestionInput
                                    placeholder={'Profile Answer 1'}
                                    question={profileModel.getCurrentProfileData().profileQ1Label}
                                    value={profileModel.editMode ? profileModel.editFields.profileA1 : profileModel.getCurrentProfileData().profileA1}
                                    editable={profileModel.editMode && profileModel.getCurrentProfileData().profileQ1Label.length > 0}
                                    onChangeText={(profileA1) => {
                                        setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA1', profileA1));
                                    }}

                                />
                                <ProfileQuestionInput
                                    placeholder={'Profile Answer 2'}
                                    question={profileModel.getCurrentProfileData().profileQ2Label}
                                    value={profileModel.editMode ? profileModel.editFields.profileA2 : profileModel.getCurrentProfileData().profileA2}
                                    editable={profileModel.editMode && profileModel.getCurrentProfileData().profileQ2Label.length > 0}
                                    onChangeText={(profileA2) => {
                                        setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA2', profileA2));
                                    }}
                                />
                                <ProfileQuestionInput
                                    placeholder={'Profile Answer 3'}
                                    question={profileModel.getCurrentProfileData().profileQ3Label}
                                    value={profileModel.editMode ? profileModel.editFields.profileA3 : profileModel.getCurrentProfileData().profileA3}
                                    editable={profileModel.editMode && profileModel.getCurrentProfileData().profileQ3Label.length > 0}
                                    onChangeText={(profileA3) => {
                                        setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA3', profileA3));
                                    }}
                                />
                                <ProfileQuestionInput
                                    placeholder={'Profile Answer 4'}
                                    question={profileModel.getCurrentProfileData().profileQ4Label}
                                    value={profileModel.editMode ? profileModel.editFields.profileA4 : profileModel.getCurrentProfileData().profileA4}
                                    editable={profileModel.editMode && profileModel.getCurrentProfileData().profileQ4Label.length > 0}
                                    onChangeText={(profileA4) => {
                                        setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA4', profileA4));
                                    }}
                                />

                                <View style={Styles.imageVideoPlaceHolderContainer}>

                                    <View style={Styles.photoLabelContainer}>
                                        <Text style={Styles.labelTextStyle}>
                                            {
                                                profileModel.getCurrentProfileData().profileImageQ
                                            }
                                        </Text>
                                        <ImageVideoPlaceholder
                                            ref={formsRef.current.photo}
                                            renderText={profileModel.editMode ? "Upload Profile Player Picture" : ""}
                                            type={"photo"}
                                            containerStyle={Styles.photoContainer}
                                            imageStyle={Styles.photoContainer}
                                            mode={profileModel.editMode ? "select" : "view"}
                                            viewURI={profileModel.editMode ? profileModel.editFields.profilePlayerPicture :
                                                profileModel.getCurrentProfileData().profilePlayerPicture}
                                            resetViewURI={() => {
                                                setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profilePlayerPicture', null));
                                            }}
                                            selectedData={(photo) =>
                                                setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profilePlayerPicture', photo))
                                            }
                                            renderChildren={profileModel.editMode ? false : profileModel.getCurrentProfileData().profilePlayerPicture.length == 0 ? true : false}
                                            disabledOnPress={profileModel.editMode ? false : profileModel.getCurrentProfileData().profilePlayerPicture.length == 0 ? true : false}
                                        >
                                            {
                                                profileModel.editMode ?
                                                    <Text style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>Upload Profile Player Picture</Text> :
                                                    profileModel.getCurrentProfileData().profilePlayerPicture.length == 0 ?
                                                        <Text style={{ fontWeight: 'bold', color: '#000', textAlign: 'center' }}>No Player Profile Picture</Text> :
                                                        null
                                            }
                                        </ImageVideoPlaceholder>
                                    </View>

                                    <View style={[Styles.photoLabelContainer]}>
                                        <Text style={Styles.labelTextStyle}>
                                            {
                                                profileModel.getCurrentProfileData().profileVideoQ
                                            }
                                        </Text>
                                        <ImageVideoPlaceholder
                                            ref={formsRef.current.video}
                                            renderText={profileModel.editMode ? "Upload Profile Player Video" : ""}
                                            type={"video"}
                                            containerStyle={Styles.photoContainer}
                                            mode={profileModel.editMode ? "select" : "view"}
                                            viewURI={profileModel.editMode ? null :
                                                profileModel.getCurrentProfileData().profileVideo}
                                            // viewURI={profileModel.getCurrentProfileData().profileVideo}
                                            renderChildren={!profileModel.editMode}
                                            wantThumbnail={false}
                                            resetViewURI={() => {
                                                setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileVideo', null));
                                            }}
                                            selectedData={(video) =>
                                                setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileVideo', video))
                                            }
                                            renderChildren={true}
                                            disabledOnPress={profileModel.editMode ? false : profileModel.getCurrentProfileData().profileVideo.length == 0 ? true : false}

                                        >
                                            {
                                                profileModel.editMode ?
                                                    <Feather name='play' color='#FFF' size={30} /> :
                                                    profileModel.getCurrentProfileData().profileVideo.length == 0 ?
                                                        <Text style={{ fontWeight: 'bold', color: '#000' }}>No Video</Text> :
                                                        <Feather name='play' color='#FFF' size={30} />
                                            }
                                        </ImageVideoPlaceholder>
                                    </View>

                                </View>
                                <View style={{ marginVertical: 15 }} />
                            </View>


                            {
                                profileModel.getIsCurrentUser(auth.userId)
                                    || auth.userCol.userType == 'admin' ?
                                    <View style={[Styles.bottomButtonsTray]}>
                                        {
                                            !profileModel.editMode &&
                                            <TouchableButton
                                                type={"small"}
                                                backgroundColor={"#EC2939"}
                                                title={"Edit"}
                                                onPress={() => {
                                                    setProfileModel(profileModel.switchEditMode(true));
                                                }}
                                            />
                                        }
                                        {
                                            profileModel.editMode &&
                                            <View style={Styles.editActiveModePlate}>
                                                <TouchableButton
                                                    type={"small"}
                                                    backgroundColor={"#EC2939"}
                                                    title={"Save"}
                                                    onPress={handleEditSaveProfile}
                                                />
                                                <TouchableButton
                                                    type={"small"}
                                                    backgroundColor={"#EDCF80"}
                                                    title={"Clear"}
                                                    onPress={() => {
                                                        formsRef.current.photo.current.reset();
                                                        formsRef.current.video.current.reset();
                                                        setProfileModel(profileModel.switchEditMode('CLEAR'));
                                                    }}
                                                />
                                                <TouchableButton
                                                    type={"small"}
                                                    backgroundColor={"#0B214D"}
                                                    title={"Cancel"}
                                                    onPress={() => {
                                                        setProfileModel(profileModel.switchEditMode(false));
                                                    }}
                                                />
                                            </View>
                                        }

                                    </View> : null}
                        </Fragment> : null
                }
            </ScrollView>
            <BannerAdsComponent />
        </Root>
    );
}

export default connect()(Profile);

/*
{
                        profileModel.getIsCurrentUser(auth.userId) &&
                        <View style={Styles.bottomButtonsTray}>
                            <TouchableButton
                                type={"small"}
                                backgroundColor={"#EC2939"}
                                title={"Edit"}
                            />
                            {/* <TouchableButton

                            type={"small"}
                            backgroundColor={"#EDCF80"}
                            title={"Clear"}
                        />
                        <TouchableButton
                            type={"small"}
                            backgroundColor={"#0B214D"}
                            title={"Cancel"}
                        /> }
                        </View>}

                         useEffect(() => {
        console.log('PROPS_CONTENT_GET - ', props.route.params);
        if (props.route.params?.specificProfile) {
            if (profileModel.loading == false && profileModel.playerEventProfile.length > 0) {
                setProfileModel(profileModel.specificProfileLoad(props.route.params.userId, props.route.params.eventId, true, false));
            }
        } else if (props.route.params?.currentUserAllProfiles) {
            if (profileModel.loading == false && profileModel.playerEventProfile.length > 0) {
                setProfileModel(profileModel.specificProfileLoad(null, null, false, true));
            }
        } else {
            if (profileModel.loading == false && profileModel.playerEventProfile.length > 0) {
                setProfileModel(profileModel.specificProfileLoad(0, 0, false));
            }
        }
    }, [props.route.params]);

     useEffect(() => {
        console.log('IN_FIRST_USE_EFFECT - ', props.route.params)
        if (props.route.params?.specificProfile) {
            loadProfileData(
                true,
                false,
                props.route.params?.userId,
                props.route.params?.eventId,
            )
            return;
        } else if (props.route.params?.currentUserAllProfiles) {
            loadProfileData(
                false,
                true,
            )
            return;
        }
        loadProfileData();
    }, [])
*/