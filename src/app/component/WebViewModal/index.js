import React, { memo, useEffect, useState, useImperativeHandle } from 'react';
import { View, TouchableOpacity, Text, Alert, Image, Platform } from 'react-native';
import * as ImagePicker from "expo-image-picker";
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Modal from 'react-native-modal';
// import Video from 'react-native-video';
import Styles from './indexCss';
import { getWp } from '@utils';
import { WebView } from 'react-native-webview';
AntDesign.loadFont();
MaterialIcons.loadFont();


const WebViewModal = (props, ref) => {
    const {
        modalVisible = false,
        onClose = () => { },
        html = '<h1>Hello World</h1>',
        containerStyle = {},
        renderComponent = false
    } = props;

    const RenderModalContent = () => {
        if(renderComponent) {
            return html;
        }
        return (
            <WebView
                originWhitelist={['*']}
                source={{ html }}
            />
        );
    }
    return (
        <View style={[containerStyle]}>
            <Modal isVisible={modalVisible}
                onBackButtonPress={() => onClose()}
                onBackdropPress={() => onClose()}>
                <View style={Styles.modalContainer}>
                    <RenderModalContent />
                    <TouchableOpacity style={Styles.closeContainer} onPress={() => onClose()}>
                        <AntDesign name={"close"} size={getWp(24)} color={'white'} />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

export default memo(WebViewModal);