import { StyleSheet } from "react-native";

//Internal Imports
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";

export default StyleSheet.create({
  coorBlack: {
    color: 'black'
  },
  OtpContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 0,
  },
  textInputContainer: {},
  roundedTextInput: {
    borderRadius: 30,
    borderWidth: 0,
    backgroundColor: "#E6E6E6",
    borderBottomWidth: 0,
    marginHorizontal: 10,
    height: 30,
    width: 25,
    color: "#303952",
    fontWeight: "bold",
    fontSize: 22,
    fontStyle: "normal",
  },
  OtpTextStyle: {
    marginTop: 5,
    alignSelf: "center",
    width: 200,
    height: 25,
  },

  OtpInputStyle: {
    position: "absolute",
    width: 45,
    height: 45,
    // marginLeft: getWp(55),
    backgroundColor: "#E6E6E6",
    borderColor: "#EDEDED",
    borderRadius: 6,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#0B214D",
  },
  profileImg: {
    resizeMode: "contain",
    marginLeft: -10,
  },
  profileCharity: {
    width: 50,
    height: 50,
    borderRadius: 40,
    paddingHorizontal: 20,
  },

  itemContainer: {
    flexDirection: "column",
    // marginTop: getHp(15),
  },

  footerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
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
    textAlign: "center",
  },

  CustomBoxView: {
    height: 84,
    width: 150,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  CustomBoxBGImage: {
    height: 50,
    width: 50,
    resizeMode: "contain",
    position: "absolute",
    alignSelf: "center",
    opacity: 1,
  },

  CustomBoxText: {
    fontSize: 18,
    lineHeight: 22,
    color: "#FFF",
  },
  inputContainerStyle: {
    marginTop: getHp(10),
  },

  HeaderView :{
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
  },

  SectionText : { 
    fontSize: 18, 
    fontWeight: "bold", 
    lineHeight: 22 ,
    color: 'black',
    paddingLeft:15
  },

  CharityView : {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "85%",
    alignSelf: "center",
  },

  SectionMainView: { 
    alignSelf: "center", 
    width: "90%" 
  },
  SectionSubView: { 
    alignSelf: "center", 
    width: "110%" 
  },

  ProfileWelcomeText: {
    fontSize: 16,
    lineHeight: 19,
    fontWeight: "bold",
    alignSelf: "center",
    color: 'black'
  },

  ProfileButtonView : {
    height: 30,
    backgroundColor: "#0B214D",
    borderRadius: 15,
    justifyContent: "center",
    marginHorizontal: 10,
  },
  
  ProfileButtonText: {
    fontSize: 14,
    lineHeight: 17,
    paddingHorizontal: 10,
    color: "#FFF",
    textAlign: "center",
  },
  errorViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tryAgainTouch: {
    justifyContent: 'center',
    alignItems:'center',
    marginTop: getHp(20),
    backgroundColor: '#0B214D',
    paddingHorizontal: getHp(25),
    paddingVertical: getHp(8),
    borderRadius: getHp(30)
  },
  somethingWrongTextStyle: {
    fontSize: FONTSIZE.Text18,
    color: 'black'
  },
  tryAgainStyle: {
    fontSize: FONTSIZE.Text16,
    fontWeight: 'bold',
    color: 'white'
  },
  logoStyle: { 
    height: getHp(80),
    width: getHp(80),
    bottom: getHp(20)
}
});
