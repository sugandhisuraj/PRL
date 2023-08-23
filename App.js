import { FirebaseNotificationTriggers, NotificationService } from "@classes";
import React, { Component, useEffect, useState, } from "react";
import { Button, Text, View, LogBox } from "react-native";

LogBox.ignoreAllLogs();

class SeprateModelTest {
  listeners = [];
  count = 1;

  onAddCount = () => {
    this.count++;
    this.updateListeners();
  };
  updateListeners = () => {
    this.listeners.map((l) => l());
  };
  InitModel = (shouldListen = true) => {
    const [state, setState] = useState({});
    useEffect(() => {
      if (shouldListen) {
        this.listeners.push(() => {
          setState(() => ({}));
        });
      }
      return () => {
        console.log("UN-MOUNTED");
      };
    }, []);

    return this;
  };
}
let SeperateModel = new SeprateModelTest();
const Demo = () => {
  const Model = SeperateModel.InitModel(true);
  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Text>CLICK - {`${Model.count}`}</Text>
      <Button
        title={"Press Me"}
        onPress={() => {
          Model.onAddCount();
        }}
      />
    </View>
  );
};

const TEST = () => {
  const [show, setShow] = useState(false);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {show && <Demo />}
      <Button
        style={{ marginTop: 30 }}
        title={"SHOW"}
        onPress={() => setShow((i) => !i)}
      />
    </View>
  );
};
export default TEST;
class App extends Component {
  componentDidMount() {
    this.notificationService = new NotificationService((token) => {
      console.log("TOKEN_INITIATED- ", token);
      //this.props.initFcmDispatch(token, this.notificationService);
    });
    this.notificationService.checkPermission();
    this.notificationService.registerNotifications();
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          title={"Click me"}
          onPress={() => {
            FirebaseNotificationTriggers.sentWelcomeNotification(
              FirebaseNotificationTriggers.welcome()
            );
          }}
        />
      </View>
    );
  }
}

//export default (App);
