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

export default class Gallery extends Component {

  constructor(props) {
    super(props);
    this.state = {
      video: null
    }
  }
  render() {


    const eventData = this.props?.data || {};
    return (
      <View>
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontSize: 18, lineHeight: 22, fontWeight: 'bold', paddingLeft: 30, color: '#000' }}>Gallery</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>


          <ImageVideoPlaceholder
            disabledOnPress={eventData.eventPicture?.length == 0}
            viewURI={eventData.eventPicture}
            type={'photo'}
            mode={'view'}
            containerStyle={{
              width: 210,
              height: 160,
              marginRight: 5,
            }}
            imageStyle={{
              width: 210,
              height: 160,
            }}
            renderChildren={eventData.eventPicture?.length == 0}
          >
            {
              eventData.eventPicture?.length == 0 ?
                <Text style={{ fontWeight: 'bold', color: '#000' }}>No Event Picture</Text> :
                null
            }
          </ImageVideoPlaceholder>
          <ImageVideoPlaceholder
            viewURI={eventData?.eventVideo}
            type={'video'}
            mode={'view'}
            containerStyle={{
              width: 110, height: 70, marginLeft: 5, backgroundColor: Colors.Grey, justifyContent: 'center', alignItems: 'center'
            }}
            imageStyle={{
              width: 110, height: 70,
            }}
            disabledOnPress={eventData?.eventVideo?.length == 0}
            renderChildren
          >
            {
              eventData?.eventVideo?.length == 0 ?
                <Text style={{ fontWeight: 'bold', color: '#000' }}>No Video</Text> :
                <Feather name='play' color='#FFF' size={30} />
            }
          </ImageVideoPlaceholder>

        </View>
      </View>
    );
  }
}
