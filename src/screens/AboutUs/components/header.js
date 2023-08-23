import React from 'react'
import { View, Image, TouchableOpacity } from 'react-native'
import PRLWHITE from './PRLWHITE.png'
import Feather from 'react-native-vector-icons/Feather';

Feather.loadFont();

export default function Header({ onMenuPress, renderMenu = true }) {

    return (
        <View style={{ backgroundColor: '#0B214D', height: 120, justifyContent: 'center', flexDirection: 'row' }}>
            {renderMenu && <TouchableOpacity
                style={{position: 'absolute', left: 20, top: 20}}
                onPress={onMenuPress}>
                <Feather name="menu" size={25} color={'#fff'} />
            </TouchableOpacity>}
            <View style={{ alignSelf: 'center' }}>
                <Image source={PRLWHITE} height={20}
                    style={{ borderRadius: 40, marginRight: 20 }} />
            </View>


        </View>
    )
}
