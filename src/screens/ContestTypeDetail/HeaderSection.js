import React, {Fragment} from 'react';
import {StyleSheet, View, Text} from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class HeaderSection extends React.Component {
  render() {
    return (
      <Fragment>
        <View style={styles.HeaderMainView}>
          <View>
            <Feather name="menu" size={25} color={'#000'} />
          </View>
          <View>
            <Antdesign name="left" size={25} color={'#000'} />
          </View>
          <View style={{borderWidth: 0, width: '80%'}}>
            <View>
              <Text style={styles.HeaderText}>Contest Type</Text>
            </View>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
  },
  HeaderMainView: {
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    marginHorizontal: 15,
    alignItems: 'center',
  },
  HeaderText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: 'bold',
  },
});

export default HeaderSection;
