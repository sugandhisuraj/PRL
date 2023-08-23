import React from "react";
import {
    View,
    Text,
    ActivityIndicator
} from "react-native";

const LoadingOverlayView = () => {
    return (
        <View style={{
            width: '100%',
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <ActivityIndicator 
                color="white"/>
            <Text style={{
                marginTop: 10,
                color: 'white'
            }}>
                Loading...
            </Text>
        </View>
    );
}

export default LoadingOverlayView;