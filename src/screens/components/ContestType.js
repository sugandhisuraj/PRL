import React, {Component} from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';

//Import Custom Components
import HeaderSection from '../ContestTypeDetail/HeaderSection';
import ContestDesc from '../ContestTypeDetail/ContestDesc';
import ContestDescSection from '../ContestTypeDetail/ContestDescSection';
import ContestRule from '../ContestTypeDetail/ContestRule';
import ContestScoring from '../ContestTypeDetail/ContestScoring';
import ContestEquipment from '../ContestTypeDetail/ContestEquipment';
import ContestGallery from '../ContestTypeDetail/ContestGallery';

export default class ContestInfo extends Component {
  render() {
    return (
      <SafeAreaView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <HeaderSection />
          <ContestDesc />
          <ContestDescSection />
          <ContestRule />
          <ContestScoring />
          <ContestEquipment />
          <ContestGallery />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#FFF',
  },
});
