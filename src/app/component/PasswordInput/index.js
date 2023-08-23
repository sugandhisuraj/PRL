import React, { memo, useState } from 'react';
import { View, TouchableOpacity, Keyboard } from 'react-native';
import { Input } from 'react-native-elements';

import Styles from './indexCss';
import Entypo from 'react-native-vector-icons/Entypo';

Entypo.loadFont();

const PasswordInput = (props) => {
    const [isSecure, setIsSecure] = useState(true);
    const {
        containerStyle = {},
        placeholder = "Placeholder",
        onChangeText,
        value = "",
        disabled = false
    } = props;
    return (
        <View style={[Styles.inputViewContainerStyle, containerStyle]}>
            <Input
                disabled={disabled}
                value={value}
                secureTextEntry={isSecure}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={[Styles.inputStyle]}
                textContentType={'none'}
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                inputContainerStyle={{ borderBottomWidth: 0 }} />

            <TouchableOpacity onPress={() => setIsSecure(s => !s)} style={Styles.eyeContainer}>
                <Entypo name={!isSecure ? "eye" : "eye-with-line"} style={Styles.eyeStyle} />
            </TouchableOpacity>
        </View>
    );
}

export default memo(PasswordInput);