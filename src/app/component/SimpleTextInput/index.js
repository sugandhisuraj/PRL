import React from 'react';
import { TextInput } from 'react-native';
import { Input } from 'react-native-elements';

import Styles from './indexCss';
const SimpleTextInput = (props) => {
    const {
        placeholder
    } = props;
    return (
        <TextInput
            placeholder={placeholder}
            style={Styles.textInputContainer}
        />

    );
}

export default SimpleTextInput;
