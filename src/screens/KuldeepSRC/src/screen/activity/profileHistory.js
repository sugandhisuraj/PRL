import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import {Header} from '../../components';
import {Heart, Map, Music, Trophy, Up} from '../../icon';
import {COLOR} from '../../utils';
import {
  PastEventItem,
  Heading,
  HighLightItem,
  PastScroresItem,
} from './component';

const ProfileHistory = () => {
  return (
    <View>
      <Header />

      <View style={styles.container}>
        <View style={styles.center}>
          <Image
            style={styles.logo}
            source={{uri: 'https://via.placeholder.com/150'}}
          />
          <Text style={styles.title}>Joe Smith (Joe)</Text>
          <Text style={{color: '#949AB1'}}>@jsmith1988</Text>
        </View>
        <View style={{paddingHorizontal: 20}}>
          <Heading text="Highlights" />
          <HighLightItem text={`Cleveland, OH`} Icon={Map} />
          <HighLightItem text={`Raised $450`} Icon={Up} />
          <HighLightItem text={`Favorite Charity: Red Cross`} Icon={Heart} />
          <HighLightItem text={`Won 3 Tournaments`} Icon={Trophy} />
          <HighLightItem text={`Walkup Song: Eye of the Tiger`} Icon={Music} />
          <Heading text="Past Events" />

          <FlatList
            horizontal={true}
            data={[1, 2]}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <PastEventItem
                item={{
                  title: 'Chagrin Falls High School Basketball Fundraiser',
                  name: 'Free Throw Competition',
                  people: '8 Teams',
                  place: 'Came in 1st Place',
                  fund: 'Raised $100',
                }}
              />
            )}
          />

          <Heading text="Past Scores" />
          <FlatList
            horizontal={true}
            data={[1, 2]}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => <PastScroresItem />}
          />
 
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  scrolContainer: {height: '100%', backgroundColor: 'white'},
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
  title: {fontSize: 24, fontWeight: 'bold', marginTop: 50},
});
export default ProfileHistory;
