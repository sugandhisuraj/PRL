import React from 'react';
import {View, StyleSheet, Dimensions, Image, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Header} from '../../components';
import {COLOR} from '../../utils';
import {Description, Mission, WatchVideo, ProfileInfo} from './components';
import {ROUTES} from '../../navigation/routes.constant';

const Charity = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Header
        onEdit={() => {
          navigation.navigate(ROUTES.EDIT_CHARITY);
        }}
      />
      <View style={styles.container}>
        <View style={styles.center}>
          <Image
            style={styles.logo}
            source={{uri: 'https://via.placeholder.com/150'}}
          />
        </View>
        <View style={{marginTop: 55}}>
          <ProfileInfo
            name={'Charity Name'}
            web={'www.charity-name.com'}
            email={'Charity Email'}
            phone={'charity phone number'}
          />

          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{height: 550}}>
            <Mission text={'Mission Statement'} />
            <Description
              url="https://via.placeholder.com/150"
              description={'description'}
            />
            <WatchVideo url={'https://via.placeholder.com/150'} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 150 : 100,
    zIndex: 99999999999,
    width: '100%',
    borderRadius: 50,
  },
  logo: {
    borderRadius: 50,
    position: 'absolute',
    top: -50,
    backgroundColor: COLOR.GRAY,
    height: 93,
    width: 93,
  },
  center: {alignItems: 'center'},
});
export default Charity;
