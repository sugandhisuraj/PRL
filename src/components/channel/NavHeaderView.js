import React from "react";
import {
    View,
    Text,
    TouchableOpacity
} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const NavHeaderView = (props) => {

    const { 
        onBack
    } = props;

    return (
        <View style={{ height: 40, alignItems: 'center', padding: 10, flexDirection: 'row' }}>
            <TouchableOpacity style={{ width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}
                onPress={onBack}>
                <MaterialIcons size={24} name="chevron-left" color='white'/>
            </TouchableOpacity>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 20
                }}>
                    Full channel room
                </Text>
            </View>
            <View style={{width: 40}} />
        </View>
    );
};

export default NavHeaderView;