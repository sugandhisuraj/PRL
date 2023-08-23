import React, { useRef, useImperativeHandle,forwardRef } from 'react';
import { View, Text } from 'react-native';


import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import Styles from './indexCss';
import CustomModalDropDown from '../CustomModalDropDown';

const SingleHeadingDropdown = forwardRef((props, refs) => {
    const {
        placeholder,
        containerStyle = {},
        items = [],
        onSelect = () => { },
        backgroundColor = null,
        rightComponent = () => <View />
    } = props;
    const modalRef = useRef();

    useImperativeHandle(refs, ()=>({
        reset: () => {
            modalRef.current.reset();
        }
    }));
    return (
        <View
            style={[Styles.container, backgroundColor && { backgroundColor }, containerStyle]}>
            <CustomModalDropDown
                ref={modalRef}
                width={getWp(230)}
                height={getWp(35)}
                items={items}
                placeholder={placeholder}
                onSelect={onSelect}
                containerStyle={[Styles.dropdownStyle, backgroundColor && { backgroundColor }]}
                dropdownContainer={[Styles.dropdownContainerStyle, backgroundColor && { backgroundColor }]}
                showBorders={false}
            />
            {
                rightComponent ?
                    <View style={Styles.rightComponentStyle}>
                        {rightComponent()}
                    </View> : null
            }
        </View>

    );
});

export default (SingleHeadingDropdown);