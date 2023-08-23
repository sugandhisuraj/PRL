import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  placeholderButton:{
    color:'#FFFFFF'
  },
  nextGame:{
    backgroundColor:'red',
    color:'black'
  },
  OtpContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:15,
    marginTop:0,   
  },
  textInputContainer: {
    
  },
  roundedTextInput: {
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor: '#E6E6E6',
    borderBottomWidth:0,
    marginHorizontal:10,
    height:30,
    width:25,
    color:'#303952',
    fontWeight:'bold',
    fontSize:22,
    fontStyle:'normal',
    fontFamily:'Avalon',
    
  },
  OtpTextStyle:{
    marginTop:5,
    alignSelf:'center',
    width: 200,
    height: 25,
  },
 
  OtpInputStyle:{
    position: 'absolute',
    width: 45,
    height: 45,
    // marginLeft: getWp(55),
    backgroundColor:'#E6E6E6',
    borderColor:'#EDEDED',
    borderRadius:6,
  
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'#0B214D'
  },
  profileImg: {
    width: 30,
    height: 30,
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
    // right: getWp(12),
    // left: getWp(12),
    // bottom: getHp(26),
  },

  icon: {
    // marginTop: getHp(7),
    // marginBottom: getHp(14),
  },

  text: {
    fontSize: 14,
    // color: COLORS.percentageCaptionTextColor,
    textAlign: 'center',
  },
});
