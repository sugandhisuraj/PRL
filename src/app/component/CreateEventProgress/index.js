import React, { Fragment, memo } from 'react';
import { Text, View } from 'react-native';

import Styles from './indexCss';

const CreateEventProgress = (props) => {

    const {
        containerStyle = {},
        length = 4,
        selectedIndex = 1
    } = props;

    const RenderProgress = () => {
        return (
            <Fragment>{
                [...new Array(length)].map((d, i) => {
                    return (
                        <View style={[Styles.circleView,
                        selectedIndex == i + 1 && Styles.selectedCircleView]}
                        />
                    );
                })
            }</Fragment>
        );
    }
    return (
        <View style={[Styles.containerStyle, containerStyle]}>
            <RenderProgress />
        </View>
    );
}

export default memo(CreateEventProgress);