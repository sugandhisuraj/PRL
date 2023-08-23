// External Imports
import React from 'react';
import {View,Image,Text,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import Icons from 'react-native-vector-icons/Feather'
import styles from './indexCss';
import { Button } from 'react-native-elements';


function HeaderBlack({ 
  navigation, 
  onBackPress = () => { } 
}) {
   
      return (
        <View style={{}}>
            <View style={{flexDirection:'row',alignItems:'center',paddingVertical:10}}>
            <View style={{paddingHorizontal:12}}>
            {/* <Icons name="menu" size={30} color="black" style={{paddingHorizontal:20}} /> */}
            </View>
            <TouchableOpacity onPress={onBackPress}>
            <Icon name="angle-left" size={40} color="black" style={{paddingHorizontal:10}} />
            </TouchableOpacity>
            <View>
            <Text style={{paddingHorizontal:20,color:'black',fontWeight:'bold',fontSize:16}}>Payment</Text>
            </View>
            </View>
            
        </View>
      );
    }


export default HeaderBlack;