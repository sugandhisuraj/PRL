//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';

// create a component
const UpcomingGameScreen = () => {
    return (
        <View style={styles.container}>
            <View>
                <Text styl={styles.title}>Name of Charity Event Fundraiser</Text>
                <Text style={styles.text}>Tournament Round</Text>
                <Text style={styles.text}>Date of tournament</Text>
            </View>
            <View style={styles.players}>
                <Avatar>
                    <Text style={styles.text}>Name</Text>
                    <Text style={styles.text}>Nickname</Text>
                    <Text style={styles.text}>Record</Text>
                    <Text style={styles.text}>Winning Streak</Text>
                    <Text style={styles.text}>Highest points</Text>
                    <Text style={styles.text}>Lowest Points</Text>
                    <Text style={styles.text}>Average PPG</Text>
                </Avatar>
                <Avatar>
                    <Text style={styles.text}>Name</Text>
                    <Text style={styles.text}>Nickname</Text>
                    <Text style={styles.text}>Record</Text>
                    <Text style={styles.text}>Winning Streak</Text>
                    <Text style={styles.text}>Highest points</Text>
                    <Text style={styles.text}>Lowest Points</Text>
                    <Text style={styles.text}>Average PPG</Text>
                </Avatar>
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
        backgroundColor: '#2c3e50',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 25
    },
    text: {
        fontSize: 18
    },
    players: {
        flexDirection: 'row'
    }
});

//make this component available to the app
export default UpcomingGameScreen;
