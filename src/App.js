import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import React, { Component, Fragment } from "react";
import { LogBox } from "react-native";
import { connect } from "react-redux";
import { Colors } from "../utils/tools";

import { NotificationService, RNErrorHandler } from "@classes";
import SideDrawer from "../utils/SideDrawer";
import BroadcastScreen from "./components/home/broadcast";
import InviteScreen from "./components/home/invitation";
import ScoresScreen from "./components/home/scores";
import {
  AuthStack,
  ChallengesListStack,
  CharitiesStack,
  EventInfoStack, EventStack,
  GamesListStack, HomeStack, Stack, UserSettingStack
} from "./Routes/stacks";
import CompetitorDrawerScreen from "./screens/CompetitorScreen";
import SeedingsScreen from "./screens/SeedingsScreen";
import {
  fetchAppAboutInfo,
  initFcm, tryAutoLoginAction
} from "./store/actions";

LogBox.ignoreAllLogs();

const Drawer = createDrawerNavigator();

const MainDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <SideDrawer {...props} />}
    drawerStyle={{ backgroundColor: Colors.blue }}
  >
    {/* <Drawer.Screen name="BracketInfo" component={BracketInfoComponent} /> */}
    <Drawer.Screen name="Home" component={HomeStack} />
    <Drawer.Screen
      name="CompetitorDrawerScreen"
      component={CompetitorDrawerScreen}
    />
    <Drawer.Screen name="EventStack" component={EventStack} />
    <Drawer.Screen name="EventInfoStack" component={EventInfoStack} />
    <Drawer.Screen name="UserSettingStack" component={UserSettingStack} />
    <Drawer.Screen name="CharityStack" component={CharitiesStack} />
    <Drawer.Screen name="Broadcast" component={BroadcastScreen} />
    <Drawer.Screen name="ScoresScreen" component={ScoresScreen} />
    <Drawer.Screen name="Invite" component={InviteScreen} />
    <Drawer.Screen name="SeedingsScreen" component={SeedingsScreen} />
    <Drawer.Screen
      name="GamesList"
      component={GamesListStack}
      initialParams={{ isMine: false }}
    />
    <Drawer.Screen
      name="MyGamesList"
      component={GamesListStack}
      initialParams={{ isMine: true }}
    />
    <Drawer.Screen name="ChallengesList" component={ChallengesListStack} />
    {/* <Drawer.Screen name="TwilioTestScreen" component={TwilioTestScreen} /> */}
  </Drawer.Navigator>
);

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.props.tryAutoLogin();
    this.props.getAppInfoData();

    this.notificationService = new NotificationService((token) => {
      this.props.initFcmDispatch(token, this.notificationService);
    });
    this.notificationService.checkPermission();
    this.notificationService.registerNotifications();
    RNErrorHandler.init();
  }
  render() {
    console.log("TEST_APP_INFO_DATA - ", this.props.appInfoData.fcmToken);
    if (!this.props.autoLogin) {
      return null;
    }
    return (
      <Fragment>
        {/* <View style={{ flex: 1, justifyContent:'center', alignItems: 'center' }}>
          <Button

            title={'HELLO'}
            onPress={() => {
              RNErrorHandler.test();
            }} />
        </View> */}

        <NavigationContainer>
          <Stack.Navigator>
            {!this.props.isAuthenticated ? (
              <Stack.Screen
                name="AuthScreen"
                component={AuthStack}
                options={{
                  gestureEnabled: false,
                  headerShown: false,
                }}
              />
            ) : (
              <Stack.Screen
                name="Main"
                component={MainDrawer}
                options={{ gestureEnabled: false, headerShown: false }}
              />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuth,
    autoLogin: state.auth.autoLogin,
    appInfoData: state.appInfoData,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    tryAutoLogin: () => dispatch(tryAutoLoginAction()),
    getAppInfoData: () => dispatch(fetchAppAboutInfo()),
    initFcmDispatch: (token, ins) => {
      console.log("TOKEN_BEFORE_DISPATCH_3 - ", token);
      dispatch(initFcm(token, ins));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

// export default () => {

//   return (
//     <View style={{marginTop:40, borderWidth:1, borderColor: 'red'}}>
//       <Button
//       title={'add'}
//       onPress={()=>{
//         FirebaseOperations.addkeyToUserCollection();
//       }}
//     />
//     </View>
//   );
// }

//"react-native-twilio-video-webrtc": "https://github.com/blackuy/react-native-twilio-video-webrtc",

// organizerID
// organizerName

//"react-native-firebase": "5.6.0",
