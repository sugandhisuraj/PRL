import React, { Fragment, useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Modal from 'react-native-loading-spinner-overlay';
import { useSelector, connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { useIsFocused } from '@react-navigation/native';

import {
    playerEventProfileCollection,
    userEnteredContestsCollection,
    usersCollection
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

Entypo.loadFont();
Feather.loadFont();
const Profile = (props) => {
    const formsRef = useRef({
        photo: useRef(),
        video: useRef()
    });
    const isFocus = useIsFocused();
    const [setLoader, LoaderComponent] = useLoader();
    const { auth } = useSelector(state => state);
    const [isEditMode, setIsEditMode] = useState(false);
    const [profileModel, setProfileModel] = useState(ProfileModel);
    const { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
    const { firebaseAllCollectionData } = useSelector(s => s);
    const {
        isCompetition
    } = props.route.params;
    console.log('AUTH_DATA_ON_CHECK_HERE_1 - ', JSON.stringify(auth));
    const loadProfileData = async () => {
        let profileData;
        let userCollectionData;
        if (isCompetition) {
            profileData = await playerEventProfileCollection.get();
            userCollectionData = await usersCollection.get();
        } else {
            profileData = await playerEventProfileCollection.where('userID', '==', auth.userId).get();
        }
        const userEnteredContest = await userEnteredContestsCollection.where('userID', '==', auth.userId).get();
        const charitiesData = [...firebaseAllCollectionData.firebaseCollectionData.charityData];
        const eventsData = [...firebaseAllCollectionData.firebaseCollectionData.eventsData];
        return setProfileModel(profileModel.loadContents(
            profileData,
            userEnteredContest,
            charitiesData,
            eventsData,
            auth.userId,
            isCompetition,
            userCollectionData,
            auth));
    }
    useEffect(() => {
        setProfileModel(profileModel.resetContents());
        loadProfileData();
    }, []);
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
                    heading={"Profile"}
                    menuOnPress={() => props.navigation.openDrawer()}
                    leftOnPress={() => props.navigation.goBack()}
                    RightComponent={RenderProfile}
                />

                {
                    !profileModel.loading &&
                        profileModel.currentLoggedInUserProfiles.length == 0
                        ?
                        <RenderNoCurrentProfileAvailable /> :
                        <Fragment>

                            <SingleHeading
                                placeholder={profileModel.getCurrentProfileData().eventName}
                                containerStyle={Styles.headingCommonContainerStyle}
                            />
                            <PlayerProfileShowcase
                                //hideLeft={profileModel.showOnlyCurrentLoggedInProfile}
                                //hideRight={profileModel.showOnlyCurrentLoggedInProfile}
                                name={profileModel.getCurrentProfileData().name}
                                userAvatar={profileModel.getCurrentProfileData().userAvatar}
                                nickName={profileModel.getCurrentProfileData().nickName}
                                charity={profileModel.getCurrentProfileData().charity}
                                eventName={profileModel.getCurrentProfileData().eventName}
                                onLeftPress={() => setProfileModel(profileModel.switchIndex('-'))}
                                onRightPress={() => setProfileModel(profileModel.switchIndex('+'))}
                                viewDisableContent={{
                                    render: false,
                                    content: 'Profile not found for this Player'
                                }}
                            // disabledRight = {profileModel.getCurrentProfileData().disabledRight}
                            // disabledLeft = {profileModel.getCurrentProfileData().disabledLeft}
                            />


                            <Fragment>
                                <SingleHeading
                                    textColor={'white'}
                                    placeholder={'Player Profile'}
                                    onRightComponent={() => {
                                        if (auth.userCol.userType == 'admin') {
                                            return <TouchableOpacity onPress={() => setProfileModel(profileModel.switchEditMode(true))}>
                                                <Entypo name={'edit'} color={'white'} size={23} />
                                            </TouchableOpacity>
                                        }
                                        else if (isCompetition) {
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
                                        editable={profileModel.editMode}
                                        onChangeText={(profileA1) => {
                                            setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA1', profileA1));
                                        }}

                                    />
                                    <ProfileQuestionInput
                                        placeholder={'Profile Answer 2'}
                                        question={profileModel.getCurrentProfileData().profileQ2Label}
                                        value={profileModel.editMode ? profileModel.editFields.profileA2 : profileModel.getCurrentProfileData().profileA2}
                                        editable={profileModel.editMode}
                                        onChangeText={(profileA2) => {
                                            setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA2', profileA2));
                                        }}
                                    />
                                    <ProfileQuestionInput
                                        placeholder={'Profile Answer 3'}
                                        question={profileModel.getCurrentProfileData().profileQ3Label}
                                        value={profileModel.editMode ? profileModel.editFields.profileA3 : profileModel.getCurrentProfileData().profileA3}
                                        editable={profileModel.editMode}
                                        onChangeText={(profileA3) => {
                                            setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA3', profileA3));
                                        }}
                                    />
                                    <ProfileQuestionInput
                                        placeholder={'Profile Answer 4'}
                                        question={profileModel.getCurrentProfileData().profileQ4Label}
                                        value={profileModel.editMode ? profileModel.editFields.profileA4 : profileModel.getCurrentProfileData().profileA4}
                                        editable={profileModel.editMode}
                                        onChangeText={(profileA4) => {
                                            setProfileModel(profileModel.switchEditMode('UPDATE_VAL', 'profileA4', profileA4));
                                        }}
                                    />

                                    <View style={Styles.imageVideoPlaceHolderContainer}>

                                        <View style={Styles.photoLabelContainer}>
                                            <Text style={Styles.labelTextStyle}>{profileModel.getCurrentProfileData().profileImageQ}</Text>
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
                                                renderChildren={!profileModel.editMode && profileModel.getCurrentProfileData().profilePlayerPicture.length == 0}
                                                disabledOnPress={!profileModel.editMode && profileModel.getCurrentProfileData().profilePlayerPicture.length == 0}
                                            >
                                                {
                                                    !profileModel.editMode &&
                                                        profileModel.getCurrentProfileData().profilePlayerPicture.length == 0 ?

                                                        <Text style={{ fontWeight: 'bold', color: '#000' }}>No Picture</Text> :
                                                        <Feather name='play' color='#FFF' size={30} />

                                                }
                                            </ImageVideoPlaceholder>
                                        </View>

                                        <View style={[Styles.photoLabelContainer]}>
                                            <Text style={Styles.labelTextStyle}>{profileModel.getCurrentProfileData().profileVideoQ}</Text>
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
                                                renderChildren
                                                disabledOnPress={!profileModel.editMode && profileModel.getCurrentProfileData().profileVideo.length == 0}
                                            >
                                                {
                                                    !profileModel.editMode &&
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
                                    isCompetition == false || 
                                    auth.userCol.userType == 'admin' ?
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

                            </Fragment>

                        </Fragment>
                }

            </ScrollView>
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
*/