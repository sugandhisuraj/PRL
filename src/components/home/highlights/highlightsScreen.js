//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// create a component
const HightlightsScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Game Highlights</Text>
            <View style={styles.videoHighlight}>
                <Text>Video Description</Text>
                <Text>Video Player Placeholder</Text>
                <Text>Published by (name from database)</Text>
                <Avatar>
                    <Text>score for player 1</Text>
                </Avatar>
                <Avatar>
                    <Text>Score for player 2</Text>
                </Avatar>
                <Text>When the highlight took place</Text>
                <Text>Time</Text>
            </View>
            <View style={styles.videoHighlight}>
                <Text>Video Description</Text>
                <Text>Video Player Placeholder</Text>
                <Text>Published by (name from database)</Text>
                <Avatar>
                    <Text>score for player 1</Text>
                </Avatar>
                <Avatar>
                    <Text>Score for player 2</Text>
                </Avatar>
                <Text>When the highlight took place</Text>
                <Text>Time</Text>
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
    videoHighlight: {

        flexDirection: 'row'
    }
});

//make this component available to the app
export default HightlightsScreen;
