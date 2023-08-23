import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../../../utils/tools';
import { Button, Card, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const InviteScreen = () => {
    const amounts = [
        {
            audience: '$5',
            Particpant: '$15',
            Sponsor: '$50'
        }]

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Book Event Screen</Text>
                <Text style={styles.text}>Description of Event</Text>
                <MaterialIcon name="compass-outline" style={{ color: Colors.white }} />
                <Text style={styles.text}>Location of Event</Text>
                <MaterialIcon name="navigation" style={{ color: Colors.white }} />
                <Text style={styles.text}>Directions</Text>
                <MaterialIcon name="basketball" style={{ color: Colors.white }} />
                <Text style={styles.text}>Name of competition</Text>
                <MaterialIcon name="account-multiple" style={{ color: Colors.white }}></MaterialIcon>
                <Text style={styles.text}>Participants</Text>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <Card style={styles.card}>
                        <Card.Title>Audience</Card.Title>
                        <Text>$5</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Title>Participant</Card.Title>
                        <Text>$15</Text>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Title>Sponsor</Card.Title>
                        <Text>$50</Text>
                    </Card>
                </View>
            </View>

            <View>
                <Button
                    title="Learn More"
                    color={Colors.black}
                    backgroundColor={Colors.white}
                />
                <Button
                    title="Create Account"
                    color={Colors.black}
                    backgroundColor={Colors.white}
                />
                <Button
                    title="How it Works"
                    color={Colors.black}
                    backgroundColor={Colors.white}
                />
            </View>
        </>
    )
}

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
        color: Colors.white,
        fontSize: 18,
    },
    card: {
        borderColor: Colors.white,
        backgroundColor: Colors.blue
    }
})

export default InviteScreen;