import React, { memo } from 'react';
import { View, Text } from 'react-native';


import Styles from './indexCss';
const DoubleHeading = (props) => {
    const {
        textColor = undefined,
        left,
        right,
        containerStyle = {}
    } = props;
    const RenderText = ({text = ""}) => {
        return (
            <Text style={[Styles.placeholderTextStyle, textColor && { color: textColor }]}>
                {text}
            </Text>
        );
    }
    return (
        <View
            style={[Styles.container, containerStyle]}>
            <RenderText text={left} />
            <RenderText text={right} />
        </View>

    );
}

export default memo(DoubleHeading);
