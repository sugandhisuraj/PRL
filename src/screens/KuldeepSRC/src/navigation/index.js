import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {ROUTES} from './routes.constant';
import {
  EditCharity,
  Charity,
  AddCharity,
  Activity,
  ProfileHistory,
  Player,
} from '../screen';
const PlayerStack = createStackNavigator();
const PlayerNavigator = () => {
  return (
    <PlayerStack.Navigator initialRouteName={ROUTES.PLAYER_LIST}>
      <PlayerStack.Screen
        name={ROUTES.PLAYER_LIST}
        component={Player}
        options={{headerShown: false}}
      />
    </PlayerStack.Navigator>
  );
};
const ActivityStack = createStackNavigator();
const ActivityNavigator = () => {
  return (
    <ActivityStack.Navigator initialRouteName={ROUTES.ACTIVITY}>
      <ActivityStack.Screen
        name={ROUTES.ACTIVITY}
        component={Activity}
        options={{headerShown: false}}
      />
      <ActivityStack.Screen
        name={ROUTES.PROFILE_HISTORY}
        component={ProfileHistory}
        options={{headerShown: false}}
      />
    </ActivityStack.Navigator>
  );
};

const CharityStack = createStackNavigator();
const CharityNavigator = () => {
  return (
    <CharityStack.Navigator initialRouteName={ROUTES.ADD_CHARITY}>
      <CharityStack.Screen
        name={ROUTES.ADD_CHARITY}
        component={AddCharity}
        options={{headerShown: false}}
      />
      <CharityStack.Screen
        name={ROUTES.CHARITY_SCREEN}
        component={Charity}
        options={{headerShown: false}}
      />
      <CharityStack.Screen
        name={ROUTES.EDIT_CHARITY}
        component={EditCharity}
        options={{headerShown: false}}
      />
    </CharityStack.Navigator>
  );
};

const AppStack = createStackNavigator();

const AppNavigator = () => {
  return (
    <AppStack.Navigator initialRouteName={ROUTES.PLAYER_STACK}>
      <AppStack.Screen
        name={ROUTES.PLAYER_STACK}
        component={PlayerNavigator}
        options={{headerShown: false}}
      />
    </AppStack.Navigator>
  );
};

// const AppNavigator = () => {
//   return (
//     <AppStack.Navigator initialRouteName={ROUTES.CHARITY_STACK}>
//       <AppStack.Screen
//         name={ROUTES.CHARITY_STACK}
//         component={CharityNavigator}
//         options={{headerShown: false}}
//       />
//     </AppStack.Navigator>
//   );
// };

// const AppNavigator = () => {
//   return (
//     <AppStack.Navigator initialRouteName={ROUTES.ACTIVITY_STACK}>
//       <AppStack.Screen
//         name={ROUTES.ACTIVITY_STACK}
//         component={ActivityNavigator}
//         options={{headerShown: false}}
//       />
//     </AppStack.Navigator>
//   );
// };

export default AppNavigator;
