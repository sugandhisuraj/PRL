import React, { memo } from 'react';
import {View,Text} from 'react-native';

import TextAreaInput from '../TextAreaInput';
import Styles from './indexCss';
const TextInputHeading = (props) => {
    const {
        heading = "Add Heading", 
        placeholder = "Add Placeholder",
        value = '',
        onChangeText = () => { },
        containerStyle = {},
        textInputStyle = {},
        editable = true
    } = props;
    return( 
        <View style={[Styles.container, containerStyle]}>
            <Text style={Styles.paymentTermTextStyle}>
                        {heading}
                    </Text>
                    <TextAreaInput
                        editable={editable}
                        textInputStyle={[Styles.eventDescriptionTextStyle, textInputStyle]}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                    />
        </View>
    );
}

export default memo(TextInputHeading);