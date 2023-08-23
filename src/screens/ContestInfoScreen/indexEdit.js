import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
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
    CreateEventProgress
} from "@component";
import { useLoader, useFirebaseUpload } from "@hooks";
import Styles from "./indexCss";
import {
    contestsCollection,
} from "../../firebase";
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";
import { useDispatch, useSelector, connect } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

AntDesign.loadFont();

const CustomizeContestScreen = (props) => {
    const dispatch = useDispatch();
    const { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
    const {
        contestIModel,
        setContestIModel
    } = props;
    const [setLoader, LoaderComponent] = useLoader();
    var { firebaseAllCollectionData, auth } = useSelector(s => s);

    const saveContestDataToFirebase = async (saveEditedContestData) => {
        try {
            console.log('SAVE_EDIT_CONTEST_DATA_TEST_1 - ', JSON.stringify(saveEditedContestData));
            const editContestResponse = await contestsCollection.doc(saveEditedContestData.id).update(saveEditedContestData.data);
            setLoader(false);
            setTimeout(() => {
                setContestIModel(contestIModel.dataSaved(saveEditedContestData));
            }, 600);
        } catch (error) {
            console.log('EDIT_CONTEST_INFO_SAVE - ', error);
            setLoader(false);
            setTimeout(() => {
                return Alert.alert('Message', 'Something went wrong!');
            }, 600);
        }

    }

    const uploadAssetToFirebase = (file, path) => {
        return new Promise(async (resolve, reject) => {
            const blobFile = await convertToBlob(
                file,
                path
            );
            uploadBlobToFirebase(blobFile)
                .then(async (url) => {
                    return resolve(url);
                })
                .catch(error => {
                    console.log('UPLOAD_LOGO_FIREBASE - ', error);
                    return reject(error);
                })
        });

    }
    const saveContestEditData = async () => {
        try {
            setLoader(true);
            const saveEditedContestData = contestIModel.saveEditContestData();
            console.log('EXTRANCT_HERE - ', JSON.stringify(saveEditedContestData));
            if (saveEditedContestData.data?.contestLogo?.includes("file:/")) {
                //Contest Logo Updated
                uploadAssetToFirebase(
                    saveEditedContestData.data.contestLogo,
                    "events&contestsImages/"
                ).then((contestLogoURL) => {
                    saveEditedContestData.data.contestLogo = contestLogoURL;
                    //Contest Photo Uploaded
                    if (saveEditedContestData.data.contestPhoto?.includes("file:/")) {
                        uploadAssetToFirebase(
                            saveEditedContestData.data.contestPhoto,
                            "events&contestsImages/"
                        ).then((contestPhotoURL) => {
                            saveEditedContestData.data.contestPhoto = contestPhotoURL;
                            if (saveEditedContestData.data.contestVideo?.includes("file:/")) {
                                uploadAssetToFirebase(
                                    saveEditedContestData.data.contestVideo,
                                    "events&contestsImages/"
                                ).then((contestVideoURL) => {
                                    saveEditedContestData.data.contestVideo = contestVideoURL;
                                    saveContestDataToFirebase(saveEditedContestData);
                                })
                            } else {
                                saveContestDataToFirebase(saveEditedContestData);
                            }
                        });


                    } else if (saveEditedContestData.data.contestVideo?.includes("file:/")) {
                        uploadAssetToFirebase(
                            saveEditedContestData.data.contestVideo,
                            "events&contestsImages/"
                        ).then((contestVideoURL) => {
                            saveEditedContestData.data.contestVideo = contestVideoURL;
                            saveContestDataToFirebase(saveEditedContestData);
                        });
                    } else {
                        saveContestDataToFirebase(saveEditedContestData);
                    }
                });
            }

            else if (saveEditedContestData.data?.contestPhoto?.includes("file:/")) {
                uploadAssetToFirebase(
                    saveEditedContestData.data.contestPhoto,
                    "events&contestsImages/"
                ).then((contestPhotoURL) => {
                    saveEditedContestData.data.contestPhoto = contestPhotoURL;
                    if (saveEditedContestData.data.contestVideo.includes("file:/")) {
                        uploadAssetToFirebase(
                            saveEditedContestData.data.contestVideo,
                            "events&contestsImages/"
                        ).then((contestVideoURL) => {
                            saveEditedContestData.data.contestVideo = contestVideoURL;
                            saveContestDataToFirebase(saveEditedContestData);
                        })
                    } else {
                        saveContestDataToFirebase(saveEditedContestData);
                    }
                });


            }


            else if (saveEditedContestData.data?.contestVideo?.includes("file:/")) {
                uploadAssetToFirebase(
                    saveEditedContestData.data.contestVideo,
                    "events&contestsImages/"
                ).then((contestVideoURL) => {
                    saveEditedContestData.data.contestVideo = contestVideoURL;
                    saveContestDataToFirebase(saveEditedContestData);
                });
            } else {
                saveContestDataToFirebase(saveEditedContestData);
            }
        } catch (error) {
            setLoader(false);
            console.log('EDIT_CONTEST_SAVE - ', error);
            setTimeout(() => {
                Alert.alert('Message', 'Something went wrong!');
            }, 1000);
            return
        }

    }
    let currentBracketType = contestIModel.allBracketTypeData.find(i => i.contestBracketTypeID == contestIModel.editedContestDetails.contestBracketType);
    let bracketTypePlaceholder = '';
    if (currentBracketType) {
        bracketTypePlaceholder = currentBracketType.name;
    } else {
        bracketTypePlaceholder = contestIModel.editedContestDetails.contestBracketType;
    }
    return (
        <Root childViewStyle={Styles.childViewStyle}>
            <LoaderComponent />
            <Header
                hideMenu
                heading={"Edit Contest"}
                menuOnPress={() => props.navigation.openDrawer()}
                leftOnPress={() => {
                    setContestIModel(contestIModel.update('mode', 0));
                }}
            />
            <DoubleHeading
                containerStyle={Styles.singleHeadingContainer}
                left={contestIModel.EventDetails?.eventName || ""}
                right={contestIModel.EventDetails?.charityData?.charityName || ""}
            />

            <View>
                <TextInput
                    containerStyle={Styles.inputContainerStyle}
                    inputStyle={Styles.inputStyle}
                    placeholder={"Enter Contest Name"}
                    value={contestIModel.editedContestDetails.contestName}
                    onChangeText={(contestName) =>
                        setContestIModel(contestIModel.onEditContest("contestName", contestName))
                    }
                />
                <View style={Styles.imagePlateContainer}>
                    <ImageVideoPlaceholder
                        renderText={"Upload Contest Logo"}
                        type={"photo"}
                        viewURI={contestIModel.editedContestDetails.contestLogo}
                        resetViewURI={() => {
                            setContestIModel(contestIModel.onEditContest("contestLogo", null));
                        }}
                        selectedData={(contestLogo) => {
                            setContestIModel(contestIModel.onEditContest("contestLogo", contestLogo));
                        }}

                    />
                    <View style={Styles.imagePlateRightChildView}>
                        <View style={Styles.datePickerContainer}>
                            <DateInput
                                title={"Start Date"}
                                onDateSet={(contestDate) =>
                                    setContestIModel(contestIModel.onEditContest("contestDate", contestDate))
                                }
                                onSelectedDate={contestIModel.editedContestDetails.contestDate}
                            />
                            <DateInput
                                title={"End Date"}
                                onDateSet={(contestDateEnd) =>
                                    setContestIModel(contestIModel.onEditContest("contestDateEnd", contestDateEnd))
                                }
                                onSelectedDate={contestIModel.editedContestDetails.contestDateEnd}
                            />
                        </View>
                        <TextInput
                            isNumeric
                            containerStyle={Styles.maxNumplayersStyle}
                            inputStyle={Styles.maxNumplayersTextStyle}
                            placeholder={"Maximum Number of Players"}
                            value={'' + contestIModel.editedContestDetails.contestMaxPlayers}
                            onChangeText={(contestMaxPlayers) => {
                                setContestIModel(contestIModel.onEditContest("contestMaxPlayers", contestMaxPlayers));
                            }}
                        />
                    </View>
                </View>
            </View>
            {/* <SingleHeadingDropdown
          backgroundColor={"#EC2939"}
          containerStyle={Styles.selectContestTypeHeadingContainer}
          placeholder={eventModalProps.eventContestType}
          items={eventModalProps?.contestTypesData || []}
          onSelect={(selectedContestType) => {
            if (isEditMode) {
              setIsEditMode(false);
            }
            setContestModel(
              contestModel.onChangeContestType(selectedContestType)
            );
          }} 
        /> */}
            <SingleHeadingDropdown 
                backgroundColor={'#EDCF80'}
                containerStyle={Styles.selectContestTypeHeadingContainer}
                placeholder={contestIModel.editedContestDetails?.contestScoringType || ''}
                items={contestIModel.contestScoringTypes || []}
                onSelect={selectedContestScoringType => {
                    // if(isEditMode) {
                    //     setIsEditMode(false);
                    // }
                    setContestIModel(contestIModel.onEditContest("contestScoringType", selectedContestScoringType.name));
                    //setCreateContestModel(createContestModel.onChangeScoringType(selectedContestScoringType));
                }}
            />
            <DoubleHeadingDropdown
                backgroundColor={"#EDCF80"}
                containerStyle={Styles.selectBracketTypeScoringContainer}
                leftPlaceHolder={bracketTypePlaceholder}
                rightPlaceHolder={""}
                type={'SINGLE'}
                onSelect={(contestBracketSelectedType) => {
                    setContestIModel(contestIModel.onEditContest("contestBracketType", contestBracketSelectedType.contestBracketTypeID));
                }}
                items={[...firebaseAllCollectionData.firebaseCollectionData.contestBracketTypesData]}
            />
            <TextAreaInput
                textInputStyle={Styles.eventDescriptionTextStyle}
                placeholder={"Contest Description"}
                value={contestIModel.editedContestDetails.contestDescription}
                onChangeText={(contestDescription) => {
                    setContestIModel(contestIModel.onEditContest("contestDescription", contestDescription));
                }}
            />
            <TextAreaHeading
                editable={true}
                heading={"Rules "}
                value={contestIModel.editedContestDetails.contestRules}
                onChangeText={(contestRules) => {
                    setContestIModel(contestIModel.onEditContest("contestRules", contestRules));
                }}
            />

            <TextAreaHeading
                heading={"Scoring "}
                editable={true}
                value={contestIModel.editedContestDetails.contestScoringDescription}
                onChangeText={(contestScoringDescription) => {
                    setContestIModel(contestIModel.onEditContest("contestScoringDescription", contestScoringDescription));
                }}
            />

            <TextAreaHeading
                heading={"Equipments "}
                editable={true}
                value={contestIModel.editedContestDetails.contestEquipment}
                onChangeText={(contestEquipment) => {
                    setContestIModel(contestIModel.onEditContest("contestEquipment", contestEquipment));
                }}
            />

            <View style={Styles.bottomTrayContainer}>
                <Text style={Styles.galleryTextStyle}>Gallery</Text>

                <View style={Styles.galleryView}>
                    <ImageVideoPlaceholder
                        renderText={"Upload Contest Picture"}
                        type={"photo"}
                        viewURI={contestIModel.editedContestDetails.contestPhoto}
                        resetViewURI={() => {
                            setContestIModel(contestIModel.onEditContest("contestPhoto", null));
                        }}
                        selectedData={(contestPhoto) => {
                            setContestIModel(contestIModel.onEditContest("contestPhoto", contestPhoto));
                        }}
                        containerStyle={Styles.uploadPhotoContainerStyle}
                        imageStyle={Styles.uploadPhotoContainerStyle}
                    />

                    <ImageVideoPlaceholder
                        renderText={"Upload Video"}
                        type={"video"}
                        containerStyle={Styles.uploadVideoContainerStyle}
                        resetViewURI={() => {
                            setContestIModel(contestIModel.onEditContest("contestVideo", null));
                        }}
                        selectedData={(contestVideo) => {
                            setContestIModel(contestIModel.onEditContest("contestVideo", contestVideo));
                        }}
                    />
                </View>
            </View>
            <View style={Styles.bottomButtonsTray}>
                <TouchableButton
                    type={"small"}
                    backgroundColor={"#EC2939"}
                    title={"Save"}
                    onPress={saveContestEditData}
                />

                <TouchableButton
                    type={"small"}
                    backgroundColor={"#EDCF80"}
                    title={"Cancel"}
                    onPress={() => {
                        setContestIModel(contestIModel.update('mode', 0));
                    }}
                />
            </View>
        </Root>
    );
};

export default connect()(CustomizeContestScreen);
