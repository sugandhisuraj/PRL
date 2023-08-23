import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
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

} from '@component';
import { useLoader, useFirebaseUpload } from '@hooks';
import Styles from './indexCss';
import {
    contestScoringTypesCollection,
    contestTypesCollection
} from '../../../../firebase';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import { useDispatch, useSelector, connect } from 'react-redux'
import AntDesign from 'react-native-vector-icons/AntDesign';
import CreateContestModel from './CreateContest.model';
import {
    transformFirebaseValues,
    maxNumberArrOfObj
} from '@utils';
import {
    updateEventModel
} from '../../../../store/actions';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from 'react-native-vector-icons/Feather';

Feather.loadFont();
AntDesign.loadFont();

const CreateContestScreen = (props) => {
    const {
        fromEdit = false,
        newContestScreenModel,
        newContestScreenSetModel
    } = props.route.params;
    const eventModalProps = props.route.params?.eventModel || {};
    const dispatch = useDispatch();
    const { eventModel } = useSelector((state) => state.event);
    const setEventModel = (newEventModel) => {
        dispatch(updateEventModel(newEventModel));
    };

    const [setLoader, LoaderComponent] = useLoader();
    const [isEditMode, setIsEditMode] = useState(true);
    const [createContestModel, setCreateContestModel] = useState(CreateContestModel);
    const {
        convertToBlob,
        uploadBlobToFirebase
    } = useFirebaseUpload();
    const formRefs = useRef({
        contestLogo: useRef(),
        contestPhoto: useRef(),
        contestVideo: useRef(),
        scoringType: useRef()
    });

    const loadData = async () => {
        const contestScoringTypes = await contestScoringTypesCollection.get();
        const contestTypes = await contestTypesCollection.get();
        setCreateContestModel(createContestModel.loadContents(contestScoringTypes, contestTypes));

    }

    useEffect(() => {
        console.log("MOUNTED_CREATE_CONTEST");
        loadData();
    }, []);

    const createHandler = async () => {
        try {
            let formValidate = createContestModel.checkIsFormFill();

            if (formValidate.error) {
                return Alert.alert('Message', formValidate.value);
            }
            setLoader(true);
            let uploadContestToFirebase = createContestModel.saveContestData();
            const logoBlob = await convertToBlob(createContestModel.contestTypeLogo, 'events&contestsImages/');
            const pictureBlob = await convertToBlob(createContestModel.contestTypePhoto, 'events&contestsImages/');
            const videoBlob = await convertToBlob(createContestModel.contestTypeVideo, 'events&contestsVideos/');
            uploadBlobToFirebase(logoBlob)
                .then((contestTypeLogo) => {
                    uploadContestToFirebase.contestTypeLogo = contestTypeLogo;
                    return uploadBlobToFirebase(pictureBlob);
                })
                .then((contestTypePhoto) => {
                    uploadContestToFirebase.contestTypePhoto = contestTypePhoto;
                    return (uploadBlobToFirebase(videoBlob));
                })
                .then((contestTypeVideo) => {
                    uploadContestToFirebase.contestTypeVideo = contestTypeVideo;
                    setTimeout(async () => {
                        console.log("CREATE_CONTEST_POST - ", JSON.stringify(uploadContestToFirebase));
                        const saveContest = await contestTypesCollection.add(uploadContestToFirebase);
                        if (!fromEdit) {
                            setEventModel(eventModel.updateContestTypeWhenContestAdded({ ...uploadContestToFirebase, id: saveContest.id }));
                        }
                        else {
                            let newContestTypeAdded = {
                                    ...uploadContestToFirebase, 
                                    id: saveContest.id,
                                    value: uploadContestToFirebase.contestType,
                                    isSelected: true
                                };
                            newContestScreenSetModel(newContestScreenModel.onNewContestTypeAdded(newContestTypeAdded));
                        }
                        setLoader(false);
                        setTimeout(() => {
                            clearCreateContest();
                            Alert.alert('Message', 'Contest Created Successfully', [{
                                text: 'Okay',
                                onPress: () => {
                                    props.navigation.goBack()
                                    //props.navigation.replace('CutomizeContestScreen');
                                }
                            }]);
                        }, 200);
                    }, 200);
                })
                .catch((error) => {
                    setLoader(false);
                    console.log("FIREBASE_UPLOADATION_ERROR - ", error);
                })
        } catch (error) {
            setLoader(false);
            console.log("CONTEST_CREATE_HANDLER - ", error);
            console.log(error);
        }
    }
    const clearCreateContest = () => {
        setCreateContestModel(createContestModel.reset());
        for (let key in formRefs.current) {
            formRefs.current[key].current.reset();
        }
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
                    heading={fromEdit ? "Create New Contest Type" : "Create Event - Create Contest"}
                    menuOnPress={() => props.navigation.openDrawer()}
                    leftOnPress={() => props.navigation.goBack()}
                />
                {/* <DoubleHeading
                    containerStyle={Styles.singleHeadingContainer}
                    left={eventModalProps?.eventName || ""}
                    right={eventModalProps?.selectedCharityData?.value || ""}
                /> */}
                <View>

                    <View style={Styles.imagePlateContainer}>
                        <ImageVideoPlaceholder
                            ref={formRefs.current.contestLogo}
                            renderText={"Upload\nContest\nLogo"}
                            type={"photo"}
                            //mode={!isEditMode ? "view" : "select"}
                            //viewURI={contestModel.contestLogo}
                            //resetViewURI={contestTypeLogo => setContestModel(contestModel.update('contestLogo', undefined))}
                            selectedData={contestTypeLogo => setCreateContestModel(createContestModel.update('contestTypeLogo', contestTypeLogo))}
                        />
                        <View style={Styles.imagePlateRightChildView}>

                            <TextInput
                                containerStyle={Styles.maxNumplayersStyle}
                                inputStyle={Styles.maxNumplayersTextStyle}
                                placeholder={"Enter Contest Name"}
                                value={createContestModel.contestType}
                                onChangeText={contestType => setCreateContestModel(createContestModel.update('contestType', contestType))}
                            />
                        </View>
                    </View>
                </View>
                <SingleHeadingDropdown
                    ref={formRefs.current.scoringType}
                    backgroundColor={'#EDCF80'}
                    containerStyle={Styles.selectContestTypeHeadingContainer}
                    placeholder={"Select Scoring Types"}
                    items={createContestModel?.contestScoringTypes || []}
                    onSelect={selectedContestScoringType => {
                        // if(isEditMode) {
                        //     setIsEditMode(false);
                        // }
                        setCreateContestModel(createContestModel.onChangeScoringType(selectedContestScoringType));
                    }}
                />
                <TextAreaHeading
                    placeholder={"Enter Rules"}
                    editable={isEditMode}
                    heading={"Rules "}
                    value={createContestModel.contestTypeRules}
                    onChangeText={contestTypeRules => setCreateContestModel(createContestModel.update('contestTypeRules', contestTypeRules))}
                />

                <TextAreaHeading
                    placeholder={"Enter Scoring"}
                    heading={"Scoring "}
                    editable={isEditMode}
                    value={createContestModel.contestTypeScoring}
                    onChangeText={contestTypeScoring => setCreateContestModel(createContestModel.update('contestTypeScoring', contestTypeScoring))}
                />

                <TextAreaHeading
                    placeholder={"Enter Equipment Details"}
                    heading={"Equipments "}
                    editable={isEditMode}
                    value={createContestModel.contestTypeEquipment}
                    onChangeText={contestTypeEquipment => setCreateContestModel(createContestModel.update('contestTypeEquipment', contestTypeEquipment))}
                />

                <View style={Styles.bottomTrayContainer}>
                    <Text style={Styles.galleryTextStyle}>
                        Gallery
                    </Text>

                    <View style={Styles.galleryView}>
                        <ImageVideoPlaceholder
                            ref={formRefs.current.contestPhoto}
                            renderText={"Upload Contest Photo"}
                            type={"photo"}
                            // mode={!isEditMode ? "view" : "select"}
                            // viewURI={contestModel.contestPhoto}
                            // resetViewURI={contestPhoto => setContestModel(contestModel.update('contestPhoto', undefined))}
                            selectedData={contestTypePhoto => setCreateContestModel(createContestModel.update('contestTypePhoto', contestTypePhoto))}
                            containerStyle={Styles.uploadPhotoContainerStyle}
                        />

                        <ImageVideoPlaceholder
                            ref={formRefs.current.contestVideo}
                            renderText={"Upload Contest Video"}
                            type={"video"}
                            containerStyle={Styles.uploadVideoContainerStyle}
                            // mode={!isEditMode ? "view" : "select"}
                            // viewURI={contestModel.contestVideo}
                            // resetViewURI={contestVideo => setContestModel(contestModel.update('contestVideo', undefined))}
                            selectedData={contestTypeVideo => setCreateContestModel(createContestModel.update('contestTypeVideo', contestTypeVideo))}
                            renderChildren={createContestModel.contestTypeVideo.length > 0 ? true : false}
                        >

                            <Feather name='play' color='#FFF' size={30} />
                        </ImageVideoPlaceholder>
                    </View>

                </View>
                <View style={Styles.bottomButtonsTray}>
                    <TouchableButton
                        type={"small"}
                        backgroundColor={"#EC2939"}
                        title={"Create"}
                        onPress={createHandler}
                    />
                    <TouchableButton
                        disabled={false}
                        type={"small"}
                        backgroundColor={"#EDCF80"}
                        title={"Clear"}
                        onPress={() => {
                            Keyboard.dismiss();
                            clearCreateContest();
                        }}
                    />
                    <TouchableButton
                        type={"small"}
                        backgroundColor={"#0B214D"}
                        title={"Cancel"}
                        onPress={() => {
                            Keyboard.dismiss();
                            return props.navigation.goBack();
                        }}
                    />
                </View>
            </KeyboardAwareScrollView>
        </Root>
    );
}

export default connect()(CreateContestScreen); 