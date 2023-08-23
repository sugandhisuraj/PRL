import React, { useEffect, useState, Fragment, useMemo } from "react";
import { View, StyleSheet, Text, Image, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { Header } from "../KuldeepSRC/src/components";
import { COLOR } from "../KuldeepSRC/src/utils";
import { Description, Mission, WatchVideo, ProfileInfo } from "./components";
import { charitiesCollection } from "../../firebase";
import { transformFirebaseValues, sortArrayAlphabatically } from "@utils";
import { useLoader } from "@hooks";
import { ImageVideoPlaceholder } from "@component";
import Feather from "react-native-vector-icons/Feather";
import { connect, useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAdsBanner } from '@hooks';

Feather.loadFont();
const Charity = ({ navigation }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [charityArray, setCharityArray] = useState([]);
  const [userChoice, setUserChoice] = useState(0);
  const { auth, firebaseAllCollectionData } = useSelector(s => s);
  const [
    renderAdsBanner,
    BannerAdsComponent
] = useAdsBanner(auth);
  const loadCharityData = async () => {
    //const charitiesData = await charitiesCollection.where('charityID', '!=', 0).get();
    const charityData = [...firebaseAllCollectionData.firebaseCollectionData.charityData];
    //let charityData = transformFirebaseValues(charitiesData, "charityID");
    let removePlayerD = charityData.filter(i => i.charityID != 0 && i.charityType === "Student Athlete");
    let sortedCharityData = sortArrayAlphabatically(removePlayerD, 'charityName');
    setCharityArray(sortedCharityData);
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
  };

  useEffect(() => {
    loadCharityData();
  }, []);
  const handleChoice = (choice) => {
    console.log(choice);
    if (userChoice == 0 && choice == -1) setUserChoice(0)
    else if (userChoice == charityArray.length - 1 && choice == 1) setUserChoice(charityArray.length - 1)
    else setUserChoice(userChoice + choice)
  }


  
  const updateToSpecificEntry = (data, index) => {
    setTimeout(() => {
      setCharityArray(c => {
        let newC = [...c];
        newC[index] = { ...data };
        return newC;
      })
    }, 300);
  }
  const onEditPress = () => {
    navigation.navigate("CharityStack", {
      screen: "EditCharityScreen",
      params: {
        propsData: charityArray[`${userChoice}`],
        updateToSpecificEntry: (data) => {
          updateToSpecificEntry(data, userChoice);
        },
        userChoice
      },
    });
  };
  const onEdit = () => {
    if (charityArray) {
      if (auth.userCol.userType == 'admin'
        || charityArray[`${userChoice}`].organizerID == auth.userId) {
        return onEditPress;
      } else {
        return null;
      }
    }
    return null;
  }
  const BannerAdsComponentR = useMemo(() => {
    return <BannerAdsComponent />
  }, []);
  return (
    <View style={{ flex: 1, height: '100%', }}>
      <Spinner visible={!isLoaded} />
      <Header
        menuOnPress={() => navigation.openDrawer()}
        // leftOnPress={() => props.navigation.goBack()}
        onBack={() => navigation.goBack()}
        onEdit={!isLoaded ? () => { } : onEdit()}
      />
      { isLoaded == true ?
        <Fragment>
          <View style={styles.container}>
            <View style={styles.center}>
              <Image
                style={styles.logo}
                source={{
                  uri:
                    charityArray === null
                      ? "https://via.placeholder.com/150"
                      : `${charityArray[`${userChoice}`].charityLogo}`,
                }}
              />
            </View>
            <View style={{ marginTop: 55, flex: 1 }}>
              <ProfileInfo
                onNext={() => handleChoice(+1)}
                onPrevious={() => handleChoice(-1)}
                name={
                  charityArray === null
                    ? ""
                    : charityArray[`${userChoice}`].charityName
                }
                web={
                  charityArray === null
                    ? ""
                    : charityArray[`${userChoice}`].charityURL
                }
                email={
                  charityArray === null
                    ? ""
                    : charityArray[`${userChoice}`].charityContactEmail
                }
                phone={
                  charityArray === null
                    ? ""
                    : charityArray[`${userChoice}`].charityContactNumber
                }
              />

              <ScrollView
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                style={{ height: "20%" }}
              >
                <Mission
                  text={
                    charityArray === null
                      ? ""
                      : charityArray[`${userChoice}`].charityMission
                  }
                // text = {
                //   `
                //   Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                //   Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`
                // }
                />
                <Description
                  url={
                    charityArray === null
                      ? ""
                      : `${charityArray[`${userChoice}`].charityPicture}`
                  }
                  description={
                    charityArray === null
                      ? ""
                      : charityArray[`${userChoice}`].charityDescription
                  }
                />
                {/* <WatchVideo url={charityArray===null ? "charity Video" : `${charityArray[`${userChoice}`].charityVideo}`} /> */}

                <View>
                  <ImageVideoPlaceholder
                    viewURI={
                      charityArray === null
                        ? null
                        : `${charityArray[`${userChoice}`].charityVideo}`
                    }
                    type={"video"}
                    mode={"view"}
                    containerStyle={{
                      width: 300,
                      height: 100,
                      marginLeft: 35,
                      backgroundColor: Colors.Grey,
                      marginTop: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    imageStyle={{
                      width: 110,
                      height: 70,
                    }}
                    renderChildren
                    disabledOnPress={charityArray[`${userChoice}`]?.charityVideo?.length == 0}
                  >
                    {
                      charityArray.length > 0 && charityArray[`${userChoice}`]?.charityVideo?.length == 0 ?
                        <Text style={{ fontWeight: 'bold', color: '#000' }}>No Video</Text> :
                        <Feather name='play' color='#FFF' size={30} />
                    }
                  </ImageVideoPlaceholder>
                </View>
                <View style={{ height: 150 }} />
              </ScrollView>
              {BannerAdsComponentR}
            </View>
          </View>
        </Fragment> : null
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '88%',
    backgroundColor: "white",
    position: "absolute",
    top: Platform.OS === "ios" ? 110 : 100,
    zIndex: 99999999999,
    width: "100%",
    borderRadius: 50,
  },
  logo: {
    borderRadius: 50,
    position: "absolute",
    top: -50, 
    height: 93,
    width: 93,
    resizeMode: "contain",
  },
  center: { alignItems: "center" },
});
export default connect()(Charity);
