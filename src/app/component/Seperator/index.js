import React from 'react';
import { View, StyleSheet } from 'react-native';
import { getHp } from '@utils';

const Seperator = ({ style = {} }) => {

    return (
        <View style={[Styles.container, style]} />
    );
}

const Styles = StyleSheet.create({
    container: {
        width: "100%",
        borderBottomColor: "#F2F2F2",
        borderBottomWidth: 1,
        marginVertical: getHp(25)
    }
})

export default Seperator;