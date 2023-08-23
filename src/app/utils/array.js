export const maxNumberArrOfObj = (array, key) => {
    return Math.max.apply(Math, array.map(function (o) { return o[key]; }));
}

export const removeDuplicateFromArr = (array, key) => {
    const counterVar = new Set(); 

    const filteredArr = array.filter(el => {
        const duplicate = counterVar.has(el[key]);
        counterVar.add(el[key]);
        return !duplicate;
    });
    return filteredArr;
}

export const sortArrayAlphabatically = (arr, key = undefined) => {
  if (!key) {
    return arr;
  }
    return arr.sort((i,j)=>{
        if (i[key] > j[key]) {
          return 1;
        }else {
          return -1;
        }
      });
};