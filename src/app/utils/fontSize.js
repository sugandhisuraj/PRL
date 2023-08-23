import {getWp} from '@utils';

const computeFontSize = (maxFont = 40) => {
  let key = 'Text';
  let obj = {};
  for(let i=1;i<=maxFont;i++){
    obj = {...obj,[`${key}${i}`]: getWp(i)}
  }
  return obj;
}
export const FONTSIZE = {
  ...computeFontSize()
}; 