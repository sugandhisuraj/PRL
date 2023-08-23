// External Imports
import React, { useRef, useState, useImperativeHandle } from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import PropTypes from 'prop-types';


// Internal Imports
import styles from './indexCss';
import ModalDropdown from '../ModalDropDown';
import Feather from 'react-native-vector-icons/Feather';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
import { ref } from 'yup';
Feather.loadFont();


const FilterDropdown = React.forwardRef((props,refs) => {

    const {
        label='Add Label',
        items,
        onSelect,
        placeholder,
        width,
        height,
        containerStyle = {},
        dropdownContainer = {},
        showBorders = true,
        rootContainerStyle = {}
    } = props;
    const [resetD, setresetD] = useState(undefined);
    const [expanded, setExpanded] = useState(false);
    const dropdownRef = useRef();
    useImperativeHandle(refs, ()=>({
        reset: () => {
 
            setresetD(placeholder);
            setTimeout(()=>{
                dropdownRef.current.resetButton('Select Contest Type');
                setTimeout(()=>{
                    setresetD(undefined);
                }, 500);
            }, 200);
 
        }
    }));
    const renderButtonText = rowData => {
        if(resetD) {
            return placeholder;
        }
        return rowData?.value;
    };

    const renderDropdownItem = rowData => {
        return (
            <View style={styles.dropdownItemContainer}>
                <Text style={styles.dropdownText}>
                    {rowData?.value}
                </Text>
            </View>
        );
    };

    const toggleIcon = () => {
        setExpanded(!expanded);
        dropdownRef.current.show();
    };

    return (
        <View style={rootContainerStyle}>
        <Text style={styles.labelTextStyle}>
            {label}
        </Text>
        <View style={[
            styles.container,
            containerStyle,
            width && { width },
            height && { height },
            !showBorders && { borderWidth: 0 }
        ]}>
            <ModalDropdown   
                ref={dropdownRef}
                style={[styles.dropdownContainer, dropdownContainer]}
                textStyle={styles.dropdownSelectedText}
                dropdownStyle={[styles.dropdown, width && { width: width * .98 }]}
                defaultValue={placeholder}
                allDefValue={resetD}
                options={items}
                renderButtonText={renderButtonText}
                renderRow={renderDropdownItem.bind(this)}
                onSelect={index => onSelect(items[index])}
                onDropdownWillShow={() => {
                    Keyboard.dismiss();
                    setExpanded(true);
                }}
                onDropdownWillHide={() => {
                    Keyboard.dismiss();
                    setExpanded(false);
                }}
            />
            <TouchableOpacity onPress={() => {
                Keyboard.dismiss();
                toggleIcon();
            }}>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} style={styles.arrowStyle} />
            </TouchableOpacity>
        </View>
        </View>
    );
});

FilterDropdown.propTypes = {
    items: PropTypes.array.isRequired,
    selectedValue: PropTypes.object,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func,
};

FilterDropdown.defaultProps = {
    items: [],
    selectedValue: null,
    placeholder: '',
    onSelect: () => { },
};

export default FilterDropdown;
