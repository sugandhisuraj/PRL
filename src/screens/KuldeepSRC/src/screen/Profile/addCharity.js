import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {TextField, TextArea} from '../../components';
import {Back, Menu} from '../../icon';
import {bigHitSlop, COLOR} from '../../utils';
import {Heading} from './components';
import {ROUTES} from '../../navigation/routes.constant';

const FooterButton = ({onCreate, onEdit, onCancel}) => {
  return (
    <View style={styles.footerBtnContainer}>
      <TouchableOpacity
        onPress={onCreate}
        style={[styles.btnContainer, {backgroundColor: COLOR.RED}]}>
        <Text style={[styles.btnText, {color: COLOR.WHITE}]}>Create</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onEdit}
        style={[styles.btnContainer, {backgroundColor: COLOR.LIGHT_YELLOW}]}>
        <Text style={[styles.btnText, {color: COLOR.BLACK}]}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onCancel}
        style={[styles.btnContainer, {backgroundColor: COLOR.BLUE}]}>
        <Text style={[styles.btnText, {color: COLOR.WHITE}]}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};
const AddCharity = () => {
  const nav = useNavigation();
  return (
    <ScrollView style={styles.scrolContainer}>
      <View style={styles.header}>
        <View style={styles.rowCenter}>
          <TouchableOpacity hitSlop={bigHitSlop}>
            <Back style={{marginLeft: 30}} />
          </TouchableOpacity>

          <Text style={styles.heading}>Create Charity</Text>
        </View>
        <TouchableOpacity style={{marginRight: 30}} hitSlop={bigHitSlop}>
          <Menu />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <TextField placeholder="Enter Charity  name" />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Image
            style={styles.img}
            source={{uri: 'https://via.placeholder.com/150'}}
          />
          <View style={{width: '70%', marginLeft: 20}}>
            <View style={{marginTop: 12}}>
              <TextField placeholder="Enter Charity  URL" />
            </View>
            <View style={{marginTop: 12}}>
              <TextField placeholder="Enter  contact email" />
            </View>
            <View style={{marginTop: 12}}>
              <TextField placeholder="Enter  Phone number" />
            </View>
          </View>
        </View>
      </View>

      <View>
        <Heading backgroundColor={COLOR.LIGHT_YELLOW} text={'Mission'} />
        <View style={{marginTop: 12, padding: 10}}>
          <TextArea placeholder="Enter Mission of the charity" />
        </View>

        <Heading
          backgroundColor={COLOR.BLUE}
          text={'Description'}
          color={COLOR.WHITE}
        />
        <View style={{marginTop: 12, padding: 10}}>
          <TextArea placeholder="Enter description of the charity" />
        </View>

        <Heading
          backgroundColor={COLOR.RED}
          text={'Upload Picture and  Video'}
          color={COLOR.WHITE}
        />
        <View style={styles.uplaodContainer}>
          <TouchableOpacity style={styles.upload}>
            <Text style={{fontSize: 16}}>Upload Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.upload}>
            <Text style={{fontSize: 16}}>Upload Video</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.uploadTaxBtn}>
          <TouchableOpacity style={styles.uploadTaxText}>
            <Text style={{fontSize: 16}}>Upload Tax Document</Text>
          </TouchableOpacity>
        </View>
        <FooterButton
          onCreate={() => {
            nav.navigate(ROUTES.CHARITY_SCREEN);
          }}
          onEdit={() => {}}
          onCancel={() => {}}
        />
      </View>
    </ScrollView>
  );
};
export default AddCharity;

const styles = StyleSheet.create({
    img:{height: 93, width: 93, borderRadius: 50},
  scrolContainer: {height: '100%', backgroundColor: 'white'},
  uploadTaxBtn: {
    paddingHorizontal: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadTaxText: {
    height: 40,
    width: '80%',
    backgroundColor: COLOR.LIGHT_YELLOW,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upload: {
    height: 124,
    width: 124,
    backgroundColor: COLOR.GRAY,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uplaodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 50,
    padding: 20,
  },
  formContainer: {marginTop: 30, padding: 10, paddingVertical: 0},
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
  },
  footerBtnContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    marginTop: 20,
    paddingHorizontal: 40,
  },
  btnContainer: {
    height: 50,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 19,
  },
});
