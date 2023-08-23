import React, { Component } from 'react';
import { View, Text } from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../common/Colors';
import {
  ImageVideoPlaceholder
} from '@component';
Antdesign.loadFont();
Feather.loadFont();

export default class ContestGallery extends Component {
  render() {
    const { Contest } = this.props;
    return (
      <View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18, lineHeight: 22, fontWeight: 'bold', paddingLeft: 30, color: '#000' }}>Gallery</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>

          <ImageVideoPlaceholder
            disabledOnPress={Contest.contestPhoto?.length == 0}
            viewURI={Contest.contestPhoto}
            type={'photo'}
            mode={'view'}
            containerStyle={{
              width: 210, height: 130, marginRight: 5, backgroundColor: Colors.Grey
            }}
            imageStyle={{
              width: 210, height: 130
            }}
            renderChildren={Contest.contestPhoto?.length == 0}
          >
            {
              Contest.contestPhoto?.length == 0 ?
                <Text style={{ fontWeight: 'bold', color: '#000' }}>No Contest Picture</Text> :
                null
            }
          </ImageVideoPlaceholder>

          <ImageVideoPlaceholder
            viewURI={Contest.contestVideo}
            type={'video'}
            mode={'view'}
            containerStyle={{
              width: 110, height: 70, marginRight: 5, backgroundColor: Colors.Grey
            }}
            imageStyle={{
              width: 210, height: 130
            }}
            disabledOnPress={Contest?.contestVideo?.length == 0}
            renderChildren
          >
            {
              Contest?.contestVideo?.length == 0 ?
                <Text style={{ fontWeight: 'bold', color: '#000' }}>No Video</Text> :
                <Feather name='play' color='#FFF' size={30} />
            }
          </ImageVideoPlaceholder>

          {/* <View style={{ width: 110, height: 70, marginLeft: 5, backgroundColor: Colors.Grey, justifyContent: 'center', alignItems: 'center' }}>
            <Feather name='play' color='#FFF' size={30} />
          </View> */}
        </View>
      </View>
    );
  }
}
