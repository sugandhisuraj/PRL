import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';

import Styles from './indexCss';
const FilterModel = (props) => {
    const {
        isVisible = false,
        setIsModalVisible
    } = props; 
    return (
        <Modal
            onBackdropPress={setIsModalVisible}
            onBackButtonPress={setIsModalVisible}
            coverScreen={true}
            isVisible={isVisible}
            style={Styles.modalStyle}
            animationIn={'slideInRight'}
            animationOut={'slideOutRight'}>
            <View style={Styles.filterContainerStyle}>
                {props?.children ? props.children : null}
            </View>
        </Modal>
    );
}

export default FilterModel;