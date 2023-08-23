// External Imports
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import Image from 'react-native-remote-svg';
// import {TopProfileView, DrawerMenuItem} from '@components';
import styles from "./indexCss";
import Entypo from "react-native-vector-icons/Entypo";
import PRL from "../../assets/PRLWHITE.png";
import PRLLOGO from "../../assets/prlLogo.svg";
import HOME from "../../assets/HOME.png";
import BROADCAST from "../../assets/BROADCAST.png";
import SCORES from "../../assets/SCORES.png";
import ALLGAMES from "../../assets/AllGames.png";
import EVENTS from "../../assets/EVENTS.png";
import EVENTSVIEW from "../../assets/EventIconWhite.png";
import COMPETITOR from '../../assets/Competition.png';
import VIEWCHARITY from '../../assets/CharityWhite.png';
import CREATEICON from '../../assets/EditIconWhite.png';
import { connect } from "react-redux";
import { PRLLogo } from "../../Component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLinkTo, useNavigation } from "@react-navigation/native";
import { expo } from "../../../app.json";

Entypo.loadFont();

const SideNav = (props) => {
  const linkTo = useLinkTo();
  const navigation = useNavigation();
  const Items = [
    {
      image: HOME,
      menuName: "Home",
      location: () => {
        linkTo("/home");
        //props.navigation.navigate("Home", { screen: "Home_Screen" });
      },
    },
    {
      image: EVENTSVIEW,
      menuName: "Events",
      location: () => {
        linkTo("/joinEvent");
        //props.navigation.navigate("EventInfoStack", { screen: "EventScreen" });
      },
    },
    {
      image: COMPETITOR,
      menuName: "Competitor",
      location: () => {
        navigation.navigate("ReviewProfileScreen", {
          isCompetition: true,
        });
      },
    },
    {
      image: EVENTS,
      menuName: "My Games",
      location: () => {
        linkTo("/myAllGames");
      },
    },
    {
      image: ALLGAMES,
      menuName: "All Games",
      location: () => {
        linkTo("/allGames");
      },
    },
    {
      image: BROADCAST,
      menuName: "Challenges",
      location: () => {
        linkTo("/challengesList");
      },
    },
    {
      image: SCORES,
      menuName: "Your Profile",
      location: () => {
        return navigation.navigate("ReviewProfileScreen", {
          isCompetition: false,
        });
      },
    },
    {
      image: VIEWCHARITY,
      menuName: "View Charities",
      location: () => {
        linkTo("/viewCharity");
        // props.navigation.navigate("CharityStack", {
        //   screen: "ViewCharityScreen",
        // });
      },
    },
    {
      image: CREATEICON,
      menuName: "Host Event",
      location: () => {
        navigation.navigate("EventStack", {
          screen: "CreateEventScreen",
          params: {
            resetForm: false,
          },
        });
      },
    },
    {
      image: CREATEICON,
      menuName: "Add Charities",
      location: () => {
        linkTo("/createCharity");
        // props.navigation.navigate("CharityStack", {
        //   screen: "CreateCharityScreen",
        // });
      },
    },
    {
      menuName: "About PRL",
      location: () => {
        linkTo("/about");
      },
    },
    {
      menuName: "Setting",
      location: () => {
        linkTo("/setting");
      },
    },
    // {
    //   menuName: "Setting",
    //   location: () => {
    //     linkTo('/setting')
    //   },
    // },
    {
      menuName: "Logout",
      location: async () => {
        await AsyncStorage.removeItem("userInfo");
        props.logout();
      },
    },
  ];

  let RenderTagFilterData = ({ data }) => {
    return (
      <TouchableOpacity
          // style={{ width: "80%Create Event - Enter Event Fees" }}
          onPress={() => {
            if (typeof data.location == "function") {
              return data.location();
            }
            return props.navigation.navigate(data.location);
          }}
        >
      <View
        style={{
          marginLeft: 15,
          marginTop: 25,
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          width: 200,
        }}
      >
        
        <View style={{ width: "20%" }}>
          {data.image ? (
            <Image source={data.image} size={40} style={styles.DrawerIcons} />
          ) : (
            <View style={{ width: 0 }} />
          )}
        </View>
        {/* <TouchableOpacity
          // style={{ width: "80%" }}
          onPress={() => {
            if (typeof data.location == "function") {
              return data.location();
            }
            return navigation.navigate(data.location);
          }}
        > */}
          <Text style={{ color: "#FFFFFF", fontSize: 15 }}>
            {data.menuName}
          </Text>
      
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#0B214D", width: "15%", minWidth: 155 }}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <Image source={PRL} height={15} style={styles.profileImg} />
            </View>
            {/* <TouchableOpacity
              onPress={() => props.navigation.closeDrawer()}
              style={{ alignSelf: "flex-end" }}
            >
              <Entypo name="menu" size={40} color="white" style={{}} />
            </TouchableOpacity> */}
          </View>
          <View style={{ marginTop: 0 }}>
            {Items.map((data, index) => (
              <RenderTagFilterData data={data} />
            ))}
            <View style={{alignSelf:'center'}}>
              <Text style={{fontSize: 14, color:'#FFF', fontWeight:"bold", marginVertical: 20}}>Version: {expo.version}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch({ type: "LOGOUT_USER" }),
  };
};
export default connect(null, mapDispatchToProps)(SideNav);
