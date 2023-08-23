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
} from "../../../firebase";
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";
import { useDispatch, useSelector, connect } from "react-redux";
import AddNewContestModel from "./AddNewContest.model";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Feather from 'react-native-vector-icons/Feather';
import { updateEventModel, initEventModel } from "../../../store/actions";
import { useBackHandler } from '@react-native-community/hooks';
import Spinner from 'react-native-loading-spinner-overlay';
import Entypo from 'react-native-vector-icons/Entypo';

Feather.loadFont();
AntDesign.loadFont();

const AddNewContestScreen = (props) => {
  const {
    eventIModel,
    setEventIModel
  } = props.route.params;

  const [model, setModel] = useState(() => AddNewContestModel);
  const dispatch = useDispatch();
  const [setLoader, LoaderComponent] = useLoader();
  const [isEditMode, setIsEditMode] = useState(false);
  const { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  var { firebaseAllCollectionData, auth } = useSelector(s => s);
  const formsRef = useRef({
    startDate: useRef(),
    endDate: useRef()
  });

  const loadData = () => {
    let contestBracketTypesData = [...firebaseAllCollectionData.firebaseCollectionData.contestBracketTypesData];
    let contestTypesData = [...firebaseAllCollectionData.firebaseCollectionData.contestTypesData];
    setModel(model.init(eventIModel, contestBracketTypesData, contestTypesData));
  }
  useEffect(() => {
    setModel(model.reset());
    setTimeout(() => {
      loadData();
    }, 1000);
  }, []);

  // // useBackHandler(() => {
  // //   if(eventModalProps.eventFormMode == 1) {
  // //     return false;
  // //   }else {
  // //     return true;
  // //   }
  // // }); 

  const saveContestDataToFirebase = async (
    saveEditedContestData) => {
    try {
      console.log('SAVE_CONTEST_RECIEVE_HERE - ', saveEditedContestData);
      const contestAddResponse = await contestsCollection.add(saveEditedContestData);
      console.log('CONTEST_ADDED_RES - ', contestAddResponse.id);
      setEventIModel(eventIModel.onNewContestAdd({
        ...saveEditedContestData,
        id: contestAddResponse.id,
        isSelected: false
      }));
      setLoader(false);
      setTimeout(() => {
        props.navigation.goBack();
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
  const addNewContestToEvent = async () => {
    try {
      setLoader(true);
      const saveEditedContestData = model.saveContestData();

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
                  saveContestDataToFirebase(saveEditedContestData);
                })
              } else {
                saveContestDataToFirebase(saveEditedContestData);
              }
            });


          } else if (saveEditedContestData.contestVideo?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedContestData.contestVideo,
              "events&contestsImages/"
            ).then((contestVideoURL) => {
              saveEditedContestData.contestVideo = contestVideoURL;
              saveContestDataToFirebase(saveEditedContestData);
            });
          } else {
            saveContestDataToFirebase(saveEditedContestData);
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
              saveContestDataToFirebase(saveEditedContestData);
            })
          } else {
            saveContestDataToFirebase(saveEditedContestData);
          }
        });


      }


      else if (saveEditedContestData.contestVideo?.includes("file:/")) {
        uploadAssetToFirebase(
          saveEditedContestData.contestVideo,
          "events&contestsImages/"
        ).then((contestVideoURL) => {
          saveEditedContestData.contestVideo = contestVideoURL;
          saveContestDataToFirebase(saveEditedContestData);
        });
      } else {
        saveContestDataToFirebase(saveEditedContestData);
      }
    } catch (error) {
      setLoader(false);
      console.log('ADD_CONTEST_SAVE - ', error);
      setTimeout(() => {
        Alert.alert('Message', 'Something went wrong!');
      }, 1000);
      return
    }

  }
   
  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      <Spinner visible={model.loading} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={Styles.container}>
        <Header
          hideMenu
          heading={"Add Contest"}
          menuOnPress={() => props.navigation.openDrawer()}
          leftOnPress={() => props.navigation.goBack()}
        />
        <DoubleHeading
          containerStyle={Styles.singleHeadingContainer}
          left={eventIModel?.currentEventData?.eventName || ""}
          right={eventIModel?.currentEventData?.charityData?.charityName || ""}
        />


        <View>
          <TextInput
            containerStyle={Styles.inputContainerStyle}
            inputStyle={Styles.inputStyle}
            placeholder={"Enter Contest Name"}
            value={model.contestName}
            onChangeText={(contestName) => {
              setModel(model.update("contestName", contestName));
            }}
          />
          <View style={Styles.imagePlateContainer}>
            <ImageVideoPlaceholder
              renderText={"Upload Contest Logo"}
              type={"photo"}
              mode={(!isEditMode) ? "view" :
                "select"}
              viewURI={model.contestLogo}
              resetViewURI={(contestLogo) =>
                setModel(model.update("contestLogo", undefined))
              }
              selectedData={(contestLogo) =>
                setModel(model.update("contestLogo", contestLogo))
              }
            // selectedData={eventLogo => setEventModel(eventModel.update('eventLogo', eventLogo))}
            />
            <View style={Styles.imagePlateRightChildView}>
              <View style={Styles.datePickerContainer}>
                <DateInput
                  // minimumDate={eventModalProps.EventFormFields.eventDate}
                  // maximumDate={eventModalProps.EventFormFields.eventDateEnd}
                  title={"Start Date"}
                  onSelectedDate={model.contestDate ? model.contestDate : ''}
                  onDateSet={contestDate => {
                    setModel(model.update("contestDate", contestDate));
                  }}
                />
                <DateInput
                  // minimumDate={eventModalProps.EventFormFields.eventDate}
                  // maximumDate={eventModalProps.EventFormFields.eventDateEnd}
                  onSelectedDate={model.contestDateEnd ? model.contestDateEnd : ''}
                  title={"End Date"}
                  onDateSet={contestDateEnd => {
                    setModel(model.update("contestDateEnd", contestDateEnd));
                  }}
                />
              </View>
              <TextInput
                isNumeric
                containerStyle={Styles.maxNumplayersStyle}
                inputStyle={Styles.maxNumplayersTextStyle}
                placeholder={"Maximum Number of Players"}
                value={model.contestMaxPlayers}
                onChangeText={(contestMaxPlayers) =>
                  setModel(
                    model.update("contestMaxPlayers", contestMaxPlayers)
                  )
                }
              />
            </View>
          </View>
        </View>

        <SingleHeadingDropdown
          rightComponent={() => {
            return <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('CreateContestTypeScreen', {
                  newContestScreenModel: model,
                  newContestScreenSetModel: setModel
                });
              }}>
              <Entypo name={'plus'} color={'black'}
                size={20} />
            </TouchableOpacity>
          }}
          backgroundColor={"#EC2939"}
          containerStyle={Styles.selectContestTypeHeadingContainer}
          placeholder={model?.selectedContestType?.contestType || ''}
          items={model?.contestTypeData?.length > 0 ? model?.contestTypeData : []}
          onSelect={(selectedContestType) => {
            if (isEditMode) {
              setIsEditMode(false);
            }

            setModel(
              model.onChangeContestType(selectedContestType)
            );
          }}
        />

        <DoubleHeadingDropdown
          backgroundColor={"#EDCF80"}
          containerStyle={Styles.selectBracketTypeScoringContainer}
          leftPlaceHolder={model.contestBracketSelectedType?.contestBracketType ? model.contestBracketSelectedType?.contestBracketType : "Select Bracket Type"}
          //rightPlaceHolder={contestModel?.contestBracketSelectedType?.name || ''}
          rightPlaceHolder={
            model?.selectedContestType?.contestScoringType || ""
          }
          onSelect={(contestBracketSelectedType) => {
            console.log('ON_SELECT_BRACKET_TYPE - ', contestBracketSelectedType);
            setModel(
              model.onSelectBracketType(contestBracketSelectedType)
            )
          }
          }
          items={model.contestBracketTypes}
        />
        <TextAreaInput
          textInputStyle={Styles.eventDescriptionTextStyle}
          placeholder={"Contest Description"}
          value={model.contestDescription}
          onChangeText={(contestDescription) =>
            setModel(
              model.update("contestDescription", contestDescription)
            )
          }
        />
        <TextAreaHeading
          editable={isEditMode}
          heading={"Rules "}
          value={model.contestRules}
          onChangeText={(contestRules) =>
            setModel(model.update("contestRules", contestRules))
          }
        />

        <TextAreaHeading
          heading={"Scoring "}
          editable={isEditMode}
          value={model.contestScoringDescription}
          onChangeText={(contestScoringDescription) =>
            setModel(
              model.update(
                "contestScoringDescription",
                contestScoringDescription
              )
            )
          }
        />

        <TextAreaHeading
          heading={"Equipments "}
          editable={isEditMode}
          value={model.contestEquipment}
          onChangeText={(contestEquipment) =>
            setModel(
              model.update("contestEquipment", contestEquipment)
            )
          }
        />


        <View style={Styles.bottomTrayContainer}>
          <Text style={Styles.galleryTextStyle}>Gallery</Text>

          <View style={Styles.galleryView}>
            <ImageVideoPlaceholder
              renderText={"Upload Contest Picture"}
              type={"photo"}
              mode={(!isEditMode) ? "view" : "select"}
              viewURI={model.contestPhoto}
              resetViewURI={(contestPhoto) =>
                setModel(model.update("contestPhoto", undefined))
              }
              selectedData={(contestPhoto) =>
                setModel(
                  model.update("contestPhoto", contestPhoto)
                )
              }
              containerStyle={Styles.uploadPhotoContainerStyle}
              imageStyle={Styles.uploadPhotoContainerStyle}
            />
            <ImageVideoPlaceholder
              renderText={"Upload Video"}
              type={"video"}
              containerStyle={Styles.uploadVideoContainerStyle}
              mode={(!isEditMode) ? "view" : "select"}
              viewURI={!isEditMode ? model.contestVideo : null}
              resetViewURI={(contestVideo) =>
                setModel(model.update("contestVideo", undefined))
              }
              selectedData={(contestVideo) =>
                setModel(
                  model.update("contestVideo", contestVideo)
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
            title={"Save"}
            onPress={() => addNewContestToEvent()}
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
        <View style={{ height: 50 }} />
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default connect()(AddNewContestScreen);
