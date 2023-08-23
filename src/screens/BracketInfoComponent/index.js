import React,{ Fragment, useEffect, useState } from 'react';
import { Text,View } from 'react-native';
import { bracketInfoDetailsCollection } from '@PRLFirebase';
import {transformFirebaseValues} from '@utils';

const hierarcy = (round1Data) => {
    let data = [
        1,16,8,9,5
    ];

    let round1 = [];
        
    for(let d of data) {
        Object.keys(round1Data).map(function(key, index) {
            if (d == parseInt(key)) {
                let data = {key: key, value: round1Data[key]};
                round1.push(data);
            }
        });
    }
    return round1;
}
const BracketInfoComponent = () => {
    let [round1, setRound1] = useState([]);
    const loadData = async () => {
        const bracketInfoData = await bracketInfoDetailsCollection.get();
        const data = transformFirebaseValues(bracketInfoData, 'eventId');
        console.log("OUTER_DATA_1 - ", JSON.stringify(data));
        let team1Data = await bracketInfoDetailsCollection.doc(data[0].id).collection('team1').doc('round1').get();
        let round1Data = team1Data.data();
        console.log('OUTER_DATA_3 - ', JSON.stringify(round1Data));
        const round1 = hierarcy(round1Data);
          setRound1(round1);
    }
    useEffect(()=>{
        loadData();
    }, []);
    return (
        <View>
            {
                round1.map(i => {
                    return <Text style={{fontSize: 20, color: 'black'}}>
                        {i.key} - {i.value}
                    </Text>
                })
            }
        </View>
    );
}

export default BracketInfoComponent;