import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ImagePicker from 'react-native-image-picker';

import {Header} from '../../components';
import {COLOR} from '../../utils';
import {Description, Mission, WatchVideo, ProfileInfo} from './components';

const EditCharity = () => {
  const navigation = useNavigation();

  const selectPhoto = async () => {

    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    await ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
      }
    });
  };
  return (
    <View>
      <Header
        onBack={() => {
          navigation.goBack();
        }}
        onEdit={()=>{
          selectPhoto()
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
              edit
              onUpload={()=>{
                    
              }}
              url="https://via.placeholder.com/150"
              description={''}
              onChangeText={(e)=>{console.log(e)}}
            />
            <WatchVideo
              edit
              url={'https://via.placeholder.com/150'}
              onCancel={()=>{}}
              onSubmit={()=>{}}
              onEdit={()=>{}}
            />
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
export default EditCharity;
