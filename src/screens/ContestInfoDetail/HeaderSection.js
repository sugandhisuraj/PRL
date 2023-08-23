import React, {Fragment} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native'; 

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

MaterialIcons.loadFont();
//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class HeaderSection extends React.Component {
 
  render() {
    return (
        <Fragment>
        <View
          style={{
            height: 90,
            flexDirection: 'row', 
            backgroundColor: '#FFF',
            marginHorizontal: 15,
            alignItems: 'center',
          }}> 
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Antdesign name="left" size={25} color={'#000'} />
          </TouchableOpacity>
          <View style={{borderWidth: 0, width: '80%',marginLeft: 10}}>
          
              <Text
                style={{
                  fontSize: 18,
                  lineHeight: 19,
                  fontWeight: 'bold',
                  color: '#000'
                }}>
                Contest Information
              </Text> 
          </View>

          {this.props.shouldEdit && <TouchableOpacity onPress={this.props.onContestEdit}>
          <MaterialIcons name={'edit'} color={'black'} size={25}/>
          </TouchableOpacity>}
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
  },
  eventMainView: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
  },
  textMainView: {
    backgroundColor: '#FFF',
    width: 230,
    height: 30,
    borderRadius: 50,
    shadowColor: '#DCE4F9',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  lebelText: {
    fontSize: 14,
    lineHeight: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  textInputStyle: {
    borderWidth: 0,
    width: 230,
    height: 30,
    borderRadius: 50,
    paddingLeft: 10,
  },
  ButtonText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold'
  }
});

export default HeaderSection;
