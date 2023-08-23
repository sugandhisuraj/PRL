//import liraries
import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Colors } from '../../../../utils/tools';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// create a component
const ScoresScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Name of Charity Fundraiser Event</Text>
            <Text style={styles.text}>Round number</Text>
            <Text style={styles.text}>Date played</Text>
            <Icon name="trophy" size={45} color={Colors.gold}></Icon>
            <Text style={styles.text}>Name of winner(nickname)</Text>
            <Button
                title="Next Game"
                onPress={() => alert('Next game')}
            />
            <View style={{ flexDirection: 'row', paddingTop: 45, paddingBottom: 150 }}>
                <Avatar>
                    <Text style={styles.title}>Player Name</Text>
                    <Text style={styles.text}>nickname</Text>
                </Avatar>

                <Avatar>
                    <Text style={styles.title}>Player Name</Text>
                    <Text style={styles.text}>nickname</Text>
                </Avatar>
            </View>
            <View style={{ paddingTop: 50 }}>
                <Text style={styles.title}>Winner's Quote</Text>
                <Text style={styles.quote}>Quote from player</Text>
                <Text style={styles.title}>Game Description</Text>
                <Text style={styles.quote}>About the game</Text>
            </View>
        </View >
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.blue
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colors.white
    },
    text: {
        color: Colors.white
    },
    quote: {
        fontSize: 18,
        color: Colors.white
    }
});

//make this component available to the app
export default ScoresScreen;
