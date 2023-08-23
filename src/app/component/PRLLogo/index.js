import React, { memo } from 'react';
import { Image, View } from 'react-native';

import LogoPNG from '@assets/PRLLogo.png';
import LogoSVG from '@assets/prlLogo.svg';

import Styles from './indexCss';

const PRLLogo = (props) => {
    const {
        containerStyle = {},
        imgStyle = {}
    } = props;
    return (
        <View style={[Styles.container, containerStyle]}>
            <LogoSVG 
            height={imgStyle.height}
            width={imgStyle.width}
            style={[Styles.imgStyle, imgStyle]} />
            {/* <Image source={LogoPNG} style={[Styles.imgStyle, imgStyle]} resizeMode={'contain'} /> */}
        </View>
    );
}

export default memo(PRLLogo);