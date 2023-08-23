import React, { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useBackHandler } from "@react-native-community/hooks";

import {
  Root,
  Header,
  TextInput,
  ImageVideoPlaceholder,
  SingleHeading,
  TextAreaHeading,
  UploadDocument,
  TouchableButton,
  CustomModalDropDown,
} from "@component";
import { charitiesCollection } from "../../../../firebase";
import { connect, useDispatch, useSelector } from "react-redux";
import Styles from "./indexCss";
import { useLoader, useFirebaseUpload } from "@hooks";
import { FONTSIZE, getHp, getWp } from "@utils";
import CreateCharityModel from "./createCharity.model";

const CreateCharityScreen = (props) => {
  const [setLoader, LoaderComponent] = useLoader();
  const [model, setModel] = useState(() => CreateCharityModel);
  const { convertToBlob, uploadBlobToFirebase } = useFirebaseUpload();
  var { firebaseAllCollectionData, auth } = useSelector((s) => s);
  console.log("AUTH_TEST_HERE - ", JSON.stringify(auth));
  let refs = useRef({
    logo: useRef(),
    picture: useRef(),
    video: useRef(),
    tax: useRef(),
    charityType: useRef(),
  });
  useBackHandler(() => {
    console.log("EXECUTED");
    props.navigation.navigate("Home", {
      screen: "HomeScreen",
    });
    return true;
  });
  useEffect(() => {
    setModel(model.init(auth));
  }, []);
  const createHandler = async () => {
    try {
      setLoader(true);
      let uploadCharityData = model.saveFirebase();
      const logoBlob = await convertToBlob(model.charityLogo, "charityImages/");
      const pictureBlob = await convertToBlob(
        model.charityPicture,
        "charityImages/"
      );
      const videoBlob = await convertToBlob(
        model.charityVideo,
        "charityVideos/"
      );
      const taxDocBlob = await convertToBlob(
        model.charityTaxDocument,
        "charityTaxDoc"
      );
      uploadBlobToFirebase(logoBlob)
        .then((charityLogo) => {
          uploadCharityData.charityLogo = charityLogo;
          return uploadBlobToFirebase(pictureBlob);
        })
        .then((charityPicture) => {
          uploadCharityData.charityPicture = charityPicture;
          return uploadBlobToFirebase(videoBlob);
        })
        .then((charityVideo) => {
          uploadCharityData.charityVideo = charityVideo;
          return uploadBlobToFirebase(taxDocBlob);
        })
        .then((charityTaxDocument) => {
          uploadCharityData.charityTaxDocument = charityTaxDocument;
          setTimeout(async () => {
            console.log("CREATE_CHARITY_POST - ", uploadCharityData);
            const saveCharity = await charitiesCollection.add(
              uploadCharityData
            );
            setLoader(false);
            setTimeout(() => {
              Alert.alert("Message", "Charity Added Successfully", [
                {
                  text: "Okay",
                  onPress: () => setModel(model.resetForm(refs)),
                },
              ]);
            }, 400);
          }, 500);
        })
        .catch((error) => {
          setLoader(false);
          console.log("FIREBASE_UPLOADATION_ERROR - ", error);
        });
    } catch (error) {
      setLoader(false);
      console.log("CHARITY_CREATE_HANDLER - ", error);
      console.log(error);
      setTimeout(() => {
        return Alert.alert(
          "Message",
          "Upload Charity Picture, Video and Tax Doc"
        );
      }, 600);
    }
  };
  return (
    <Root childViewStyle={Styles.childViewStyle}>
      <LoaderComponent />
      <KeyboardAwareScrollView contentContainerStyle={Styles.container}>
        <Header
          heading={"Create Charity"}
          menuOnPress={() => props.navigation.openDrawer()}
          leftOnPress={() => props.navigation.goBack()}
        />

        <TextInput
          placeholder={"Enter Charity Name"}
          containerStyle={Styles.charityNameTextInputStyle}
          value={model.charityName}
          onChangeText={(charityName) => {
            setModel(model.update("charityName", charityName));
          }}
        />

        <View style={Styles.charityInfoContainer}>
          <ImageVideoPlaceholder
            ref={refs.current.logo}
            type={"photo"}
            renderText={"Upload Logo"}
            containerStyle={Styles.uploadLogoContainerStyle}
            imageStyle={Styles.uploadLogoContainerStyle}
            selectedData={(charityLogo) => {
              setModel(model.update("charityLogo", charityLogo));
            }}
          />
          <View style={Styles.inputsContainerStyle}>
            <TextInput
              placeholder={"Enter Charity URL"}
              containerStyle={Styles.charityUrlInputStyle}
              value={model.charityURL}
              onChangeText={(charityURL) => {
                setModel(model.update("charityURL", charityURL));
              }}
            />
            <TextInput
              placeholder={"Enter Contact Name"}
              containerStyle={Styles.contactEmailStyle}
              value={model.charityContactName}
              onChangeText={(charityContactName) => {
                setModel(
                  model.update("charityContactName", charityContactName)
                );
              }}
            />
            <TextInput
              placeholder={"Enter Contact Email"}
              containerStyle={Styles.contactEmailStyle}
              value={model.charityContactEmail}
              onChangeText={(charityContactEmail) => {
                setModel(
                  model.update("charityContactEmail", charityContactEmail)
                );
              }}
            />
            <TextInput
              placeholder={"Enter Phone Number"}
              containerStyle={Styles.contactEmailStyle}
              value={model.charityContactNumber}
              onChangeText={(charityContactNumber) => {
                setModel(
                  model.update("charityContactNumber", charityContactNumber)
                );
              }}
            />
            <CustomModalDropDown
              ref={refs.current.charityType}
              onSelect={(charity) => {
                setModel(model.update("charityType", charity.value));
              }}
              containerStyle={{borderColor: "#E1E1E1"}}
              width={getWp(250)}
              height={getHp(38)}
              items={[
                { name: "Charity", value: "Charity" },
                { name: "Student Athlete", value: "Student Athlete" },
              ]}
              placeholder="Select Type"
            />
          </View>
        </View>

        <TextAreaHeading
          placeholder={"Enter Mission of the Charity"}
          editable={true}
          value={model.charityMission}
          onChangeText={(charityMission) => {
            setModel(model.update("charityMission", charityMission));
          }}
          showBorder
          heading={"Mission"}
          containerStyle={Styles.charityMissionInputStyle}
          headingContainerStyle={Styles.charityHeadingContainerStyle}
          headingTextStyle={{ color: "black" }}
        />

        <TextAreaHeading
          placeholder={"Enter Description of the Charity"}
          editable={true}
          value={model.charityDescription}
          onChangeText={(charityDescription) => {
            setModel(model.update("charityDescription", charityDescription));
          }}
          showBorder
          heading={"Description"}
        />

        <SingleHeading
          placeholder={"Upload Picture and Video"}
          containerStyle={Styles.uploadPVHeadingStyle}
          textColor={"white"}
        />

        <View style={Styles.uploadPictureVideoContainer}>
          <ImageVideoPlaceholder
            ref={refs.current.picture}
            type={"photo"}
            renderText={"Upload Picture"}
            containerStyle={Styles.uploadPictureStyle}
            imageStyle={Styles.uploadPictureStyle}
            selectedData={(charityPicture) => {
              setModel(model.update("charityPicture", charityPicture));
            }}
          />

          <ImageVideoPlaceholder
            ref={refs.current.video}
            type={"video"}
            renderText={"Upload Video"}
            containerStyle={Styles.uploadPictureStyle}
            imageStyle={Styles.uploadPictureStyle}
            selectedData={(charityVideo) => {
              setModel(model.update("charityVideo", charityVideo));
            }}
          />
        </View>

        <UploadDocument
          ref={refs.current.tax}
          containerStyle={Styles.uploadDocumentContainerStyle}
          label={"Upload Tax Document"}
          setPickedDocument={(charityTaxDocument) => {
            setModel(model.update("charityTaxDocument", charityTaxDocument));
          }}
        />

        <View style={Styles.bottomButtonTrayContainer}>
          <TouchableButton
            type={"small"}
            backgroundColor={"#EC2939"}
            title={"Save"}
            onPress={createHandler}
          />
          <TouchableButton
            type={"small"}
            backgroundColor={"#EDCF80"}
            title={"Clear"}
          />
          <TouchableButton
            type={"small"}
            backgroundColor={"#0B214D"}
            title={"Cancel"}
            onPress={() =>
              props.navigation.navigate("Home", {
                screen: "HomeScreen",
              })
            }
          />
        </View>
      </KeyboardAwareScrollView>
    </Root>
  );
};

export default connect()(CreateCharityScreen);
