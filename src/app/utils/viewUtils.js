import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import ViewPort from '@constants/viewPortSizes';
  
  const getHp = (pixels = ViewPort.height) => {
    return hp(((pixels / ViewPort.height) * 100).toFixed(2));
  };
  
  const getWp = (pixels = ViewPort.width) => {
    return wp(((pixels / ViewPort.width) * 100).toFixed(2));
  };
  
  export {wp, hp, getHp, getWp};