import React, { memo, useState, Fragment } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Collapsible from 'react-native-collapsible';

import Styles from './indexCss';

AntDesign.loadFont();
const CollapsibleViewWithHeading = (props) => {
    const {
        containerStyle = {},
        headingContainerStyle = {},
        headingTextStyle = {},
        collapseStyle = {},
        heading = 'Add Heading',
        defaultCollapseValue = true, 
    } = props;
    const [isCollapse, setIsCollapse] = useState(defaultCollapseValue);
    return (
        <Fragment>
            <View style={[Styles.mainContainer, containerStyle]}>
                <TouchableOpacity
                    style={[Styles.container, headingContainerStyle,]}
                    onPress={() => setIsCollapse(i => !i)}>
                    <Text style={[Styles.headingTextStyle, headingTextStyle]}>{heading}</Text>
                    <AntDesign
                        name={isCollapse ? 'up' : 'down'}
                        style={[Styles.upDownIconStyle,headingTextStyle]}
                    />
                </TouchableOpacity>
            </View>
            <Collapsible collapsed={isCollapse} style={[Styles.collapseStyle, collapseStyle]}>
                {props.children}
            </Collapsible>
        </Fragment>
    );
}

export default memo(CollapsibleViewWithHeading);