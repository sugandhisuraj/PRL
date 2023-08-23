import React from 'react';
import { Image, View } from 'react-native';

import Styles from './indexCss';

const TEST_IMG = 'https://miro.medium.com/max/2400/0*xMaFF2hSXpf_kIfG.jpg';
const ImageView = (props) => {
    let {
        uri = TEST_IMG
    } = props;
    if (!uri || uri.length == 0) {
        uri = TEST_IMG;
    }
    return (
        <View style={Styles.imageViewContainer}>
            <Image
                source={{ uri }}
                style={Styles.imageStyle} />
        </View>
    );
}

export default ImageView;