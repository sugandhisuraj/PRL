//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../utils/tools';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// create a component
const HightlightScreenFromPrfile = () => {
    return (
        <View style={styles.container}>
            <Text>Name of Event Fundraiser</Text>
            <Text>Descritpion of the fundraiser</Text>
            <Icon name="crosshairs-gps" size={22}></Icon>
            <Text>Location of Event</Text><Icon name="navigation" size={20}></Icon>
            <Icon name="basketball" size={22}></Icon>
            <Text>Game Name</Text>
            <Icon name="account-group" size={22}></Icon>
            <Text>Number of Players</Text>
            <View style={styles.logo}>
                <Icon name="trophy" size={50}></Icon>
                <Text>Name of player</Text>
                <Text>Amount Raised</Text>
            </View>
            <View>
                <Text style={styles.title}>Bracket for event</Text>
                <Text>Placeholder - 4</Text>
                <Text>Placeholder - 1</Text>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue,
    },
    ttle: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    logo: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

//make this component available to the app
export default HightlightScreenFromPrfile;
