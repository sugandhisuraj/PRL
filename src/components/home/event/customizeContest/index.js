import React, { useEffect, useState, useRef } from "react";
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
  contestBracketTypesCollection,
  contestsCollection,
} from "../../../../firebase";
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";
import { useDispatch, useSelector, connect } from "react-redux";
import { readCharities } from "../../../../store/actions";
import ContestModel from "./Contest.model";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from 'react-native-vector-icons/Feather';
import { updateEventModel, initEventModel } from "../../../../store/actions";
import { useBackHandler } from '@react-native-community/hooks';
Feather.loadFont();
AntDesign.loadFont();

const CustomizeContestScreen = (props) => {
  const dispatch = useDispatch();
  const eventModalProps = useSelector((state) => state.event.eventModel);
  const setEventModel = (newEventModel) => {
    dispatch(updateEventModel(newEventModel));
  };
  const [setLoader, LoaderComponent] = useLoader();
  const [isEditMode, setIsEditMode] = useState(false);
  const [contestModel, setContestModel] = useState(ContestModel);
  const { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  var { firebaseAllCollectionData, auth } = useSelector(s => s);
  const formsRef = useRef({
    startDate: useRef(),
    endDate: useRef()
  })
  useEffect(() => {
    console.log("MOUNTED_CREATE_CONTEST");
    // formsRef.current.startDate.current.reset();
    // formsRef.current.endDate.current.reset();
    const contestBracketTypes = [...firebaseAllCollectionData.firebaseCollectionData.contestBracketTypesData];
    setContestModel(contestModel.init(contestBracketTypes, eventModalProps, props.route.params.currentContestFactoryIndex));
  }, [props.route.params]);

  // useBackHandler(() => {
  //   if(eventModalProps.eventFormMode == 1) {
  //     return false;
  //   }else {
  //     return true;
  //   }
  // });
  //New CODE

  const saveContestDataToFirebase = async (
    saveEditedContestData,
    uploadedId,
    isUploadedOnce) => {
    try {
      console.log('SAVE_EDIT_CONTEST_DATA_TEST_1 - ', JSON.stringify(saveEditedContestData));
      let editContestResponse;
      if (isUploadedOnce) {
        editContestResponse = await contestsCollection.doc(uploadedId).update(saveEditedContestData);
        setEventModel(eventModalProps.onSingleContestUploaded(saveEditedContestData,
          uploadedId,
          props.route.params.currentContestFactoryIndex));
      } else {
        editContestResponse = await contestsCollection.add(saveEditedContestData);
        setEventModel(eventModalProps.onSingleContestUploaded(saveEditedContestData,
          editContestResponse.id,
          props.route.params.currentContestFactoryIndex));
      }

      setLoader(false);
      setTimeout(() => {
        props.navigation.goBack();
        // props.navigation.navigate('EventStack', {
        //   screen: 'EventProfileCreateScreen'
        // });
      }, 500);
    } catch (error) {
      console.log('SAVE_CONTEST_ERROR - ', error);
      setLoader(false);
      setTimeout(() => {
        return Alert.alert('Message', 'Something went wrong!');
      }, 500);
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
  const createHandler = async () => {
    try {
      setLoader(true);
      const {
        saveEditedContestData,
        uploadedId,
        isUploadedOnce
      } = contestModel.saveContestData(eventModalProps, props.route.params.currentContestFactoryIndex);

      if (isUploadedOnce) {
        return saveContestDataToFirebase(saveEditedContestData,
          uploadedId,
          isUploadedOnce);
      }

      if (saveEditedContestData.contestLogo?.includes("file:/")) {
        //Contest Logo Updated
        uploadAssetToFirebase(
          saveEditedContestData.contestLogo,
          "events&contestsImages/"
        ).then((contestLogoURL) => {
          saveEditedContestData.contestLogo = contestLogoURL;
          //Contest Photo Uploaded
          if (saveEditedContestData.contestPhoto?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedContestData.contestPhoto,
              "events&contestsImages/"
            ).then((contestPhotoURL) => {
              saveEditedContestData.contestPhoto = contestPhotoURL;
              if (saveEditedContestData.contestVideo?.includes("file:/")) {
                uploadAssetToFirebase(
                  saveEditedContestData.contestVideo,
                  "events&contestsImages/"
                ).then((contestVideoURL) => {
                  saveEditedContestData.contestVideo = contestVideoURL;
                  saveContestDataToFirebase(saveEditedContestData,
                    uploadedId,
                    isUploadedOnce);
                })
              } else {
                saveContestDataToFirebase(saveEditedContestData,
                  uploadedId,
                  isUploadedOnce);
              }
            });


          } else if (saveEditedContestData.contestVideo?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedContestData.contestVideo,
              "events&contestsImages/"
            ).then((contestVideoURL) => {
              saveEditedContestData.contestVideo = contestVideoURL;
              saveContestDataToFirebase(saveEditedContestData,
                uploadedId,
                isUploadedOnce);
            });
          } else {
            saveContestDataToFirebase(saveEditedContestData,
              uploadedId,
              isUploadedOnce);
          }
        });
      }

      else if (saveEditedContestData.contestPhoto?.includes("file:/")) {
        uploadAssetToFirebase(
          saveEditedContestData.contestPhoto,
          "events&contestsImages/"
        ).then((contestPhotoURL) => {
          saveEditedContestData.contestPhoto = contestPhotoURL;
          if (saveEditedContestData.contestVideo?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedContestData.contestVideo,
              "events&contestsImages/"
            ).then((contestVideoURL) => {
              saveEditedContestData.contestVideo = contestVideoURL;
              saveContestDataToFirebase(saveEditedContestData,
                uploadedId,
                isUploadedOnce);
            })
          } else {
            saveContestDataToFirebase(saveEditedContestData,
              uploadedId,
              isUploadedOnce);
          }
        });


      }


      else if (saveEditedContestData.contestVideo?.includes("file:/")) {
        uploadAssetToFirebase(
          saveEditedContestData.contestVideo,
          "events&contestsImages/"
        ).then((contestVideoURL) => {
          saveEditedContestData.contestVideo = contestVideoURL;
          saveContestDataToFirebase(saveEditedContestData,
            uploadedId,
            isUploadedOnce);
        });
      } else {
        saveContestDataToFirebase(saveEditedContestData,
          uploadedId,
          isUploadedOnce);
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

  //NEW Code 
  const createContestNavHandler = () => {
    return props.navigation.navigate("EventStack", {
      screen: "CreateContestScreen",
    });
  };
  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={Styles.container}>
        <Header
          hideMenu
          heading={"Create Event - Customize Contest"}
          menuOnPress={() => props.navigation.openDrawer()}
          leftOnPress={() => props.navigation.goBack()}
        />
        <DoubleHeading
          containerStyle={Styles.singleHeadingContainer}
          left={eventModalProps?.EventFormFields?.eventName || ""}
          right={eventModalProps?.selectedCharityData?.value || ""}
        />
        <View>
          <TextInput
            containerStyle={Styles.inputContainerStyle}
            inputStyle={Styles.inputStyle}
            placeholder={"Enter Contest Name"}
            value={contestModel.contestName}
            onChangeText={(contestName) =>
              setContestModel(contestModel.update("contestName", contestName))
            }
          />
          <View style={Styles.imagePlateContainer}>
            <ImageVideoPlaceholder
              renderText={"Upload Contest Logo"}
              type={"photo"}
              mode={(!isEditMode) ? "view" :
                eventModalProps.createContestFactory[props.route.params.currentContestFactoryIndex].isUploadedOnce ? "view" : "select"}
              viewURI={contestModel.contestLogo}
              resetViewURI={(contestLogo) =>
                setContestModel(contestModel.update("contestLogo", undefined))
              }
              selectedData={(contestLogo) =>
                setContestModel(contestModel.update("contestLogo", contestLogo))
              }
            // selectedData={eventLogo => setEventModel(eventModel.update('eventLogo', eventLogo))}
            />
            <View style={Styles.imagePlateRightChildView}>
              <View style={Styles.datePickerContainer}>
                <DateInput
                  minimumDate={eventModalProps.EventFormFields.eventDate}
                  maximumDate={eventModalProps.EventFormFields.eventDateEnd}
                  title={"Start Date"}
                  onSelectedDate={contestModel.contestDate ? contestModel.contestDate : ''}
                  onDateSet={contestDate => {
                    setContestModel(contestModel.update("contestDate", contestDate));
                  }}
                />
                <DateInput
                  minimumDate={eventModalProps.EventFormFields.eventDate}
                  maximumDate={eventModalProps.EventFormFields.eventDateEnd}
                  onSelectedDate={contestModel.contestDateEnd ? contestModel.contestDateEnd : ''}
                  title={"End Date"}
                  onDateSet={contestDateEnd => {
                    setContestModel(contestModel.update("contestDateEnd", contestDateEnd));
                  }}
                />
              </View>
              <TextInput
                isNumeric
                containerStyle={Styles.maxNumplayersStyle}
                inputStyle={Styles.maxNumplayersTextStyle}
                placeholder={"Maximum Number of Players"}
                value={contestModel.contestMaxPlayers}
                onChangeText={(contestMaxPlayers) =>
                  setContestModel(
                    contestModel.update("contestMaxPlayers", contestMaxPlayers)
                  )
                }
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
        // rightComponent={() => {
        //   return (
        //     <TouchableOpacity onPress={createContestNavHandler}>
        //       <AntDesign name={"plus"} size={getHp(25)} />
        //     </TouchableOpacity>
        //   );
        // }}
        /> */}
        <DoubleHeadingDropdown
          backgroundColor={"#EDCF80"}
          containerStyle={Styles.selectBracketTypeScoringContainer}
          leftPlaceHolder={contestModel.contestBracketSelectedType?.contestBracketType ? contestModel.contestBracketSelectedType?.contestBracketType : "Select Bracket Type"}
          //rightPlaceHolder={contestModel?.contestBracketSelectedType?.name || ''}
          rightPlaceHolder={
            contestModel.selectedContestType?.contestScoringType || ""
          }
          onSelect={(contestBracketSelectedType) => {
            console.log('ON_SELECT_BRACKET_TYPE - ', contestBracketSelectedType);
            setContestModel(
              contestModel.onSelectBracketType(contestBracketSelectedType)
            )
          }
          }
          items={contestModel.contestBracketTypes}
        />
        <TextAreaInput
          textInputStyle={Styles.eventDescriptionTextStyle}
          placeholder={"Contest Description"}
          value={contestModel.contestDescription}
          onChangeText={(contestDescription) =>
            setContestModel(
              contestModel.update("contestDescription", contestDescription)
            )
          }
        />
        <TextAreaHeading
          editable={isEditMode}
          heading={"Rules "}
          value={contestModel.contestRules}
          onChangeText={(contestRules) =>
            setContestModel(contestModel.update("contestRules", contestRules))
          }
        />

        <TextAreaHeading
          heading={"Scoring "}
          editable={isEditMode}
          value={contestModel.contestScoringDescription}
          onChangeText={(contestScoringDescription) =>
            setContestModel(
              contestModel.update(
                "contestScoringDescription",
                contestScoringDescription
              )
            )
          }
        />

        <TextAreaHeading
          heading={"Equipments "}
          editable={isEditMode}
          value={contestModel.contestEquipment}
          onChangeText={(contestEquipment) =>
            setContestModel(
              contestModel.update("contestEquipment", contestEquipment)
            )
          }
        />

        <View style={Styles.bottomTrayContainer}>
          <Text style={Styles.galleryTextStyle}>Gallery</Text>

          <View style={Styles.galleryView}>
            <ImageVideoPlaceholder
              renderText={"Upload Contest Picture"}
              type={"photo"}
              mode={(!isEditMode) ? "view" :
                eventModalProps.createContestFactory[props.route.params.currentContestFactoryIndex].isUploadedOnce ? "view" : "select"}
              viewURI={contestModel.contestPhoto}
              resetViewURI={(contestPhoto) =>
                setContestModel(contestModel.update("contestPhoto", undefined))
              }
              selectedData={(contestPhoto) =>
                setContestModel(
                  contestModel.update("contestPhoto", contestPhoto)
                )
              }
              containerStyle={Styles.uploadPhotoContainerStyle}
              imageStyle={Styles.uploadPhotoContainerStyle}
            />
            <ImageVideoPlaceholder
              renderText={"Upload Video"}
              type={"video"}
              containerStyle={Styles.uploadVideoContainerStyle}
              mode={(!isEditMode) ? "view" :
                eventModalProps.createContestFactory[props.route.params.currentContestFactoryIndex].isUploadedOnce ? "view" : "select"}
              viewURI={!isEditMode ? contestModel.contestVideo : null}
              resetViewURI={(contestVideo) =>
                setContestModel(contestModel.update("contestVideo", undefined))
              }
              selectedData={(contestVideo) =>
                setContestModel(
                  contestModel.update("contestVideo", contestVideo)
                )
              }
              renderChildren
            //containerStyle={Styles.uploadPhotoContainerStyle}
            >
              <Feather name='play' color='#FFF' size={30} />
            </ImageVideoPlaceholder>
          </View>
        </View>
        <View style={Styles.bottomButtonsTray}>
          <TouchableButton
            type={"small"}
            backgroundColor={"#EC2939"}
            title={eventModalProps.createContestFactory[props.route.params.currentContestFactoryIndex].isUploadedOnce ? "Update" : "Save"}
            onPress={createHandler}
          />

          <TouchableButton
            disabled={isEditMode}
            type={"small"}
            backgroundColor={"#EDCF80"}
            title={"Edit"}
            onPress={() => setIsEditMode(true)}
          />
          <TouchableButton
            type={"small"}
            backgroundColor={"#0B214D"}
            title={"Cancel"}
            onPress={() => {
              if (isEditMode) {
                return setIsEditMode(false);
              }
              props.navigation.goBack()
            }}
          />
        </View>

        <View style={Styles.nextContainer}>
          {/* <View style={Styles.nextContainerRow}>
            <TouchableButton
              type={"prevStep"}
              title={"Previous Step"}
              onPress={() => {
                props.navigation.goBack();
              }}

            />
            <View style={{ width: getWp(20) }} />
            <TouchableButton
              type={'nextStep'}
              title={"Next Step"}
              propButtonStyle={{ width: getWp(200) }}
              onPress={createHandler}
              titleStyle={{ fontSize: FONTSIZE.Text16 }}
            />
          </View> */}
          <CreateEventProgress
            containerStyle={{ marginTop: getHp(30) }}
            selectedIndex={2}
          />
        </View>
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default connect()(CustomizeContestScreen);
