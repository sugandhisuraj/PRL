import React, {memo, Fragment} from 'react';
import { View, TouchableOpacity,Image, Text } from 'react-native';
import { Button } from 'react-native-elements';

import Styles from './indexCss';

const TouchableButton = (props) => {
    const {
        containerStyle = {},
        title = "Title",
        type, 
        onPress,
        disabled = false,
        backgroundColor,
        titleStyle = {},
        icon = null,
        iconStyle = {},
        propButtonStyle = {}
    } = props;
    let buttonStyle = {};
    if(type) {
        buttonStyle = Styles[type];
    }
    if (type == 'imgBtn') {
        return (
            <TouchableOpacity 
            onPress={onPress}
            style={[Styles.containerStyle, containerStyle]}>
                {
                    icon && <Image source={icon} style={[Styles.iconStyle, iconStyle]} />
                }
                <Text style={[Styles.textTitleStyle]}>{title}</Text>
            </TouchableOpacity>
        );
    }
    if (type == 'prevStep') {
        return (
            <TouchableOpacity 
            onPress={onPress}
            style={[Styles.prevStep, containerStyle]}> 
                <Text style={[Styles.prevTitleStyle, titleStyle]}>{title}</Text>
            </TouchableOpacity>
        );
    }
    return(
        <View style={[containerStyle]}>
            <Button 
                disabled={disabled}
                onPress={onPress}
                buttonStyle={[buttonStyle, backgroundColor && {backgroundColor}, propButtonStyle]}
                title={title}
                titleStyle={[Styles.titleStyle, titleStyle]}
            />
        </View>
    );
}

export default memo(TouchableButton);