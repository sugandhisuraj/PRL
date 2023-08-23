import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Spinner from "react-native-loading-spinner-overlay";
import {
  Header,
  Root,
  TextInput,
  ImageVideoPlaceholder,
  DateInput,
  CustomModalDropDown,
  SingleHeading,
  TextAreaInput,
  TouchableButton,
  CreateEventProgress,
  TextInputHeading,
  CollapsibleViewWithHeading,
  RenderQuestionLabel,
} from "@component";
import { useLoader, useFirebaseUpload } from "@hooks";
import Styles from "./indexCss";
import {
  eventsCollection,
  eventProfileQuestionsCollection,
} from "../../firebase";
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";
import { useDispatch, useSelector, connect } from "react-redux";

import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

AntDesign.loadFont();

const CreateEventScreen = (props) => {
  var [setLoader, LoaderComponent] = useLoader();
  const { eventIModel, setEventIModel } = props;
  var { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  var { firebaseAllCollectionData } = useSelector((s) => s);
  const [filterCharity, setFilterCharity] = useState([]);
  var dispatch = useDispatch();

  var { eventModel } = useSelector((state) => state.event);
  var setEventModel = (newEventModel) => {
    dispatch(updateEventModel(newEventModel));
  };
  var formsRef = useRef({
    categoryRef: useRef(),
    subCategoryRef: useRef(),
    genreRef: useRef(),
    contestTypeRef: useRef(),
    uploadLogo: useRef(),
    uploadPicture: useRef(),
    uploadVideo: useRef(),
    startDate: useRef(),
    endDate: useRef(),
    charityData: useRef(),
    charityType: useRef(),
  });

  const onChangeCharityType = (charityType) => {
    let customCharity = [];
    eventIModel.editData.charityData.map((d) => {
      if (d.charityType === charityType) {
        customCharity.push(d);
      }
    });
    setFilterCharity(customCharity);
  };

  var handleCreateContestType = (screen) => {
    if (eventModel.eventName.length == 0) {
      return Alert.alert("Message", "Enter Event Name");
    }
    if (eventModel.eventLogo.length == 0) {
      return Alert.alert("Message", "Select Event Logo");
    }
    if (eventModel.eventDate.length == 0) {
      return Alert.alert("Message", "Select Event Start Date");
    }
    if (eventModel.eventDateEnd.length == 0) {
      return Alert.alert("Message", "Select Event End Date");
    }
    if (Object.keys(eventModel.selectedCharityData).length == 0) {
      return Alert.alert("Message", "Select Charity");
    }
    if (eventModel.eventCategory.length == 0) {
      return Alert.alert("Message", "Select Category");
    }
    if (eventModel.eventSubCategory.length == 0) {
      return Alert.alert("Message", "Select Sub Category");
    }
    if (eventModel.eventGenre.length == 0) {
      return Alert.alert("Message", "Select Genre");
    }
    if (Object.keys(eventModel.selectedEventContestType).length == 0) {
      return Alert.alert("Message", "Select Contest Types");
    }
    if (eventModel.eventPicture.length == 0) {
      return Alert.alert("Message", "Select Event Picture");
    }
    if (eventModel.eventVideo.length == 0) {
      return Alert.alert("Message", "Select Event Video");
    }
    props.navigation.navigate("EventStack", {
      screen,
    });
  };

  const uploadAssetToFirebase = React.useCallback((file, path) => {
    return new Promise(async (resolve, reject) => {
      const blobFile = await convertToBlob(file, path);
      uploadBlobToFirebase(blobFile)
        .then(async (url) => {
          return resolve(url);
        })
        .catch((error) => {
          console.log("UPLOAD_LOGO_FIREBASE - ", error);
          return reject(error);
        });
    });
  }, []);

  const saveEventDataToFirebase = async (getEditedData) => {
    try {
      console.log("EDITED_DATA - ", JSON.stringify(getEditedData));
      let saveEditData = await eventsCollection
        .doc(getEditedData.id)
        .update(getEditedData.data);
      console.log("DATA_UPDATED - ", saveEditData);
      //saving player questions
      let playerQuestions = eventIModel.savePlayerProfileData();
      const playerQuestionUpdateRes = await eventProfileQuestionsCollection
        .doc(playerQuestions.id)
        .update(playerQuestions.data);
      console.log("PLAYER_QUESTIONS_UPDATED - ", playerQuestionUpdateRes);

      //saving player questions
      setLoader(false);
      setTimeout(() => {
        const firebaseCollectionData = {
          ...firebaseAllCollectionData.firebaseCollectionData,
        };
        setEventIModel(
          eventIModel.refreshAfterEdit(
            getEditedData.data,
            firebaseCollectionData,
            playerQuestions.data
          )
        );
      }, 1000);
    } catch (error) {
      console.log("SAVE_EVENT_DATA_TO_FIREBASE - ", error);
      setLoader(false);
      setTimeout(() => {
        return Alert.alert("Message", "Something went wrong!");
      }, 1000);
    }
  };

  const saveEditedData = async () => {
    try {
      setLoader(true);
      const saveEditedEventData = eventIModel.saveEditEventData();
      console.log("SAVE_EDIT_DATA - ", JSON.stringify(saveEditedEventData));

      if (saveEditedEventData.data.eventLogo?.includes("file:/")) {
        //Event Logo Updated
        uploadAssetToFirebase(
          saveEditedEventData.data.eventLogo,
          "events&contestsImages/"
        ).then((eventLogoURL) => {
          saveEditedEventData.data.eventLogo = eventLogoURL;
          //Event Photo Uploaded
          if (saveEditedEventData.data.eventPicture?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedEventData.data.eventPicture,
              "events&contestsImages/"
            ).then((eventPictureURL) => {
              saveEditedEventData.data.eventPicture = eventPictureURL;
              if (saveEditedEventData.data.eventVideo?.includes("file:/")) {
                uploadAssetToFirebase(
                  saveEditedEventData.data.eventVideo,
                  "events&contestsImages/"
                ).then((eventVideoURL) => {
                  saveEditedEventData.data.eventVideo = eventVideoURL;
                  saveEventDataToFirebase(saveEditedEventData);
                });
              } else {
                saveEventDataToFirebase(saveEditedEventData);
              }
            });
          } else if (saveEditedEventData.data.eventVideo?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedEventData.data.eventVideo,
              "events&contestsImages/"
            ).then((eventVideoURL) => {
              saveEditedEventData.data.eventVideo = eventVideoURL;
              saveEventDataToFirebase(saveEditedEventData);
            });
          } else {
            saveEventDataToFirebase(saveEditedEventData);
          }
        });
      } else if (saveEditedEventData.data.eventPicture?.includes("file:/")) {
        uploadAssetToFirebase(
          saveEditedEventData.data.eventPicture,
          "events&contestsImages/"
        ).then((eventPictureURL) => {
          saveEditedEventData.data.eventPicture = eventPictureURL;
          if (saveEditedEventData.data.eventVideo?.includes("file:/")) {
            uploadAssetToFirebase(
              saveEditedEventData.data.eventVideo,
              "events&contestsImages/"
            ).then((eventVideoURL) => {
              saveEditedEventData.data.eventVideo = eventVideoURL;
              saveEventDataToFirebase(saveEditedEventData);
            });
          } else {
            saveEventDataToFirebase(saveEditedEventData);
          }
        });
      } else if (saveEditedEventData.data.eventVideo?.includes("file:/")) {
        uploadAssetToFirebase(
          saveEditedEventData.data.eventVideo,
          "events&contestsImages/"
        ).then((eventVideoURL) => {
          saveEditedEventData.data.eventVideo = eventVideoURL;
          saveEventDataToFirebase(saveEditedEventData);
        });
      } else {
        saveEventDataToFirebase(saveEditedEventData);
      }
    } catch (error) {
      setLoader(false);
      console.log("EVENT_EDIT_HANDLER - ", error);
      setTimeout(() => {
        Alert.alert("Message", "Something went wrong!");
      }, 1000);
      return;
    }
  };

  const clearHandler = (shouldResetId = false) => {
    setEventModel(eventModel.resetEventModalForm(shouldResetId));
    for (let key in formsRef.current) {
      formsRef.current[key].current.reset();
    }
  };

  const RenderQuestionLabel = ({ text = "Question" }) => {
    return <Text style={Styles.questionLabelStyle}>{text}</Text>;
  };

  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      {/* <Spinner visible={eventModel.loading} /> */}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={"always"}
        contentContainerStyle={Styles.container}
      >
        <Header
          hideMenu
          heading={"Edit Event"}
          //   menuOnPress={() => {
          //     props.navigation.openDrawer();
          //   }}
          leftOnPress={() => {
            setEventIModel(eventIModel.update("mode", 0));
          }}
        />
        <TouchableOpacity
          onPress={() => setEventIModel(eventIModel.update("mode", 0))}
          style={Styles.closeEditModelContainer}
        >
          <AntDesign name={"close"} size={25} color={"black"} />
        </TouchableOpacity>

        <CollapsibleViewWithHeading
          defaultCollapseValue={false}
          heading={"Event Info"}
          // collapseStyle={{ minHeight: getHp(300) }}
          containerStyle={{ marginTop: getHp(10), height: getHp(35) }}
          headingContainerStyle={{
            justifyContent: "space-between",
            width: "85%",
          }}
        >
          <View>
            <TextInput
              containerStyle={Styles.inputContainerStyle}
              inputStyle={Styles.inputStyle}
              placeholder={"Enter Event Name"}
              value={eventIModel.currentEventEditData.eventName}
              onChangeText={(editEventName) =>
                setEventIModel(
                  eventIModel.onEditEvent("eventName", editEventName)
                )
              }
            />
            <View style={Styles.imagePlateContainer}>
              <ImageVideoPlaceholder
                ref={formsRef.current.uploadLogo}
                renderText={"Upload Logo"}
                viewURI={eventIModel.currentEventEditData.eventLogo}
                type={"photo"}
                selectedData={(eventLogo) =>
                  setEventIModel(
                    eventIModel.onEditEvent("eventLogo", eventLogo)
                  )
                }
                resetViewURI={() => {
                  setEventIModel(eventIModel.onEditEvent("eventLogo", null));
                }}
              />
              <View style={Styles.imagePlateRightChildView}>
                <View style={Styles.datePickerContainer}>
                  <DateInput
                    ref={formsRef.current.startDate}
                    title={"Start Date"}
                    onDateSet={(eventDate) =>
                      setEventIModel(
                        eventIModel.onEditEvent("eventDate", eventDate)
                      )
                    }
                    onSelectedDate={eventIModel.currentEventEditData.eventDate}
                  />
                  <DateInput
                    ref={formsRef.current.endDate}
                    title={"End Date"}
                    onDateSet={(eventDateEnd) =>
                      setEventIModel(
                        eventIModel.onEditEvent("eventDateEnd", eventDateEnd)
                      )
                    }
                    onSelectedDate={
                      eventIModel.currentEventEditData.eventDateEnd
                    }
                  />
                </View>
                <CustomModalDropDown
                  ref={formsRef.current.charityType}
                  onSelect={(charity) => {
                    setEventIModel(
                      eventIModel.onEditEvent("charityType", charity.value)
                    );
                    onChangeCharityType(charity.value);
                  }}
                  width={getWp(240)}
                  height={getHp(37)}
                  items={[
                    { name: "Charity", value: "Charity" },
                    { name: "Student Athlete", value: "Student Athlete" },
                  ]}
                  placeholder={eventIModel.currentEventEditData?.charityData
                      ?.charityType || "Select Charity Type"}
                />
                <CustomModalDropDown
                  ref={formsRef.current.charityData}
                  onSelect={(charity) => {
                    setEventIModel(
                      eventIModel.onEditEvent("charityID", charity.charityID)
                    );
                  }}
                  width={getWp(240)}
                  height={getHp(37)}
                  items={filterCharity}
                  placeholder={
                    eventIModel.currentEventEditData?.charityData
                      ?.charityName || "Select Charity"
                  }
                />
              </View>
            </View>
          </View>
          <SingleHeading
            containerStyle={Styles.singleHeadingContainer}
            placeholder={"Edit Details about your Event below"}
          />
          <View style={Styles.eventDetailsContainer}>
            <CustomModalDropDown
              ref={formsRef.current.categoryRef}
              onSelect={(event) =>
                setEventIModel(
                  eventIModel.onEditEvent("eventCategory", event.eventCategory)
                )
              }
              width={getWp(330)}
              height={getHp(37)}
              items={eventIModel.editData.eventCategoriesData || []}
              placeholder={eventIModel.currentEventEditData.eventCategory}
            />
            <CustomModalDropDown
              ref={formsRef.current.subCategoryRef}
              onSelect={(eventSubcategory) =>
                setEventIModel(
                  eventIModel.onEditEvent(
                    "eventSubCategory",
                    eventSubcategory.eventSubCategory
                  )
                )
              }
              width={getWp(330)}
              height={getHp(37)}
              items={eventIModel.editData.eventSubCategoriesData || []}
              placeholder={eventIModel.currentEventEditData.eventSubCategory}
            />
            <CustomModalDropDown
              ref={formsRef.current.genreRef}
              onSelect={(eventGenre) =>
                setEventIModel(
                  eventIModel.onEditEvent(
                    "eventGenre",
                    eventGenre.eventGenreType
                  )
                )
              }
              width={getWp(330)}
              height={getHp(37)}
              items={eventIModel.editData.eventGenreData || []}
              placeholder={eventIModel.currentEventEditData.eventGenre}
            />
            <TextAreaInput
              textInputStyle={Styles.eventDescriptionTextStyle}
              placeholder={"Event Description"}
              value={eventIModel.currentEventEditData.eventDescription}
              onChangeText={(eventDescription) =>
                setEventIModel(
                  eventIModel.onEditEvent("eventDescription", eventDescription)
                )
              }
            />

            <Text style={Styles.galleryLabelStyle}>Gallery</Text>
            <View style={Styles.bottomTrayContainer}>
              <ImageVideoPlaceholder
                ref={formsRef.current.uploadPicture}
                renderText={"Upload Picture"}
                type={"photo"}
                viewURI={eventIModel.currentEventEditData.eventPicture}
                selectedData={(eventPicture) =>
                  setEventIModel(
                    eventIModel.onEditEvent("eventPicture", eventPicture)
                  )
                }
                resetViewURI={() => {
                  setEventIModel(eventIModel.onEditEvent("eventPicture", null));
                }}
                containerStyle={Styles.uploadPicStyle}
                imageStyle={Styles.uploadPicStyle}
              />
              <ImageVideoPlaceholder
                ref={formsRef.current.uploadVideo}
                renderText={"Upload Video"}
                type={"video"}
                containerStyle={Styles.uploadVideoContainerStyle}
                imageStyle={Styles.uploadVideoContainerStyle}
                selectedData={(eventVideo) =>
                  setEventIModel(
                    eventIModel.onEditEvent("eventVideo", eventVideo)
                  )
                }
                resetViewURI={() => {
                  setEventIModel(eventIModel.onEditEvent("eventVideo", null));
                }}
              />
            </View>
            <TextInputHeading
              containerStyle={Styles.paymentTermsStyle}
              heading={"Payment Terms"}
              placeholder={"Type Payment Terms..."}
              value={eventIModel.currentEventEditData.eventPaymentTerms}
              onChangeText={(eventPaymentTerms) => {
                setEventIModel(
                  eventIModel.onEditEvent(
                    "eventPaymentTerms",
                    eventPaymentTerms
                  )
                );
              }}
            />

            <TextInputHeading
              containerStyle={{ marginTop: 40 }}
              heading={"Charity Thank You Note"}
              placeholder={"Type charity thank you note..."}
              value={eventIModel.currentEventEditData.eventThankYou}
              onChangeText={(eventThankYou) => {
                setEventIModel(
                  eventIModel.onEditEvent("eventThankYou", eventThankYou)
                );
              }}
            />
            <TextInputHeading
              containerStyle={{ marginBottom: 20 }}
              textInputStyle={{ height: getHp(100) }}
              heading={"Event Information"}
              placeholder={
                "Type event information (starting date, when game schedules will be issued, any instructions)... "
              }
              value={eventIModel.currentEventEditData.eventInformation}
              onChangeText={(eventInformation) => {
                setEventIModel(
                  eventIModel.onEditEvent("eventInformation", eventInformation)
                );
              }}
            />
          </View>
        </CollapsibleViewWithHeading>

        <CollapsibleViewWithHeading
          defaultCollapseValue={false}
          heading={"Player Profile Questions"}
          // collapseStyle={{ minHeight: getHp(300) }}
          containerStyle={{ height: getHp(35), marginTop: getHp(15) }}
          headingContainerStyle={{
            justifyContent: "space-between",
            width: "85%",
          }}
        >
          <View style={Styles.questionsInputContainer}>
            <RenderQuestionLabel text={"Question 1"} />
            <TextInput
              placeholder={"Type Question Here..."}
              value={
                eventIModel.currentEventEditData?.eventProfileQuestions
                  ?.profileQ1Label
              }
              onChangeText={(profileQ1Label) => {
                setEventIModel(
                  eventIModel.onEditPlayerProfile(
                    "profileQ1Label",
                    profileQ1Label
                  )
                );
              }}
            />
            <RenderQuestionLabel text={"Question 2"} />
            <TextInput
              placeholder={"Type Question Here..."}
              containerStyle={Styles.questionInputCommonTextStyle}
              value={
                eventIModel.currentEventEditData?.eventProfileQuestions
                  ?.profileQ2Label
              }
              onChangeText={(profileQ2Label) => {
                setEventIModel(
                  eventIModel.onEditPlayerProfile(
                    "profileQ2Label",
                    profileQ2Label
                  )
                );
              }}
            />
            <RenderQuestionLabel text={"Question 3"} />
            <TextInput
              placeholder={"Type Question Here..."}
              containerStyle={Styles.questionInputCommonTextStyle}
              value={
                eventIModel.currentEventEditData?.eventProfileQuestions
                  ?.profileQ3Label
              }
              onChangeText={(profileQ3Label) => {
                setEventIModel(
                  eventIModel.onEditPlayerProfile(
                    "profileQ3Label",
                    profileQ3Label
                  )
                );
              }}
            />
            <RenderQuestionLabel text={"Question 4"} />
            <TextInput
              placeholder={"Type Question Here..."}
              containerStyle={Styles.questionInputCommonTextStyle}
              value={
                eventIModel.currentEventEditData?.eventProfileQuestions
                  ?.profileQ4Label
              }
              onChangeText={(profileQ4Label) => {
                setEventIModel(
                  eventIModel.onEditPlayerProfile(
                    "profileQ4Label",
                    profileQ4Label
                  )
                );
              }}
            />
            <RenderQuestionLabel text={"Import Photo"} />
            <TextInput
              placeholder={"Import Photo Here"}
              containerStyle={Styles.questionInputCommonTextStyle}
              value={
                eventIModel.currentEventEditData?.eventProfileQuestions
                  ?.profileImageQ
              }
              onChangeText={(profileImageQ) => {
                setEventIModel(
                  eventIModel.onEditPlayerProfile(
                    "profileImageQ",
                    profileImageQ
                  )
                );
              }}
            />
            <RenderQuestionLabel text={"Import Video"} />
            <TextInput
              placeholder={"Import Video Here"}
              containerStyle={Styles.questionInputCommonTextStyle}
              value={
                eventIModel.currentEventEditData?.eventProfileQuestions
                  ?.profileVideoQ
              }
              onChangeText={(profileVideoQ) => {
                setEventIModel(
                  eventIModel.onEditPlayerProfile(
                    "profileVideoQ",
                    profileVideoQ
                  )
                );
              }}
            />
          </View>
        </CollapsibleViewWithHeading>
        <View
          style={{
            width: "90%",
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableButton
            containerStyle={Styles.saveEditBtnStyle}
            type={"nextStep"}
            title={"Save"}
            propButtonStyle={{ width: getWp(150) }}
            onPress={() => {
              saveEditedData();
            }}
            titleStyle={{ fontSize: FONTSIZE.Text17 }}
          />
          <TouchableButton
            containerStyle={Styles.saveEditBtnStyle}
            type={"redBig"}
            title={"cancel"}
            propButtonStyle={{ width: getWp(150), height: getHp(43) }}
            onPress={() => {
              setEventIModel(eventIModel.update("mode", 0));
            }}
            titleStyle={{ fontSize: FONTSIZE.Text17 }}
          />
        </View>
        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default connect()(CreateEventScreen);
