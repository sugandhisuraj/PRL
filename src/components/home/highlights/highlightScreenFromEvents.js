//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const HightLightScreenFromEvents = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Name of Charity Fundraiser Event</Text>
            <Text>Fundraiser Description</Text>
            <Icon name="crosshairs-gps" size={18} />
            <Text>Location of Event</Text><Icon name="" size={18} />
            <Icon name="account-group" />
            <Text>Number of players</Text>
            <View>
                <Icon name="trophy" size={55} />
                <Text>Name of Player</Text>
                <Text>Amount Raised</Text>
            </View>
            <Text>Bracket - Best of #</Text>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
    }
});

//make this component available to the app
export default HightLightScreenFromEvents;
