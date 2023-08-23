// External Imports
import React, { useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Button } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import styles from "./indexCss";
import { initFirebaseCollectionsData } from "../../../store/actions";
import Spinner from "react-native-loading-spinner-overlay";
//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";

//import EventSlider from '../Slider/EventSlider'
import {
  Root,
  PRLLogo,
  TouchableBox,
  TouchableButton,
  ImageVideoPlaceholder,
} from "@component";

import WatchEventIcon from "@assets/WatchEventIcon.png";
import JoinEvents from "@assets/JoinEventsIcon.png";
import CharityIcon from "@assets/CharityIcon.png";
import CreateEventIcon from "@assets/CreateEventIcon.png";
import PlayPNG from "@assets/play.png";
import CalendarPNG from "@assets/Calendar.png";
import AllGamesPNG from "@assets/AllGames.png";
import CompetitionPNG from "@assets/Competition.png";
import BetIcon from "@assets/Beticon.png";
import { useDispatch, useSelector, connect } from "react-redux";
import { useLoader } from "@hooks";
import {
  setTestDeviceIDAsync,
  AdMobBanner,
  PublisherBanner,
} from "expo-ads-admob";
import {
  Ads,
  FirebaseOperations,
  FirebaseNotificationTriggers,
} from "@classes";
import { renderInterstatial } from "@utils";
import { StatusBar } from "react-native";

Entypo.loadFont();

function HomeScreen({ navigation }) {
  const [setLoader, LoaderComponent] = useLoader();
  const dispatch = useDispatch();
  let {
    appInfoData,
    auth,
    adsUsage,
    firebaseAllCollectionData: { isReady, loading, error },
  } = useSelector((state) => state);
  console.log("AUTH_DATA_12 - ", adsUsage);
  const loadFirebaseCollections = useCallback(() =>
    dispatch(initFirebaseCollectionsData(auth))
  );
  useEffect(() => {
    (async () => {
      await setTestDeviceIDAsync("EMULATOR");
    })();
    loadFirebaseCollections();
  }, []);
  useEffect(() => {
    if (appInfoData.fcmToken.length > 0) {
      FirebaseOperations.updateFirebaseToken(
        auth.userCol,
        appInfoData.fcmToken
      );
    }
  }, [appInfoData.fcmToken]);
  const Profile = (
    <View style={{ flexDirection: "row" }}>
      <View style={{ width: "20%", marginLeft: 30, alignItems: "center" }}>
        <ImageVideoPlaceholder
          disabledOnPress={auth?.userCol?.userAvatar?.length == 0}
          viewURI={auth?.userCol?.userAvatar}
          mode="view"
          type="photo"
          containerStyle={{
            backgroundColor: "#DCE4F9",
            height: 72,
            width: 72,
            borderRadius: 36,
            overflow: "hidden",
          }}
          renderChildren={false}
        >
          <Text style={{ textAlign: "center" }}>No Profile Picture</Text>
        </ImageVideoPlaceholder>
      </View>
      <View style={{ justifyContent: "space-evenly" }}>
        <Text style={styles.ProfileWelcomeText}>
          {`Welcome, ${auth?.userCol?.userName || ""}!`}
        </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ReviewProfileScreen", {
              isCompetition: false,
            });
          }}
        >
          <View style={styles.ProfileButtonView}>
            <Text style={styles.ProfileButtonText}>Review Your Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
  const ActionSection = (
    <View style={styles.SectionMainView}>
      <Text
        style={{
          ...styles.SectionText,
          textAlign: "center",
          marginTop: getHp(20),
        }}
      >
        Get Into The Action
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
        <TouchableBox
          onPress={() => {
            navigation.navigate("EventInfoStack", {
              screen: "JoinEventScreen",
            });
          }}
          containerStyle={{
            backgroundColor: "#EC2939",
            alignSelf: "center",
          }}
          name={"Join Events"}
          logo={JoinEvents}
        />
      </View>
    </View>
  );
  const GameSection = (
    <View style={styles.SectionMainView}>
      <Text style={styles.SectionText}>Your Games</Text>
      <View style={styles.SectionSubView}>
        <TouchableButton
          onPress={() =>
            navigation.navigate("MyGamesList", {
              isMine: true,
            })
          }
          containerStyle={[
            styles.inputContainerStyle,
            { width: "80%", alignSelf: "center" },
          ]}
          type={"imgBtn"}
          title={"When You Play"}
          icon={CalendarPNG}
          iconStyle={{ resizeMode: "contain" }}
        />
        <TouchableButton
          onPress={() => {
            return renderInterstatial(function () {
              navigation.navigate("GamesList", {
                isMine: false,
              });
            }, "firstTimeAllMyGames");
          }}
          containerStyle={[
            styles.inputContainerStyle,
            { width: "80%", alignSelf: "center" },
          ]}
          type={"imgBtn"}
          title={"See All Games"}
          icon={AllGamesPNG}
          iconStyle={{ resizeMode: "contain" }}
        />
        <TouchableButton
          onPress={() => {
            return navigation.navigate("CompetitorDrawerScreen");
            return navigation.navigate("ReviewProfileScreen", {
              isCompetition: true,
            });
          }}
          containerStyle={[
            styles.inputContainerStyle,
            { width: "80%", alignSelf: "center" },
          ]}
          type={"imgBtn"}
          title={"Scout Competition"}
          icon={CompetitionPNG}
          iconStyle={{ resizeMode: "contain" }}
        />
        <TouchableButton
          onPress={() => {
            return renderInterstatial(function () {
              navigation.navigate("ChallengesList");
            }, "firstTimePickWiners");
          }}
          containerStyle={[
            styles.inputContainerStyle,
            { width: "80%", alignSelf: "center" },
          ]}
          type={"imgBtn"}
          title={"Pick The Winners"}
          icon={BetIcon}
          iconStyle={{ resizeMode: "contain" }}
        />
      </View>
    </View>
  );

  const CharitySection = (
    <View style={styles.CharityView}>
      <View style={{ alignSelf: "center" }}>
        <Text style={[styles.SectionText, { paddingLeft: 5 }]}>
          Support a Charity
        </Text>
        <TouchableBox
          containerStyle={{
            backgroundColor: "#EDCF80",
          }}
          name={"See Charities"}
          logo={CharityIcon}
          textStyle={{ color: "#000" }}
          onPress={() => {
            if (!auth.userCol?.permissions?.showAds) {
              return navigation.navigate("CharityStack", {
                screen: "ViewCharityScreen",
              });
            }
            setLoader(true);
            let ads = new Ads();
            ads.setOnAdsClose(() => {
              setLoader(false);
              setTimeout(() => {
                navigation.navigate("CharityStack", {
                  screen: "ViewCharityScreen",
                });
              }, 500);
            });
          }}
        />
      </View>
      <View style={{ alignSelf: "center" }}>
        <Text style={[styles.SectionText, { paddingLeft: 5 }]}>
          Support an Athlete
        </Text>
        <TouchableBox
          containerStyle={{
            backgroundColor: "#EC2939",
          }}
          name={"Student Athlete"}
          logo={JoinEvents}
          onPress={() =>
            navigation.navigate("CharityStack", {
              screen: "ViewAthleteScreen",
            })
          }
        />
      </View>
    </View>
  );
  const ErrorView = () => {
    return (
      <View style={styles.errorViewContainer}>
        <Text style={styles.somethingWrongTextStyle}>
          Something went wrong!
        </Text>
        <TouchableOpacity
          onPress={loadFirebaseCollections}
          style={styles.tryAgainTouch}
        >
          <Text style={styles.tryAgainStyle}>Try Again!</Text>
        </TouchableOpacity>
      </View>
    );
  };

  StatusBar.setBarStyle("dark-content", true);
  return (
    <Root>
      <LoaderComponent />

      <StatusBar barStyle="dark-content" />

      <Spinner visible={isReady == false && loading == true} />
      {error ? (
        <ErrorView />
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: "#FFF" }}>
          <View style={styles.HeaderView}>
            <View>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Entypo name="menu" size={40} color="#0B214D" />
              </TouchableOpacity>
            </View>
            <View>
              <PRLLogo imgStyle={styles.logoStyle} />
            </View>
            <View style={{ width: "10%" }} />
          </View>

          {Profile}
          <View style={{ paddingVertical: 5 }} />
          {ActionSection}
          <View style={{ paddingVertical: 5 }} />
          {GameSection}
          <View style={{ marginVertical: 15 }} />
          {CharitySection}

          <View>
            {/* <Button
              title={'Test Notification'}
              onPress={() => {
                FirebaseNotificationTriggers.sentWelcomeNotification(
                  FirebaseNotificationTriggers.welcome()
                );
              }}
            /> */}
          </View>
        </ScrollView>
      )}
      <Spinner visible={adsUsage?.loader} />
    </Root>
  );
}

export default connect()(HomeScreen);
