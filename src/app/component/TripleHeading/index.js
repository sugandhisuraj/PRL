import React, { memo } from 'react';
import { View, Text } from 'react-native';


import Styles from './indexCss';
const TripleHeading = (props) => {
    const {
        left = "Left",
        right = "Right",
        center = "Center",
        containerStyle = {},
    } = props;
    const RenderText = ({text = ""}) => {
        return (
            <Text style={Styles.placeholderTextStyle}>
                {text}
            </Text>
        );
    }
    return (
        <View
            style={[Styles.container, containerStyle]}>
            <RenderText text={left} />
            <RenderText text={center} />
            <RenderText text={right} />
        </View>

    );
}

export default memo(TripleHeading);
