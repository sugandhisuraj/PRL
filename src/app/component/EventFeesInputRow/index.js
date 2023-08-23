import React, { memo, Fragment } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';

import Styles from './indexCss';

const EventFeesInputRow = (props) => {
    const {
        text = 'Add Text',
        value = 0,
        onChangeText = () => { },
        editable = true,
        selectable = false,
        isSelected = false,
        onPress = () => { },
        isAlreadyPaid = false,
        renderIncluded = false
    } = props;
    return (
        <View style={Styles.container}>
            <Text style={[Styles.textStyle, !selectable && { width: '84%' }]}>{text}</Text>

            <View style={Styles.leftViewStyle}>
                {
                    !isAlreadyPaid && renderIncluded ? 
                    <Text style={{...Styles.textStyle, marginRight: 25}}>Included</Text>
                    : <Fragment>
                        <Text style={Styles.dollarTextStyle}>$</Text>
                <TextInput
                    editable={editable}
                    keyboardType={'numeric'}
                    style={Styles.textInputStyle}
                    value={value}
                    onChangeText={onChangeText}
                />
                    </Fragment>
                }
            </View>
            {
                renderIncluded && !isAlreadyPaid ? null : isAlreadyPaid ?
                    <TouchableOpacity
                        disabled={true}
                        style={[Styles.selectableStyle,
                        Styles.selected, {backgroundColor: 'grey', borderColor: 'grey'}]}>
                    </TouchableOpacity> :
                    selectable ?
                        <TouchableOpacity
                            onPress={onPress}
                            style={[Styles.selectableStyle,
                            isSelected ?
                                Styles.selected :
                                Styles.unSelected]}>
                        </TouchableOpacity> : null
            }
        </View>
    );
}

export default memo(EventFeesInputRow);