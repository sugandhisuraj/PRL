import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text } from 'react-native';
import App from './src/App';
import AppT from './App';
import { Provider} from 'react-redux';

import { Provider as PaperProvider} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import Store from './src/store';

// import firebase from 'react-native-firebase';

// firebase.messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log("Message handled in the background!", remoteMessage);
//   });



const toastConfig = {
    info: (internalState) => {
        <View style={{ height: 60, width: '100%', backgroundColor: 'pink' }}>
            <Text>{internalState.text1}</Text>
        </View>
    }
}

const reduxApp = () => (
    <Provider store={Store}>
        <PaperProvider>
            <App />
            <Toast config={toastConfig} ref={(ref) => Toast.setRef(ref)} />
        </PaperProvider>
    </Provider>
)

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
 
registerRootComponent(reduxApp);
//registerRootComponent(() => <AppT defaultData={10} />);

/*
ANDROID - com.prl
IOS-DEV -   com.myplayerrecreation.prl 
IOS-DEV - com.app.prlleague
IOS-PROD -  com.app.myMVPprl


<!-- <?xml version="1.0" encoding="utf-8"?>

<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
<item android:drawable="@color/splashscreen_background"/>
</layer-list>-->
*/