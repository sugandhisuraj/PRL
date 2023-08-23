const initialState = {
    charities: {}
};

 
export const CharitiesReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'CHARITIES_READ': 
        const charities = action.payload.docs.map((doc) => {
            let allData = doc.data();
            return { 
                id: doc.id, 
                ...allData 
            };
        });  
        return {
            ...state,
            charities 
        }
        default: return state;
    }
}