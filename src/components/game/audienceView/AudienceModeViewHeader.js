import React from "react";
import {
  View,
  Text,
  TouchableOpacity
} from "react-native";

const AudienceModeViewHeader = (props) => {
    
    return (
        <View style={{ height: 40, marginTop: 10, justifyContent: 'center' }}>
          <View style={{ backgroundColor: 'blue', height: 30 }}>
            <View style={{ height: 30, justifyContent: 'center' }}>
                <Text style={{ color: 'white', textAlign: 'center' }}>
                    My Picks
                </Text>
                <TouchableOpacity style={{ position: "absolute", width: 30, height: 30, right: 0, justifyContent: 'center' }}
                    onPress={() => props.onCreatePick()}>
                    <Text style={{ color: 'white', textAlign: 'center', fontSize: 20 }}>+</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
    );
};

export default AudienceModeViewHeader;