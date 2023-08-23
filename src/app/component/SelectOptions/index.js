import React, { memo } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';

import Style from './indexCss';

const SelectOptions = (props) => {
    const {
        containerStyle = {},
        title = 'Add Title',
        options = [],
        onOptionsPress = () => { },
        keyProp = undefined,
        scrollEnabled = undefined,
    } = props;
    const Options = (item, index) => {
        return (
            <TouchableOpacity
                style={Style.optionContainer}
                onPress={() => onOptionsPress(item, index)}>
                <View
                    style={[Style.checkboxStyle, item?.isSelected && Style.checkBoxFillStyle]} />
                <Text style={Style.optionItemTextStyle}>{keyProp ? item[keyProp] : item.name}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <View style={[Style.container, containerStyle]}>
            <Text style={Style.titleTextStyle}>{title}</Text>
            { scrollEnabled ?
                <ScrollView   
                showsVerticalScrollIndicator={false}
                style={Style.scrollOContainer}>
                    {options.map(Options)}
                </ScrollView>
                : <View style={Style.oContainer}>
                    {options.map(Options)}
                </View>
            }
        </View>
    );
}

export default (SelectOptions);