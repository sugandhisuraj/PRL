import React, { memo } from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import AppJson from '../../../../app.json';

const AppVersion = (props) => {
    const {
        containerStyle = {},
        textColor = 'white'
    } = props;
    return (
        <View style={[Styles.container, containerStyle]}>
            <Text style={[Styles.versionTextStyle, { color: textColor }]}>App Version - {AppJson.appVersion}</Text>
        </View>
    );
}

const Styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%'
    },
    versionTextStyle: {
        fontSize: FONTSIZE.Text15,
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    }
});
export default memo(AppVersion);