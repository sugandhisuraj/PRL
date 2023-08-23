// External Imports
import React from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
// import {TopProfileView, DrawerMenuItem} from '@components';
import styles from "./indexCss";
import Entypo from "react-native-vector-icons/Entypo";
import PRL from "../src/assets/PRLWHITE.png";
import HOME from "../src/assets/HOME.png";
import BROADCAST from "../src/assets/BROADCAST.png";
import SCORES from "../src/assets/SCORES.png";
import ALLGAMES from "../src/assets/AllGames.png";
import EVENTS from "../src/assets/EVENTS.png";
import EVENTSVIEW from "../src/assets/EventIconWhite.png";
import COMPETITOR from "../src/assets/Competition.png";
import VIEWCHARITY from "../src/assets/CharityWhite.png";
import CREATEICON from "../src/assets/EditIconWhite.png";
import FLAGICON from "../src/assets/FLAG.png";
import BETICON from "../src/assets/Beticon.png";
import { Root, AppVersion } from "@component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect, useSelector, useDispatch } from "react-redux";
import { updateEventModel } from "../src/store/actions";
import { renderInterstatial } from "@utils";
import { FirebaseOperations } from "@classes";
Entypo.loadFont();
const SideDrawer = (props) => {
  var eventModelProp = useSelector((state) => state.event.eventModel);
  var setEventModel = (newEventModel) => {
    dispatch(updateEventModel(newEventModel));
  };
  const userInfo = useSelector((state) => state.auth);
  const Items = [
    {
      render: true,
      image: HOME,
      menuName: "Home",
      location: () => {
        props.navigation.navigate("Home", { screen: "HomeScreen" });
      },
    },
    {
      render: true,
      image: EVENTSVIEW,
      menuName: "Events",
      location: () => {
        props.navigation.navigate("EventInfoStack", {
          screen: "JoinEventScreen",
        });
      },
    },

    {
      render: true,
      image: COMPETITOR,
      menuName: "Competitor",
      location: () => {
        return props.navigation.navigate("CompetitorDrawerScreen");
      },
    },
    {
      render: true,
      image: EVENTS,
      menuName: "My Games",
      //location: "MyGamesList",
      location: () => {
        props.navigation.closeDrawer();
        renderInterstatial(function () {
          props.navigation.navigate("MyGamesList");
        }, "firstTimeAllMyGames");
      },
    },
    {
      render: true,
      image: ALLGAMES,
      menuName: "All Games",
      //location: "GamesList",
      location: () => {
        props.navigation.closeDrawer();
        // renderInterstatial(
        //   function() {
        props.navigation.navigate("GamesList");
        //   }, 'firstTimeAllMyGames'
        // );
      },
    },
    {
      render: true,
      image: BETICON,
      menuName: "Picks",
      location: "ChallengesList",
    },
    {
      render: true,
      image: SCORES,
      menuName: "Your Profile",
      location: () => {
        return props.navigation.navigate("ReviewProfileScreen", {
          isCompetition: false,
        });
      },
    },
    {
      render: true,
      image: VIEWCHARITY,
      menuName: "View Charities",
      location: () => {
        props.navigation.navigate("CharityStack", {
          screen: "ViewCharityScreen",
        });
      },
    },
    {
      render: userInfo?.userCol?.permissions?.showHostEvents || false,
      image: FLAGICON,
      menuName: "Host Event",
      location: () => {
        props.navigation.navigate("EventStack", {
          screen: "CreateEventScreen",
          params: {
            resetForm: false,
          },
        });
      },
    },
    // { image: ALLGAMES,
    //   menuName: "RegisterNew",
    //   location: () => {
    //     props.navigation.navigate("UserSettingStack", {
    //       screen: "RegisterPageNew",
    //     });
    //   },
    // },
    {
      render: userInfo?.userCol?.permissions?.showHostEvents || false,
      image: EVENTSVIEW,
      menuName: "Schedule Games",
      location: "SeedingsScreen",
    },
    {
      render: userInfo?.userCol?.permissions?.showAddCharities || false,
      image: FLAGICON,
      menuName: "Add Charities",
      location: () => {
        props.navigation.navigate("CharityStack", {
          screen: "CreateCharityScreen",
        });
      },
    },
    {
      render: true,
      image: null,
      menuName: "About PRL",
      location: "AboutScreen",
    },
    {
      render: true,
      image: null,
      menuName: "User Settings",
      location: () => {
        props.navigation.navigate("UserSettingStack", {
          screen: "UserSettingScreen",
        });
      },
    },
    {
      render: true,
      image: null,
      menuName: "Logout",
      location: async () => {
        try {
          await AsyncStorage.removeItem("userInfo");
          props.logout();
        } catch (error) {
          Alert.alert("Message", "Something went wrong!");
        }
      },
    },
  ];

  let RenderTagFilterData = ({ data }) => {
    return (
      <View
        style={{
          marginLeft: 15,
          marginTop: 25,
          flexDirection: "row",
          alignItems: "center",
          width: "80%",
          alignSelf: "center",
        }}
      >
        <View style={{ width: "30%" }}>
          {data.image ? (
            <Image
              source={data.image}
              resizeMode={"contain"}
              size={40}
              style={styles.DrawerIcons}
            />
          ) : (
            <View style={{ width: 0 }} />
          )}
        </View>
        <TouchableOpacity
          style={{ width: "70%" }}
          onPress={() => {
            if (eventModelProp.eventFormMode == 1) {
              props.navigation.closeDrawer();
              return Alert.alert("Message", "Event is not Saved!", [
                {
                  text: "Okay",
                  onPress: () => {
                    setEventModel(eventModelProp.resetEventModalForm(true));
                    if (typeof data.location == "function") {
                      return data.location();
                    }
                    return props.navigation.navigate(data.location);
                  },
                },
                {
                  text: "Cancel",
                  onPress: () => props.navigation.closeDrawer(),
                },
              ]);
            }
            if (typeof data.location == "function") {
              return data.location();
            }
            return props.navigation.navigate(data.location);
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 15 }}>
            {data.menuName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Root
      childViewStyle={{
        backgroundColor: "#0B214D",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          height: "90%",
          backgroundColor: "#0B214D",
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            // borderWidth: 1,
            // borderColor: 'red',
            backgroundColor: "#0B214D",
          }}
        >
          <View style={styles.container}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 20,
              }}
            >
              <View>
                <Image source={PRL} height={15} style={styles.profileImg} />
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.closeDrawer()}
                style={{ alignSelf: "flex-end" }}
              >
                <Entypo name="menu" size={40} color="white" style={{}} />
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 0 }}>
              {Items.map((data, index) => {
                if (!data.render) {
                  return false;
                }
                return <RenderTagFilterData key={index} data={data} />;
              })}
            </View>
          </View>
        </ScrollView>
      </View>

      <AppVersion
        containerStyle={{
          backgroundColor: "#0B214D",
          bottom: 20,
        }}
      />
    </Root>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "LOGOUT_USER" }),
  };
};
export default connect(null, mapDispatchToProps)(SideDrawer);
