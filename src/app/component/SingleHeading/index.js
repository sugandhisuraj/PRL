import React, { memo } from 'react';
import { View, Text } from 'react-native';


import Styles from './indexCss';
const SingleHeading = (props) => {
    const {
        placeholder = "",
        containerStyle = {},
        textColor = 'black',
        onRightComponent = null,
        onLeftComponent = null,
        nullPlaceholder = false
    } = props;
    const RenderPlaceholder = () => {
        return <Text style={[Styles.placeholderTextStyle, { color: textColor }]}>
            {placeholder}
        </Text>
    }
    return (
        <View style={[Styles.container, containerStyle]}>
            {
                onLeftComponent && onLeftComponent(<RenderPlaceholder />)
            }
            {
                !nullPlaceholder  && <RenderPlaceholder />
            }
            {
                onRightComponent && onRightComponent()
            }
        </View>

    );
}

export default memo(SingleHeading);
