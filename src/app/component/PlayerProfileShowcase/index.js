import React, { memo, Fragment } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';

import Styles from './indexCss';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { getWp, getHp} from '@utils';
AntDesign.loadFont();

const PlayerProfileShowcase = (props) => {
    const {
        containerStyle = {},
        name = 'Add Name',
        nickName = 'Add Nick Name',
        charity = 'Add Charity',
        eventName = 'Add Event Name',
        onLeftPress = () => { },
        onRightPress = () => { },
        disabledRight = false,
        disabledLeft = false,
        hideRight = false,
        hideLeft = false,
        viewDisableContent,
        userAvatar = ''
    } = props;
    return (
        <View style={[Styles.containerStyle, containerStyle]}>
            {
                !hideLeft && <TouchableOpacity
                    disabled={disabledLeft}
                    onPress={onLeftPress}
                    style={Styles.leftRightTouchStyle}>
                    <AntDesign
                        name={'left'}
                        style={Styles.leftRightIconStyle}
                    />
                </TouchableOpacity>
            }
            <View style={Styles.showCaseContainer}>
                {
                    viewDisableContent.render ?
                        <Text style={[Styles.nameStyle, { textAlign: 'center' }]}>{viewDisableContent.content}</Text>
                        :
                        <Fragment>
                            <View style={{ 
                                alignItems: 'center',
                                flexDirection: 'row',
                                width: '95%',  }}>
                                {
                                    userAvatar.length > 0 && <Image
                                        source={{ uri: userAvatar }}
                                        height={getWp(80)}
                                        width={getWp(80)}
                                        style={{
                                            height: getWp(80),
                                            width:getWp(80),
                                            borderRadius: getWp(100)
                                        }}
                                    />
                                }
                                 
                                <View style={{alignSelf: 'center',width: userAvatar.length > 0 ? '50%' : '100%',justifyContent: 'center',alignItems:'center'}}>
                                    <Text style={Styles.nameStyle}>
                                        {name}
                                    </Text>
                                    <Text style={[Styles.nameStyle, Styles.commonMarginStyle]}>
                                        {nickName}
                                    </Text>
                                </View>
                            </View>

                            <Text style={[Styles.nameStyle, Styles.commonMarginStyle, {marginTop: getHp(15)}]}>
                                {charity}
                            </Text>
                            <Text style={Styles.eventNameStyle}>
                                {eventName}
                            </Text>
                        </Fragment>
                }

            </View>
            {
                !hideRight && <TouchableOpacity
                    disabled={disabledRight}
                    onPress={onRightPress}
                    style={Styles.leftRightTouchStyle}>
                    <AntDesign
                        name={'right'}
                        style={Styles.leftRightIconStyle}
                    />
                </TouchableOpacity>
            }
        </View>
    );
}

export default memo(PlayerProfileShowcase);