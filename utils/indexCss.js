import {StyleSheet} from 'react-native';
import {
  getWp
} from '@utils';
export default StyleSheet.create({
  container: { 
    flexDirection: 'column',
    backgroundColor:'#0B214D',
    // borderWidth:1,
    // borderColor: 'red'
  },
  profileImg: {
    // width: 40,
    // height: 40,
    borderRadius: 40,
    marginLeft:0
  },
  DrawerIcons: {
    width: getWp(25),
    height: getWp(25),
    // borderRadius: 40,
    marginLeft:0
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
