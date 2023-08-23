import React, { memo } from 'react';
import { TextInput, View, Text } from 'react-native';

import Styles from './indexCss';

const TextAreaHeading = (props) => {
    const {
        containerStyle = {},
        placeholder = "Add Placeholder",
        textInputStyle = {},
        value = "Attach Value",
        onChangeText,
        backgroundColor = null,
        heading = '',
        editable = false,
        showBorder = false,
        headingContainerStyle = {},
        headingTextStyle = {}
    } = props;
    return (
        <View style={[Styles.container, containerStyle]}>
            {
                heading && heading.length > 0 ? <View style={[
                    Styles.headingContainerStyle,
                    backgroundColor && { backgroundColor },
                    headingContainerStyle
                ]}>
                    <Text style={[Styles.headingTextStyle, headingTextStyle]}>
                        {heading}
                    </Text>
                </View> : null
            }
            <View style={[showBorder && Styles.borderAndShadowStyle,]}>
            <TextInput
                editable={editable}
                textAlignVertical={'top'}
                numberOfLines={3}
                multiline={true}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                style={[
                    !editable ? Styles.textAreaInputDisabledStyle : Styles.textInputStyle,
                    textInputStyle
                ]}
            />
            </View>
        </View>
    );
}

export default memo(TextAreaHeading);