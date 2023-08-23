import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

import Styles from './indexCss';
import { usePickDocument } from '@hooks';

const UploadDocument = (props) => {
    let {
        containerStyle = {},
        label = 'Add Label',
        setPickedDocument = () => { } 
    } = props;
    const {
        pickedDocument,
        pickDocument,
    } = usePickDocument();
    const handlePickDocument = async () => {
        const documentPick = await pickDocument();
        console.log("fffffffff",documentPick.uri);
        setPickedDocument(documentPick.uri);
    }
    return (
        <TouchableOpacity
            style={[Styles.containerStyle, containerStyle]}
            onPress={handlePickDocument}>
            <Text style={[Styles.labelTextStyle]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}

export default UploadDocument;