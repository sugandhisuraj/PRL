import React, {Component} from 'react';
import {View, Text} from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../common/Colors';

Antdesign.loadFont();
Feather.loadFont();

export default class ContestGallery extends Component {
  render() {
    return (
      <View>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 18, lineHeight: 22, fontWeight: 'bold', paddingLeft: 30,}}>Gallery</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10}}>
          <View style={{width: 210, height: 130, marginRight: 5, backgroundColor: Colors.Grey}}></View>
          <View style={{width: 110, height: 70, marginLeft: 5, backgroundColor: Colors.Grey, justifyContent: 'center', alignItems: 'center'}}>
              <Feather name='play' color='#FFF' size={30} />
          </View>
        </View>
      </View>
    );
  }
}
