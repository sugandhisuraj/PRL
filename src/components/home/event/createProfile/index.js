import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import {
    Header,
    Root,
    TextInput,
    ImageVideoPlaceholder,
    DateInput,
    CustomModalDropDown,
    SingleHeadingDropdown,
    DoubleHeadingDropdown,
    TextAreaInput,
    TouchableButton,
    DoubleHeading,
    TextAreaHeading,
    StaticEventImageHeader,
    TripleHeading,
    SingleHeading,
    CreateEventProgress
} from '@component';
import { useLoader, useFirebaseUpload } from '@hooks';
import Styles from './indexCss';
import {
    eventProfileQuestionsCollection
} from '../../../../firebase';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import { useDispatch, useSelector, connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign';
import CreateProfileModel from './Profile.model';
import {
    getFromToDate
} from '@utils';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
AntDesign.loadFont();

const CreateEventProfileScreen = (props) => {

    const [counter, setCounter] = useState(0);
    const [setLoader, LoaderComponent] = useLoader();
    const [isEditMode, setIsEditMode] = useState(true);
    const [createProfileModel, setCreateProfileModel] = useState(CreateProfileModel);
    const {
        convertToBlob,
        uploadBlobToFirebase
    } = useFirebaseUpload();
    const dispatch = useDispatch();
    const eventModalProps = useSelector(state => state.event.eventModel);
    const setEventModel = newEventModel => { dispatch(updateEventModel(newEventModel)); }

    useEffect(() => {
        setCounter(c => c + 1);
    }, [eventModalProps]);

    const saveEventProfile = (shouldSave = true) => {
        if (!shouldSave) {
            return props.navigation.navigate('EventStack', {
                screen: 'EventFeesScreen',
                params: {
                    clearProfileModal: clearHandler,
                    saveProfile: createEventProfileHandler
                }
            });
        }
        let isFormValid = createProfileModel.isFormValid();
        if (isFormValid.error) {
            return Alert.alert('Message', isFormValid.value);
        }
        props.navigation.navigate('EventStack', {
            screen: 'EventFeesScreen',
            params: {
                clearProfileModal: clearHandler,
                saveProfile: createEventProfileHandler
            }
        });
    }
    const createEventProfileHandler = async () => {
        return new Promise(async (resolve, reject) => {
            try {
                const createProfileData = createProfileModel.getFirebaseData({ eventID: eventModalProps.EventFormFields.eventID });
                const saveEventProfileData = await eventProfileQuestionsCollection.add(createProfileData);
                return resolve(saveEventProfileData);
            } catch (error) {
                console.log("CONTEST_CREATE_HANDLER - ", error);
                console.log(error);
                setTimeout(() => {
                    Alert.alert('Message', 'Error While Creating Event Profile');
                    return reject(error);
                }, 400);
            }
        });

    }
    const clearHandler = () => {
        setCreateProfileModel(createProfileModel.resetCreateProfileForm());
    }
    const RenderQuestionLabel = ({ text = 'Question' }) => {
        return (
            <Text style={Styles.questionLabelStyle}>
                {text}
            </Text>
        )
    }
    return (
        <Root childViewStyle={Styles.childViewStyle}>
            <LoaderComponent />
            <KeyboardAwareScrollView
                contentContainerStyle={Styles.container}
                keyboardShouldPersistTaps={'always'}
            // keyboardDismissMode={'interactive'}
            >
                <Header
                    hideMenu
                    heading={"Create Event - Player Profiles"}
                    menuOnPress={() => props.navigation.openDrawer()}
                    leftOnPress={() => props.navigation.goBack()}
                />

                {/* <StaticEventImageHeader
                    eventImageURI={eventModalProps.eventLogo}
                    eventName={eventModalProps.eventName}
                    date={getFromToDate(eventModalProps.eventDate, eventModalProps.eventDateEnd)}
                    charity={eventModalProps.selectedCharityData.charityName || ''}
                    containerStyle={Styles.staticEventImageContainerStyle}
                /> */}

                {/* <TripleHeading
                    left={eventModalProps?.eventCategory || ''}
                    center={eventModalProps?.eventGenre || ''}
                    right={eventModalProps.eventSubCategory || ''}
                    containerStyle={Styles.tripleHeadingContainer}
                /> */}
                {/* <TextAreaInput
                    editable={false}
                    textInputStyle={Styles.eventDescriptionTextStyle}
                    placeholder={"Event Description"}
                    value={eventModalProps.eventDescription}

                /> */}
                {/* <SingleHeading
                    containerStyle={Styles.createProfileContainer}
                    placeholder={'Create Player Profile Questions for your Event'}
                /> */}
                <View style={Styles.questionsInputContainer}>
                    <RenderQuestionLabel text={'Question 1'} />
                    <TextInput
                        placeholder={'Type Question Here...'}
                        value={createProfileModel.profileQ1Label}
                        onChangeText={profileQ1Label => setCreateProfileModel(createProfileModel.update('profileQ1Label', profileQ1Label))}
                    />
                    <RenderQuestionLabel text={'Question 2'} />
                    <TextInput
                        placeholder={'Type Question Here...'}
                        containerStyle={Styles.questionInputCommonTextStyle}
                        value={createProfileModel.profileQ2Label}
                        onChangeText={profileQ2Label => setCreateProfileModel(createProfileModel.update('profileQ2Label', profileQ2Label))}
                    />
                    <RenderQuestionLabel text={'Question 3'} />
                    <TextInput
                        placeholder={'Type Question Here...'}
                        containerStyle={Styles.questionInputCommonTextStyle}
                        value={createProfileModel.profileQ3Label}
                        onChangeText={profileQ3Label => setCreateProfileModel(createProfileModel.update('profileQ3Label', profileQ3Label))}
                    />
                    <RenderQuestionLabel text={'Question 4'} />
                    <TextInput
                        placeholder={'Type Question Here...'}
                        containerStyle={Styles.questionInputCommonTextStyle}
                        value={createProfileModel.profileQ4Label}
                        onChangeText={profileQ4Label => setCreateProfileModel(createProfileModel.update('profileQ4Label', profileQ4Label))}
                    />
                    <RenderQuestionLabel text={'Import Photo'} />
                    <TextInput
                        placeholder={'Import Photo Here'}
                        containerStyle={Styles.questionInputCommonTextStyle}
                        value={createProfileModel.profileImageQ}
                        onChangeText={profileImageQ => setCreateProfileModel(createProfileModel.update('profileImageQ', profileImageQ))}
                    />
                    <RenderQuestionLabel text={'Import Video'} />
                    <TextInput
                        placeholder={'Import Video Here'}
                        containerStyle={Styles.questionInputCommonTextStyle}
                        value={createProfileModel.profileVideoQ}
                        onChangeText={profileVideoQ => setCreateProfileModel(createProfileModel.update('profileVideoQ', profileVideoQ))}
                    />
                </View>

                <TouchableButton
                    type={"redBig"}
                    title={"Skip"}
                    onPress={() => saveEventProfile(false)}
                    containerStyle={Styles.skipContainerStyle}
                    titleStyle={{ fontSize: FONTSIZE.Text16 }}
                    propButtonStyle={{ height: getHp(40) }}
                />

                <View style={Styles.bottomButtonsTray}>
                    <TouchableButton
                        type={"prevStep"}
                        title={"Previous Step"}
                        onPress={() => props.navigation.goBack()}
 
                    />
                    <View style={{ width: getWp(20) }} />
                    <TouchableButton
                        type={"nextStep"}
                        title={"Next Step"}
                        onPress={() => saveEventProfile(true)}
                        titleStyle={{ fontSize: FONTSIZE.Text16 }}
                    />


                </View>
                <CreateEventProgress
                    containerStyle={{ marginTop: getHp(25), marginBottom: getHp(40) }}
                    selectedIndex={3}
                />
            </KeyboardAwareScrollView>
        </Root>
    );
}

export default connect()(CreateEventProfileScreen); 