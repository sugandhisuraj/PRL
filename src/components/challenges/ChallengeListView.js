import React, { useState, useRef } from "react";
import {
    View,
    Text,
    FlatList
} from "react-native";

import 'firebase/firestore';
import BackImg from '@assets/arrow_left.png';

const ChallengeListView = (props) => {

    const renderChallengeItem = (challenge) => {
        return (
            <View style={{ height: 40, borderColor: props.borderColor, borderRadius: 5, borderWidth: 1, marginTop: 5, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, color: props.tintColor }}>
                    {challenge.points}
                    {/* {challenge.challengeGameWinnerId === this.props.player1Id ? this.props.player1Name : this.props.player2Name} Win */}
                </Text>
                <Text style={{ flex: 1, fontWeight: 'bold', color: props.tintColor, textAlign: 'center' }}>
                    {challenge.points}pt
                </Text>
                <Text style={{ flex: 2, textAlign: 'center', fontSize: 12, color: props.tintColor }}>
                    {/* {challenge.opponent === 'all' ? 'Open to All' : challenge.opponentEmail.substring(0, challenge.opponentEmail.lastIndexOf("@"))} */}
                </Text>
                {challenge.status == "pending" &&
                    <View style={{ height: 20, width: 60, backgroundColor: 'red', borderRadius: 10, overflow: 'hidden', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: props.tintColor, textAlign: 'center' }}>
                            Pending
                        </Text>
                    </View>
                }
            </View>
        );
    }

    return (
        <View style={{ flex: 1, padding: 20 }}>
            {props.challenges.length == 0 ? 
                <View style={{flex: 1, textAlign: 'center', justifyContent: 'center', width: '100%'}}>
                    <Text style={{alignSelf: 'center', color: props.tintColor}}>No challenges</Text>
                </View>
            : 
            <FlatList
                data={props.challenges}
                renderItem={(item) => renderChallengeItem(item.item)}
                keyExtractor={(item) => item.id} />
            }
            
        </View>
    );
};

export default ChallengeListView;