import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {TextField} from '../../components';
import {Menu, Search, Setting} from '../../icon';
import {bigHitSlop, COLOR} from '../../utils';
import {Heading, EventItem} from './component';
import TopCharityItem from './component/topCharity';
import {ROUTES} from '../../navigation/routes.constant';

const Activity = () => {
  const nav = useNavigation();

  return (
    <ScrollView style={styles.scrolContainer}>
      <View style={styles.header}>
        <View style={styles.rowCenter}>
          <TouchableOpacity hitSlop={bigHitSlop}>
            <Menu style={{marginLeft: 30}} />
          </TouchableOpacity>

          <Image
            style={styles.avatar}
            source={{uri: 'https://via.placeholder.com/150'}}
          />
          <View style={{marginLeft: 10}}>
            <Text style={styles.headText}>Joe Smith (Joe)</Text>
            <Text style={styles.username}>@jsmith1988</Text>
          </View>
        </View>
        <TouchableOpacity
          style={{marginRight: 30}}
          onPress={() => {
            nav.navigate(ROUTES.PROFILE_HISTORY);
          }}
          hitSlop={bigHitSlop}>
          <Setting />
        </TouchableOpacity>
      </View>
      <View style={{padding: 20, paddingVertical: 0}}>
        <View style={{marginTop: 10}}>
          <TextField
            placeholder="Search for a player or charity"
            Icon={Search}
            onPress={() => {
              alert('Search');
            }}
          />
        </View>
        <Heading text="ere Events" />
        <EventItem
          item={{
            title: 'Chagrin Falls High School Basketball Fundraiser',
            name: 'Free Throw Competition',
            people: '8 Teams',
            fund: 'Tuesday, May 10th 2020',
          }}
        />
        <Heading text="Leading Players" />
        <View style={{marginTop: 10}}>
          <TextField placeholder="Joe Smith" children />
        </View>
        <View style={{marginTop: 10}}>
          <TextField placeholder="Joe Smith" children />
        </View>
        <Heading text="Top Charities" />

        <FlatList
          horizontal={true}
          data={[1, 2]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <TopCharityItem
              item={{
                title: 'Chagrin Falls High School Basketball Fundraiser',
                event: '17',
                fund: '$12,500',
              }}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrolContainer: {height: '100%', backgroundColor: 'white'},
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatar: {
    borderRadius: 50,

    marginLeft: 30,
    backgroundColor: COLOR.GRAY,
    height: 70,
    width: 70,
  },
  headText: {
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 19,
    textAlign: 'center',
  },
  username: {fontSize: 14, lineHeight: 17, color: '#949AB1'},
});

export default Activity;
