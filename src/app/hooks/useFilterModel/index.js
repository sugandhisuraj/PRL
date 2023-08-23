import React, { useState, useCallback } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';

import Styles from './indexCss';
const FilterModel = (props) => { 

    const [isModalVisible, setIsModalVisible] = useState(false);
    const switchModalState = useCallback(() => setIsModalVisible(i => !i), []);

    const ModelComponent = (prop) => {
        return (
            <Modal
                coverScreen={true}
                isVisible={isModalVisible}
                style={Styles.modalStyle}
                animationIn={'slideInRight'}
                animationOut={'slideInLeft'}>
                <View style={Styles.filterContainerStyle}>
                    {prop?.children ? prop.children : null}
                </View>
            </Modal>
        );
    };
    return {
        switchModalState,
        ModelComponent
    }
}

export default FilterModel;