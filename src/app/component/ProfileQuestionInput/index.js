import React, { memo } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import TextInput from '../TextInput';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import Styles from './indexCss';

const ProfileQuestionInput = (props) => {
    const {
        containerStyle = {},
        question = 'Add Question',
        placeholder = 'Add Place Holder',
        onChangeText = () => { },
        value = '',
        editable = false
    } = props;
    return (
        <View style={[Styles.container, containerStyle]} onTou>
            <Text style={Styles.questionTextStyle}>{question}</Text>
            <TextInput
                editable={true}
                placeholder={placeholder}
                containerStyle={Styles.textInputStyle}
                value={value}
                onChangeText={onChangeText}
                disabledView={!editable}
            />
        </View>
    );
}

export default memo(ProfileQuestionInput);