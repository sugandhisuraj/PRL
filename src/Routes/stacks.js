import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import JoinEventScreen from "../components/home/event/joinEvent";
import HomeScreen2 from "../components/home/HomeScreen/HomeScreen";
//import WatchEventScreen from '../components/home/event/watchEvent';
import { createDrawerNavigator } from "@react-navigation/drawer";
import CreateInitialProfileScreen from "../components/auth/createProfile";
import LoginScreen from "../components/auth/login";
import RegisterScreen from "../components/auth/register";
import ResetPasswordScreen from "../components/auth/resetPassword";
import ChallengesListScreen from "../components/challenges";
import GameScreen from "../components/game";
import ChatScreen from "../components/game/chatView";
import ContestChatScreen from "../components/game/chatView/ContestChatView";
import EventChatScreen from "../components/game/chatView/EventChatView";
import CompletedGameWithRecordingsView from "../components/game/completedGameView/CompletedGameWithRecordingsView";
import UpcomingGameView from "../components/game/upcomingGameView";
import GamesListScreen from "../components/gamelist";
import CreateCharityScreen from "../components/home/charity/createCharity";
import ContestTypeScreen from "../components/home/event/contestType";
import CreateContestScreen from "../components/home/event/createContest";
import CreateEventScreen from "../components/home/event/createEvent";
import EventProfileCreateScreen from "../components/home/event/createProfile";
import CutomizeContestScreen from "../components/home/event/customizeContest";
import EventFeesScreen from "../components/home/event/eventFees";
import EventPaymentSignupScreen from "../components/home/event/eventPaymentSignup";
import PlayerProfileScreen from "../components/home/user/profile/index";
import AboutScreen from "../screens/AboutUs";
import ViewAthleteScreen from "../screens/Charity/athlete";
import ViewCharityScreen from "../screens/Charity/charity";
import ContestInfoScreen from "../screens/ContestInfoScreen";
import EditCharityScreen from "../screens/EditCharity/editCharity";
import EPConfirmationScreen from "../screens/EPConfirmation";
import EPCreditCardScreen from "../screens/EPCreditCard";
import EventInfoScreen from "../screens/EventInfoScreen";
import AddNewContestScreen from "../screens/EventInfoScreen/AddNewContestScreen";
import PlayerListScreen from "../screens/PlayerProfileList";
import PrivacyPolicyScreen from "../screens/PrivacyPolicy";
import TermsConditionsScreen from "../screens/TermsConditions";
export const Drawer = createDrawerNavigator();

import ReviewProfileScreen from "../components/home/user/ReviewProfile";

import RegisterPageNew from "../components/auth/RegisterPageNew";
import UserSettingScreen from "../screens/UserSetting";

import EventChallengesSummaryView from "../components/challenges/EventChallengesSummaryView";
import EventChallengesView from "../components/challenges/EventChallengesView";
import EventScoreBoardView from "../components/challenges/EventScoreBoard";
import GameChallengesListView from "../components/challenges/GameChallengesListView";

import FullChannelRoom from "../components/channel/FullChannelRoom";
import JudgeScoreGame from "../components/judgeScoreGame";
import UserScoringView from "../components/judgeScoreGame/UserScoringView";

export const Stack = createStackNavigator();

export const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" headerMode={"none"}>
      <Stack.Screen name="HomeScreen" component={HomeScreen2} />
      <Stack.Screen
        name="ReviewProfileScreen"
        component={ReviewProfileScreen}
      />
      {/* <Stack.Screen name="Profile Screen" component={ProfileScreen} /> */}
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
    </Stack.Navigator>
  );
};

export const GamesListStack = ({ navigation, route }) => {
  return (
    <Stack.Navigator initialRouteName="Games List Screen">
      <Stack.Screen
        name="All Games"
        component={GamesListScreen}
        options={{ headerShown: false }}
        initialParams={{ isMine: route.params.isMine }}
      />
      <Stack.Screen
        name="ChannelRoom"
        component={FullChannelRoom}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameScreen"
        component={GameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="PlayerProfileScreen"
        component={PlayerProfileScreen}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ContestChatScreen"
        component={ContestChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EventChatScreen"
        component={EventChatScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpcomingGameScreen"
        component={UpcomingGameView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GameChallengesView"
        component={GameChallengesListView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompletedGameScreen"
        component={CompletedGameWithRecordingsView}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JudgeScoreGame"
        component={JudgeScoreGame}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserScoringView"
        component={UserScoringView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export const ChallengesListStack = () => {
  return (
    <Stack.Navigator initialRouteName="Challenges List Screen">
      <Stack.Screen
        name="Challenges List"
        options={{ headerShown: false }}
        component={ChallengesListScreen}
      />
      <Stack.Screen
        name="Event Challenges List"
        options={{ headerShown: false }}
        component={EventChallengesView}
      />
      <Stack.Screen
        name="Event Score Board"
        options={{ headerShown: false }}
        component={EventScoreBoardView}
      />
      <Stack.Screen
        name="Game Challenges List"
        options={{ headerShown: false }}
        component={GameChallengesListView}
      />
      <Stack.Screen
        name="Event Challenges Summary"
        options={{ headerShown: false }}
        component={EventChallengesSummaryView}
      />
    </Stack.Navigator>
  );
};

export const UserSettingStack = () => {
  return (
    <Stack.Navigator initialRouteName="UserSettingScreen">
      <Stack.Screen
        name="UserSettingScreen"
        options={{ headerShown: false }}
        component={UserSettingScreen}
      />
    </Stack.Navigator>
  );
};

export const EventInfoStack = () => {
  return (
    <Stack.Navigator initialRouteName="JoinEventScreen" headerMode={"none"}>
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="JoinEventScreen"
        component={JoinEventScreen}
      />

      <Stack.Screen name="FullChannel" component={FullChannelRoom} />

      {/* <Stack.Screen
        options={{ gestureEnabled: false }}
        name="WatchEventScreen"
        component={WatchEventScreen}
      /> */}
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="PlayerListScreen"
        component={PlayerListScreen}
      />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="PlayerProfileScreen"
        component={PlayerProfileScreen}
      />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="EventInfoScreen"
        component={EventInfoScreen}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="AddNewContestScreen"
        component={AddNewContestScreen}
      />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="CreateContestTypeScreen"
        component={CreateContestScreen}
        initialParams={{ fromEdit: true }}
      />
      <Stack.Screen name="ContestInfoScreen" component={ContestInfoScreen} />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="EventPaymentSignupScreen"
        component={EventPaymentSignupScreen}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="EPCreditCardScreen"
        component={EPCreditCardScreen}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="EPConfirmationScreen"
        component={EPConfirmationScreen}
      />
    </Stack.Navigator>
  );
};
export const EventStack = () => {
  return (
    <Stack.Navigator initialRouteName="CreateEventScreen" headerMode={"none"}>
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="CreateEventScreen"
        component={CreateEventScreen}
      />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="ContestTypeScreen"
        component={ContestTypeScreen}
      />
      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="CutomizeContestScreen"
        component={CutomizeContestScreen}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="CreateContestScreen"
        component={CreateContestScreen}
        initialParams={{ fromEdit: false }}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="EventProfileCreateScreen"
        component={EventProfileCreateScreen}
      />

      <Stack.Screen
        options={{ gestureEnabled: false }}
        name="EventFeesScreen"
        component={EventFeesScreen}
      />
    </Stack.Navigator>
  );
};

const AuthStackNav = createStackNavigator();
export const AuthStack = () => {
  return (
    <AuthStackNav.Navigator
      initialRouteName={"LoginScreen"}
      headerMode={"none"}
      //screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name={"LoginScreen"}
        component={LoginScreen}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen name={"RegisterScreen"} component={RegisterScreen} />
      <Stack.Screen
        name="RegisterPageNew"
        component={RegisterPageNew}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={"CreateInitialProfileScreen"}
        component={CreateInitialProfileScreen}
      />
      <Stack.Screen
        name={"ResetPasswordScreen"}
        component={ResetPasswordScreen}
      />
      <Stack.Screen
        name={"TermsConditionsScreen"}
        component={TermsConditionsScreen}
      />
      <Stack.Screen
        name={"PrivacyPolicyScreen"}
        component={PrivacyPolicyScreen}
      />
    </AuthStackNav.Navigator>
  );
};

const CharitiesStackNav = createStackNavigator();
export const CharitiesStack = () => {
  return (
    <CharitiesStackNav.Navigator
      initialRouteName={"ViewCharityScreen"}
      headerMode={"none"}
    >
      <CharitiesStackNav.Screen
        options={{ gestureEnabled: false }}
        name="CreateCharityScreen"
        component={CreateCharityScreen}
      />
      <CharitiesStackNav.Screen
        name={"ViewCharityScreen"}
        component={ViewCharityScreen}
      />
      <CharitiesStackNav.Screen
        name={"ViewAthleteScreen"}
        component={ViewAthleteScreen}
      />
      <CharitiesStackNav.Screen
        name={"EditCharityScreen"}
        component={EditCharityScreen}
      />
    </CharitiesStackNav.Navigator>
  );
};
