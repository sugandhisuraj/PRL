import { StyleSheet } from "react-native";
export default StyleSheet.create({
  SubmitButton: {
    width: 90,
    height: 30,
    marginTop: 0,
    borderRadius: 15,
  },
  SubmitButtonView: {
    //fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  CancelButton: {
    width: 90,
    height: 30,
    marginTop: 0,
    backgroundColor: "#0B214D", //when data not inserted
    borderRadius: 15,
  },
  CancelButtonView: {
    //fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  ImageView: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100
  },

  SubmitButtonText: {
    marginLeft: 25,
    //fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 15,
    color: "#FFFFFF",
    justifyContent: "center",
    alignContent: "center",
  },

  EditButtonView: {
    width: 90,
    height: 40,
    backgroundColor: "#EDCF80", //when data not inserted
    borderRadius: 16,
  },

  EditButtonText: {
    marginLeft: 30,
    //fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 15,
    color: "#000000",
    justifyContent: "center",
    alignContent: "center",
  },
  CancelButtonText: {
    marginLeft: 30,
    //fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 15,
    color: "#FFFFFF",
    justifyContent: "center",
    alignContent: "center",
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
    fontFamily: "Avalon",
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
    width: 50,
    height: 50,
    borderRadius: 0,
  },

  Gallery: {
    width: 170,
    height: 90,
    borderRadius: 0,
    paddingHorizontal: 0,
  },
  Gallery2: {
    width: 90,
    height: 60,
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
  iconImageStyle: {
    width: 180,
    height: 180
  },
  imageBoxContainer: { 
    alignSelf: "center",
    marginTop: (120),
    height: (180),
    width: (180)
},
logoStyle: { 
    height: (180),
    width: (180)
},
});
