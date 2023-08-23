import React, { Fragment } from 'react';
import { StyleSheet, View, Text } from 'react-native';

//Import Vector Icons
import Antdesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';

import Colors from '../common/Colors';
import {
  ImageVideoPlaceholder
} from '@component';
import {
  getFromToDate
} from '@utils';
//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();

class ContestDetail extends React.Component {
  render() {
    const { Details, Event } = this.props;
    console.log('DETAILS_TEST_ED_1 - ', Details);
    return (
      <Fragment>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <View>

            <ImageVideoPlaceholder
              viewURI={Details.contestLogo}
              type={'photo'}
              mode={'view'}
              containerStyle={{
                height: 80,
                width: 80,
                backgroundColor: Colors.Grey,
              }}
              imageStyle={{
                height: 80,
                width: 80,
              }}
            />
          </View>
          <View style={{ width: '70%' }}>
            <View>
              <Text style={styles.eventDetailBoldText}>
                {Details.contestName}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 16,
                  lineHeight: 19,
                  color: '#000'
                }}>
                {
                  getFromToDate(
                    Details.contestDate?.length !== 0 &&
                      Details.contestDateEnd?.length !== 0 ?
                      Details.contestDate : "",
                    Details.contestDateEnd?.length !== 0 &&
                      Details.contestDate?.length !== 0 ?
                      Details.contestDateEnd : "")
                }
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.eventDetailBoldText, { marginVertical: 15 }]}>
                {`Max Number of Players: ${Details.contestMaxPlayers}`}
              </Text>
              <Antdesign
                name="right"
                size={25}
                style={{ marginVertical: 15, marginLeft: 10 }}
              />
            </View>
          </View>
        </View>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  eventDetailBoldText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: 'bold',
    color: '#000'
  },
});

export default ContestDetail;
