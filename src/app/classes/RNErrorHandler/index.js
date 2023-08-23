
import { Alert } from 'react-native';

import RNRestart from 'react-native-restart';
import { setJSExceptionHandler } from "react-native-exception-handler";
class RNErrorHandler {

    jsExceptionHandler = (e, isFatal) => {
        //console.log("JS Error ", e, "isfatal:", isFatal);
        //crashlytics().log(e);
        if (isFatal) {
            Alert.alert(
                "Unexpected error occurred",
                `Error: ${isFatal ? "Fatal:" : ""} ${e.name} ${e.message}
                We will need to restart the app.`,
                [
                    {
                        text: "Cancel",
                        onPress: () => {
                            //RNRestart.Restart();
                        },
                    },
                    {
                        text: "Restart",
                        onPress: () => {
                            RNRestart.Restart();
                        },
                    },
                ]
            );
        } else {
            //console.log("--------------------------", e, "isfatal:", isFatal);
        }
    };
    init = () => {
        setJSExceptionHandler((error, isFatal) => {
            this.jsExceptionHandler(error, isFatal);
        }, true);
    }
    test = () => {
        // try{
        throw new Error('TEST');
        // }catch(error){
        //     console.log('HANDLERD');
        // }

    }
}

export default new RNErrorHandler();