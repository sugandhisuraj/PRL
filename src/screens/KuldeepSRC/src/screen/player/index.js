import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Back, Filter, Menu, RightArrow} from '../../icon';
import {bigHitSlop} from '../../utils';
import {PlayerItem} from './component';

const Player = () => {
  const [showFilter, setShowfilter] = useState(false);
  return (
    <ScrollView style={styles.scrolContainer}>
      <View style={styles.header}>
        <View style={styles.rowCenter}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity hitSlop={bigHitSlop}>
              <Menu />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={bigHitSlop}>
              <Back style={{marginLeft: 20}} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setShowfilter(!showFilter);
          }}
          style={{marginRight: 30}}
          hitSlop={bigHitSlop}>
          <Filter />
        </TouchableOpacity>
      </View>
      {showFilter && (
        <View style={styles.filterContainer}>
          <Text style={styles.filter}>Filters:</Text>
          <TouchableOpacity>
            <Text style={styles.tag}>Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.tag}>Filters</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.listContainer}>
        <FlatList
          data={[1, 2]}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <PlayerItem />}
        />
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  tag: {fontSize: 18, lineHeight: 22, marginLeft: 10},
  filter: {fontWeight: 'bold', fontSize: 18, lineHeight: 22},
  filterContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  scrolContainer: {height: '100%', backgroundColor: 'white'},
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {fontSize: 18, lineHeight: 22, marginLeft: 30},
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  listContainer: {marginTop: 10, paddingVertical: 0},
});
export default Player;
