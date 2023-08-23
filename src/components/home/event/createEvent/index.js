import {
  CreateEventProgress,
  CustomModalDropDown,
  DateInput,
  Header,
  ImageVideoPlaceholder,
  Root,
  SingleHeading,
  TextAreaInput,
  TextInput,
  TouchableButton
} from "@component";
import { useFirebaseUpload, useLoader } from "@hooks";
import { useBackHandler } from "@react-native-community/hooks";
import { useIsFocused } from "@react-navigation/native";
import { FONTSIZE, getHp, getWp } from "@utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AntDesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import { connect, useDispatch, useSelector } from "react-redux";
import { eventsCollection } from "../../../../firebase";
import {
  initEventModel,
  updateEventModel,
  updateViewEventModel
} from "../../../../store/actions";
import Styles from "./indexCss";

Feather.loadFont();
AntDesign.loadFont();

const CreateEventScreen = (props) => {
  var [setLoader, LoaderComponent] = useLoader();
  var { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  var { firebaseAllCollectionData, auth } = useSelector((s) => s);
  const viewEventModel = useSelector((state) => state.event.viewEventModel);
  var dispatch = useDispatch();
  const [backState, setBackState] = useState(false);
  const [filterCharity, setFilterCharity] = useState([]);
  const screenFocused = useIsFocused();
  var { eventModel } = useSelector((state) => state.event);
  var setEventModel = (newEventModel) => {
    dispatch(updateEventModel(newEventModel));
  };
  const setViewEventModel = useCallback(
    (payload) => dispatch(updateViewEventModel(payload)),
    []
  );
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

  var loadData = async () => {
    await dispatch(
      initEventModel({
        ...firebaseAllCollectionData.firebaseCollectionData,
      })
    );
    setLoader(false);
  };

  useEffect(() => {
    setLoader(true);
    loadData();
  }, [eventModel.eventName]);

  useEffect(() => {
    if (props.route.params.resetForm) {
      setTimeout(() => {
        clearHandler(true);
      }, 300);
    }
  }, [props.route.params.resetForm]);

  useEffect(() => {
    console.log("SCREEN_FOCUS_TEST - ", screenFocused);
    if (screenFocused) {
      if (eventModel.eventFormMode == 1) {
        setBackState((i) => true);
      }
    } else {
      setBackState((i) => false);
    }
  }, [screenFocused]);

  useBackHandler(() => {
    if (backState && eventModel.eventFormMode == 1) {
      Alert.alert("Message", "All Progress will be Lost!", [
        {
          text: "Okay",
          onPress: () => {
            clearHandler(true);
            props.navigation.goBack();
          },
        },
        {
          text: "Cancel",
        },
      ]);
    }
    return backState;
  });

  const onChangeCharityType = (charityType) => {
    let customCharity = [];
    eventModel.charityData.map((d) => {
      if (d.charityType === charityType) {
        customCharity.push(d);
      }
    });
    setFilterCharity(customCharity);
  };

  const saveEventToFirebase = async (uploadEventToFirebase, mode, id) => {
    let savedEventFormFields = {
      id: null,
      data: null,
    };
    if (mode == "add") {
      console.log("CREATE_EVENT_POST - ", uploadEventToFirebase);
      const savedEvent = await eventsCollection.add(uploadEventToFirebase);
      savedEventFormFields.id = savedEvent.id;
      savedEventFormFields.data = { ...uploadEventToFirebase };

      // ** CODE FOR ADDING PRIVATE EVENT TO VIEW MODEL** //
      //setViewEventModel(viewEventModel.addPrivateEvent(savedEvent.id,uploadEventToFirebase))
      // ** CODE ENDS HERE ** //
    } else {
      console.log("UPDATE_EVENT_POST - ", uploadEventToFirebase);
      const updateEvent = await eventsCollection
        .doc(id)
        .update(uploadEventToFirebase);
      savedEventFormFields.id = id;
      savedEventFormFields.data = { ...uploadEventToFirebase };
    }
    return savedEventFormFields;
  };

  const handleCreateHandler = async () => {
    if (eventModel.EventFormFields.eventName.length == 0) {
      return Alert.alert("Message", "Enter Event Name");
    }
    if (eventModel.EventFormFields.eventLogo.length == 0) {
      return Alert.alert("Message", "Select Event Logo");
    }
    if (eventModel.EventFormFields.eventDate.length == 0) {
      return Alert.alert("Message", "Select Event Start Date");
    }
    if (eventModel.EventFormFields.eventDateEnd.length == 0) {
      return Alert.alert("Message", "Select Event End Date");
    }
    if (Object.keys(eventModel.selectedCharityData).length == 0) {
      return Alert.alert("Message", "Select Charity");
    }
    if (eventModel.EventFormFields.eventCategory.length == 0) {
      return Alert.alert("Message", "Select Category");
    }
    if (eventModel.EventFormFields.eventSubCategory.length == 0) {
      return Alert.alert("Message", "Select Sub Category");
    }
    if (eventModel.EventFormFields.eventGenre.length == 0) {
      return Alert.alert("Message", "Select Genre");
    }
    if (eventModel.EventFormFields.eventPicture.length == 0) {
      return Alert.alert("Message", "Select Event Picture");
    }
    // if (eventModel.EventFormFields.eventVideo.length == 0) {
    //   return Alert.alert('Message', 'Select Event Video');
    // }
    await createHandler();
  };

  const savePhase1 = async (uploadEventToFirebase) => {
    uploadEventToFirebase.organizerName = auth.userCol.userName;
    uploadEventToFirebase.organizerID = auth.userCol.uid;
    const createEventResponse = await saveEventToFirebase(
      uploadEventToFirebase,
      "add"
    );
    setLoader(false);
    setTimeout(() => {
      setEventModel(eventModel.mutationsOnSavedEvents(createEventResponse));
      props.navigation.navigate("ContestTypeScreen");
    }, 500);
  };

  const createHandler = async function () {
    try {
      setLoader(true);
      let { uploadEventToFirebase, eventFormMode, savedEventFormFields } =
        eventModel.getFirebaseData();
      if (eventFormMode == 1) {
        let saveUpdatedData = { ...uploadEventToFirebase };
        saveUpdatedData.eventLogo = savedEventFormFields.data.eventLogo;
        saveUpdatedData.eventPicture = savedEventFormFields.data.eventPicture;
        saveUpdatedData.eventVideo = savedEventFormFields.data.eventVideo;
        const updateEventCurrentForm = await saveEventToFirebase(
          saveUpdatedData,
          "update",
          savedEventFormFields.id
        );
        setLoader(false);
        setTimeout(() => {
          setEventModel(
            eventModel.mutationsOnSavedEvents(updateEventCurrentForm)
          );
          props.navigation.navigate("ContestTypeScreen");
        }, 200);
        return;
      }
      const logoBlob = await convertToBlob(
        eventModel.EventFormFields.eventLogo,
        "events&contestsImages/"
      );
      const pictureBlob = await convertToBlob(
        eventModel.EventFormFields.eventPicture,
        "events&contestsImages/"
      );

      uploadBlobToFirebase(logoBlob)
        .then((eventLogoUrl) => {
          uploadEventToFirebase.eventLogo = eventLogoUrl;
          return uploadBlobToFirebase(pictureBlob);
        })
        .then(async (eventPictureUrl) => {
          uploadEventToFirebase.eventPicture = eventPictureUrl;
          if (eventModel?.EventFormFields.eventVideo?.includes("file:/")) {
            const videoBlob = await convertToBlob(
              eventModel.EventFormFields.eventVideo,
              "events&contestsVideos/"
            );
            uploadBlobToFirebase(videoBlob).then(async (videoURL) => {
              uploadEventToFirebase.eventVideo = videoURL;
              return savePhase1(uploadEventToFirebase);
            });
          } else {
            return savePhase1(uploadEventToFirebase);
          }
        })
        .catch((error) => {
          console.log("ERROR_WHILE_ASSETS_UPLOAD - ", error);
          setLoader(false);
          setTimeout(() => {
            Alert.alert("Message", "Error while Uploading Assets!");
          }, 400);
        });
    } catch (error) {
      setLoader(false);
      console.log("EVENT_CREATE_HANDLER - ", error);
      setTimeout(() => {
        Alert.alert("Message", "Error while Saving Event!");
      }, 400);
    }
  };

  const clearHandler = (shouldResetId = false) => {
    if (shouldResetId) {
      setEventModel(eventModel.resetEventModalForm(shouldResetId));
    }
    for (let key in formsRef.current) {
      if (formsRef.current[key].current) {
        formsRef.current[key].current.reset();
      }
    }
  };

  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps={"always"}
        contentContainerStyle={Styles.container}
      >
        <Header
          heading={"Create Event - Info"}
          menuOnPress={() => {
            props.navigation.openDrawer();
          }}
          leftOnPress={() => {
            if (eventModel.eventFormMode == 1) {
              return Alert.alert("Message", "All Progress will be Lost!", [
                {
                  text: "Okay",
                  onPress: () => {
                    setEventModel(eventModel.resetEventModalForm(true));
                    props.navigation.goBack();
                  },
                },
                {
                  text: "Cancel",
                },
              ]);
            }
            props.navigation.goBack();
          }}
        />
        <View>
          <TextInput
            containerStyle={Styles.inputContainerStyle}
            inputStyle={Styles.inputStyle}
            placeholder={"Enter Event Name"}
            value={eventModel.EventFormFields.eventName}
            onChangeText={(eventName) =>
              setEventModel(eventModel.updateEventForm("eventName", eventName))
            }
          />
          <View style={Styles.imagePlateContainer}>
            <ImageVideoPlaceholder
              mode={eventModel.eventFormMode == 0 ? "select" : "view"}
              ref={formsRef.current.uploadLogo}
              renderText={"Upload Logo"}
              type={"photo"}
              selectedData={(eventLogo) =>
                setEventModel(
                  eventModel.updateEventForm("eventLogo", eventLogo)
                )
              }
            />
            <View style={Styles.imagePlateRightChildView}>
              <View style={Styles.datePickerContainer}>
                <DateInput
                  ref={formsRef.current.startDate}
                  title={"Start Date"}
                  onDateSet={(eventDate) =>
                    setEventModel(
                      eventModel.updateEventForm("eventDate", eventDate)
                    )
                  }
                />
                <DateInput
                  ref={formsRef.current.endDate}
                  minimumDate={eventModel.EventFormFields.eventDate}
                  title={"End Date"}
                  onDateSet={(eventDateEnd) =>
                    setEventModel(
                      eventModel.updateEventForm("eventDateEnd", eventDateEnd)
                    )
                  }
                  firstCallCb={() => {
                    if (eventModel.EventFormFields.eventDate.length == 0) {
                      Alert.alert("Message", "Select Event Start Date!");
                      return false;
                    }
                    return true;
                  }}
                />
              </View>
              <CustomModalDropDown
                ref={formsRef.current.charityType}
                onSelect={(charity) => {
                  setEventModel(
                    eventModel.updateEventForm("charityType", charity.value)
                  );
                  onChangeCharityType(charity.value);
                }}
                width={getWp(250)}
                height={getHp(37)}
                items={[
                  { name: "Charity", value: "Charity" },
                  { name: "Student Athlete", value: "Student Athlete" },
                ]}
                placeholder="Select Charity Type"
              />
              <CustomModalDropDown
                ref={formsRef.current.charityData}
                onSelect={(charity) => {
                  setEventModel(
                    eventModel.updateCharityOnSelect(charity.charityID, charity)
                  );
                }}
                width={getWp(250)}
                height={getHp(37)}
                items={filterCharity}
                placeholder="Select Charity"
              />
            </View>
          </View>
        </View>
        <SingleHeading
          containerStyle={Styles.singleHeadingContainer}
          placeholder={"Enter Details about your Event Below"}
        />
        <View style={Styles.eventDetailsContainer}>
          <CustomModalDropDown
            ref={formsRef.current.categoryRef}
            onSelect={(event) =>
              setEventModel(
                eventModel.updateEventForm("eventCategory", event.eventCategory)
              )
            }
            width={getWp(330)}
            height={getHp(37)}
            items={eventModel?.categoryData || []}
            placeholder="Select Category"
          />
          <CustomModalDropDown
            ref={formsRef.current.subCategoryRef}
            onSelect={(eventSubcategory) =>
              setEventModel(
                eventModel.updateEventForm(
                  "eventSubCategory",
                  eventSubcategory.eventSubCategory
                )
              )
            }
            width={getWp(330)}
            height={getHp(37)}
            items={eventModel?.subCategoryData || []}
            placeholder="Select Sub Category"
          />
          <CustomModalDropDown
            ref={formsRef.current.genreRef}
            onSelect={(eventGenre) =>
              setEventModel(
                eventModel.updateEventForm(
                  "eventGenre",
                  eventGenre.eventGenreType
                )
              )
            }
            width={getWp(330)}
            height={getHp(37)}
            items={eventModel?.genreData || []}
            placeholder="Select Genre"
          />
          <TextAreaInput
            textInputStyle={Styles.eventDescriptionTextStyle}
            placeholder={"Event Description"}
            value={eventModel.EventFormFields.eventDescription}
            onChangeText={(eventDescription) =>
              setEventModel(
                eventModel.updateEventForm("eventDescription", eventDescription)
              )
            }
          />
          <Text style={Styles.galleryLabelStyle}>Gallery</Text>
          <View style={Styles.bottomTrayContainer}>
            <ImageVideoPlaceholder
              ref={formsRef.current.uploadPicture}
              renderText={"Upload Picture"}
              type={"photo"}
              mode={eventModel.eventFormMode == 0 ? "select" : "view"}
              selectedData={(picture) =>
                setEventModel(
                  eventModel.updateEventForm("eventPicture", picture)
                )
              }
              containerStyle={Styles.uploadPicStyle}
              imageStyle={Styles.uploadPicStyle}
            />
            <ImageVideoPlaceholder
              mode={eventModel.eventFormMode == 0 ? "select" : "view"}
              ref={formsRef.current.uploadVideo}
              renderText={"Upload Video"}
              type={"video"}
              viewURI={
                eventModel.eventFormMode == 0
                  ? null
                  : eventModel.savedEventFormFields.data?.eventVideo
              }
              containerStyle={Styles.uploadVideoContainerStyle}
              imageStyle={Styles.uploadVideoContainerStyle}
              selectedData={(video) =>
                setEventModel(eventModel.updateEventForm("eventVideo", video))
              }
              resetViewURI={() => {
                setEventModel(eventModel.updateEventForm("eventVideo", ""));
              }}
              renderChildren={
                eventModel.EventFormFields.eventVideo.length > 0
                  ? true
                  : eventModel.eventFormMode == 0
                  ? false
                  : true
              }
              disabledOnPress={
                eventModel.eventFormMode == 1 &&
                eventModel.savedEventFormFields.data?.eventVideo?.length == 0
              }
            >
              <Feather name="play" color="#FFF" size={30} />
            </ImageVideoPlaceholder>
          </View>
          <TouchableButton
            type={"small"}
            backgroundColor={"#EC2939"}
            title={eventModel.eventFormMode == 0 ? "Save" : "Update"}
            onPress={handleCreateHandler}
            containerStyle={Styles.saveUpdateContainerStyle}
          />
          <View style={Styles.bottomButtonsTray}>
            <TouchableButton
              type={"nextStep"}
              title={"Next Step"}
              propButtonStyle={{ width: getWp(200) }}
              onPress={() => {
                props.navigation.navigate("EventStack", {
                  screen: "ContestTypeScreen",
                });
              }}
              titleStyle={{ fontSize: FONTSIZE.Text16 }}
            />
          </View>
        </View>

        <CreateEventProgress
          containerStyle={{ marginTop: getHp(30) }}
          selectedIndex={1}
        />
        <View style={{ height: 60 }} />
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default connect()(CreateEventScreen);

/*

*/
