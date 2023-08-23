import React, { memo } from 'react';
import { TextInput, View } from 'react-native';

import Styles from './indexCss';

const TextAreaInput = (props) => {
    const {
        placeholder,
        textInputStyle = {},
        value = "",
        onChangeText,
        editable = true
    } = props;
    return (
        <TextInput
            editable={editable}
            textAlignVertical={'top'}
            numberOfLines={6}
            multiline={true}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            style={[Styles.textInputStyle, textInputStyle]}
        />
    );
}

export default memo(TextAreaInput);