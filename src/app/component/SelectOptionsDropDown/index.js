import React, { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import AntDesign from 'react-native-vector-icons/AntDesign';

import Style from './indexCss';
AntDesign.loadFont();
const SelectOptionsDropDown = (props) => {
    const {
        containerStyle = {},
        title = 'Add Title',
        options = [],
        onOptionsPress = () => { },
        keyProp = undefined,
        scrollEnabled = undefined,
        customSelection = {}
    } = props;
    const [collapse, setCollapse] = useState(true);
    const Options = (item, index) => {
        let isItemSelected = false;
        if(customSelection && (item[customSelection?.optionKey] == customSelection?.selectedItem)) {
            isItemSelected = true; 
        }
        return (
            <TouchableOpacity
                style={[Style.optionContainer, isItemSelected && Style.selectedOptionStyle]}
                onPress={() => onOptionsPress(item, index)}>
                <Text style={[Style.optionItemTextStyle, isItemSelected && Style.selectedOptionTextStyle]}>{keyProp ? item[keyProp] : item.name}</Text>
            </TouchableOpacity>
        );
    }
    return (
        <View style={[Style.container, containerStyle]}>
            <TouchableOpacity
                onPress={() => setCollapse(i => !i)}
                style={[Style.childContainer]}>
                <Text style={Style.titleTextStyle}>{title}</Text>
                <AntDesign name={collapse ? 'down' : 'up'} style={Style.iconStyle} />
            </TouchableOpacity>
            <Collapsible collapsed={!collapse} style={Style.collapseViewStyle}>
                <ScrollView>
                    {options.map(Options)}
                    <View style={Style.someMargin} />
                </ScrollView>
            </Collapsible>
        </View>

    );
}

export default (SelectOptionsDropDown);