import { StyleSheet } from 'react-native';
import { wp, hp, getHp, getWp, FONTSIZE } from '@utils';
export default StyleSheet.create({
  inputContainerStyle: {
    marginTop: getHp(25),
},
formContainer: {
  marginTop: getHp(30),
  width: "70%",
  alignSelf: "center"
},
  Form: {
    alignItems: 'center',
  },
  Field: {
    marginTop: getHp(10),
    paddingHorizontal:20,
    height: 40,
    width: 300,
    borderWidth: 0.5,
    borderColor: '#000',
    backgroundColor: '#FFFFFF',
    borderRadius: 8

  },
  label: {
    paddingLeft: 20
  },
  checkboxContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  Dropdown: {
    paddingTop: 40,
    alignItems: "center"
  },
  SubmitButton: {
    // width: 250,
    height: 40,
    marginTop: 10,
    alignContent: 'center',
    backgroundColor: '#0B214D', //when data not inserted
    borderRadius: 15,
  },
  SubmitButtonView: {
    paddingHorizontal: 60,
    //  fontFamily:'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#FFFFFF',
    //  textAlign:'center'

  },
  ButtonView: {
    // position: 'absolute',
    paddingHorizontal: 60,
    // width: 150,
    // height: 30,

    // marginTop: 10,

    backgroundColor: '#0B214D', //when data not inserted
    borderRadius: 6,

  },
  ButtonView2: {
    // position: 'absolute',
    width: 170,
    // height: 30,

    // marginTop: 10,

    backgroundColor: '#EC2939', //when data not inserted
    borderRadius: 6,

  },
  ButtonText: {

    // fontFamily:'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    // lineHeight: 26,
    color: '#FFFFFF',
    justifyContent: 'center',
    alignContent: 'center'

  },
  placeholderButton: {
    color: '#FFFFFF'
  },
  nextGame: {
    backgroundColor: 'red',
    color: 'black'
  },
  OtpContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 0,
  },
  textInputContainer: {

  },
  roundedTextInput: {
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor: '#E6E6E6',
    borderBottomWidth: 0,
    marginHorizontal: 10,
    height: 30,
    width: 25,
    color: '#303952',
    fontWeight: 'bold',
    fontSize: 22,
    fontStyle: 'normal',
    fontFamily: 'Avalon',

  },
  OtpTextStyle: {
    marginTop: 5,
    alignSelf: 'center',
    width: 200,
    height: 25,
  },

  OtpInputStyle: {
    position: 'absolute',
    width: 45,
    height: 45,
    // marginLeft: getWp(55),
    backgroundColor: '#E6E6E6',
    borderColor: '#EDEDED',
    borderRadius: 6,

  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#0B214D'
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 40,

  },
  trophy: {
    width: 50,
    height: 50,
    borderRadius: 40,
  },

  itemContainer: {
    flexDirection: 'column',
    // marginTop: getHp(15),
  },

  footerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',

  },

  icon: {

  },

  text: {
    fontSize: 14,

    textAlign: 'center',
  },
});