import React, { memo } from 'react';
import { View, TextInput, Text } from 'react-native';
import { Input } from 'react-native-elements';

import Styles from './indexCss';

const TextInputComponent = (props) => {
    const {
        containerStyle = {},
        placeholder = "Placeholder",
        onChangeText,
        value = "",
        inputStyle = {},
        multiline = false,
        isNumeric = false,
        editable = true,
        disabledView = false
    } = props;
    // return null;
    return (
        <View style={[Styles.inputViewContainerStyle, containerStyle]}>
            {
                disabledView ? 
                <Text style={Styles.disabledViewTextStyle}>
                    {value}
                </Text>
                : <TextInput
                        editable={editable}
                        keyboardType={isNumeric ? 'numeric' : 'default'}
                        blurOnSubmit={true}
                        placeholderTextColor={"grey"}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        style={[Styles.textInputStyle, inputStyle]}
                        returnKeyType='default'
                        multiline={multiline}
                        textAlignVertical={'top'}
                        
                    />
            }

        </View>
    );
    return (
        <View style={[Styles.inputViewContainerStyle, containerStyle]}>
            <Input
                multiline={true}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={[Styles.inputStyle, { ...inputStyle }]}
                inputContainerStyle={{ borderBottomWidth: 0 }} />
        </View>
    );
}

export default TextInputComponent;