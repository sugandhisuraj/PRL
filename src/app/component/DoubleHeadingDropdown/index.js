import React, { memo } from 'react';
import { View, Text, ScrollView } from 'react-native';


import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import Styles from './indexCss';
import CustomModalDropDown from '../CustomModalDropDown';
import { Platform } from 'react-native';

const DoubleHeadingDropdown = (props) => {
    const {
        leftPlaceHolder = "",
        containerStyle = {},
        items = [],
        onSelect = () => { },
        backgroundColor = null,
        rightPlaceHolder = "",
        type = ''
    } = props;
    return (
        <View
            style={[Styles.container, backgroundColor && { backgroundColor }, containerStyle]}>
            <CustomModalDropDown
                width={type == 'SINGLE' ? getWp(300) : getWp(210)}
                height={getWp(35)}
                items={items}
                placeholder={leftPlaceHolder}
                onSelect={onSelect}
                containerStyle={[Styles.dropdownStyle, backgroundColor && { backgroundColor }]}
                dropdownContainer={[Styles.dropdownContainerStyle, backgroundColor && { backgroundColor }]}
                showBorders={false}
            />
            {
                type == 'SINGLE' ?
                    null :
                    <ScrollView  
                    horizontal
                    showsHorizontalScrollIndicator={false}>
                        <Text style={{ color: 'black', fontWeight: '600',fontSize: 15,top: Platform.OS == 'android' ? -4 : -1 }}>
                            {rightPlaceHolder}
                        </Text>
                    </ScrollView>
            }

        </View>

    );
}

export default (DoubleHeadingDropdown);