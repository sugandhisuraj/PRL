import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  ButtonView:{
 
    marginTop: 10,
  
    backgroundColor: '#0B214D', //when data not inserted
    borderRadius:20,
   
    paddingHorizontal:30,

  
},
ButtonView2:{
 
  paddingHorizontal:50,
 
  marginTop: 10,
 
  backgroundColor: '#EC2939', //when data not inserted
  borderRadius:20,
  
},
ButtonText:{
// fontFamily:'Roboto',
fontStyle: 'normal',
fontWeight: 'bold',
fontSize: 16,

color:'#FFFFFF',
justifyContent:'center',
alignContent:'center'

},
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
    width: 50,
    height: 50,
    borderRadius: 0,
  
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
