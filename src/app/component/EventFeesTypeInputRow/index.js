import React,{memo} from 'react';
import {Text,TextInput,View,TouchableOpacity} from 'react-native';

import Styles from './indexCss';

const EventFeesTypeInputRow = (props) => {
    const {
        text = 'Add Text',
        value = 0,
        onChangeText = () => { },
        checked = false,
        onCheckboxPress
    } = props;
    return (
        <View style={Styles.container}>
            <View style={Styles.leftViewStyle}>
            <TouchableOpacity 
            onPress={onCheckboxPress}
            style={[Styles.checkBoxStyle, checked ? Styles.checkedStyle : Styles.unCheckStyle]}>

            </TouchableOpacity>
            <Text style={Styles.textStyle}>{text}</Text>
            </View>

            <View style={Styles.rightViewStyle}>
                <Text style={Styles.dollarTextStyle}>$</Text>
            <TextInput 
                editable={checked}
                keyboardType={'numeric'}
                style={Styles.textInputStyle}
                value={value}
                onChangeText={onChangeText}
            />
            </View>
        </View>
    );
}

export default memo(EventFeesTypeInputRow);