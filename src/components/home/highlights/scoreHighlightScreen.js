//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../utils/tools';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// create a component
const ScoreHighlightScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Name of Charity Fundraiser Event</Text>
            <Text>Round number</Text>
            <Text>Date played</Text>
            <Icon name="trophy" size={45} color={Colors.gold}></Icon>
            <Text>Name of winner(nickname)</Text>
            <Button
                title="Next Game"
                onPress={() => alert('Next game')}
            />
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <Avatar>
                    <Text style={styles.title}>Player Name</Text>
                    <Text>nickname</Text>
                </Avatar>

                <Avatar>
                    <Text style={styles.title}>Player Name</Text>
                    <Text>nickname</Text>
                </Avatar>
            </View>
            <View>
                <Text style={styles.title}>Winner's Quote</Text>
                <Text style={styles.quote}>Quote from player</Text>
                <Text style={styles.title}>Game Description</Text>
                <Text style={styles.quote}>About the game</Text>
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
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    quote: {
        fontSize: 18
    }
});

//make this component available to the app
export default ScoreHighlightScreen;
