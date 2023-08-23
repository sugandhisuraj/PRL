

export const getLargeNum = (arr = [], key = '') => {

    let allkeys = [...arr].map(d => d[key]?d[key]:0);
    console.log("FILT - ", allkeys);
    return Math.max(...allkeys);
}
export const transformFirebaseValues = (
        data, 
        keyForValue = '', 
        addFields = []
    ) => {
    return data.docs.map((doc) => {
        let data = doc.data();
        let inJectNewKeys = {};
        if (addFields.length > 0) {
            for (let key in addFields) {
                for (let objKey in addFields[key]) {
                    inJectNewKeys[objKey] = addFields[key][objKey];
                }
            }
        }
        return {
            id: doc.id,
            ...data,
            value: data[keyForValue] || "",
            ...inJectNewKeys
        };
    });
}