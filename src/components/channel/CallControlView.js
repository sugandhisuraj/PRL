import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
    Text
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { firebase } from '../../firebase';

const smallButtonsSize = 50;
const smallButtonIconSize = 30;
const largeButtonSize = 50;
const largeButtonIconSize = 30;
const buttonsIndentSize = 40;

const CallControlView = (props) => {

    const {
        eventId,
        eventName,
        isMuted,
        isCameraOn,
        onEndCall,
        onMuteOnOff,
        onCameraOnOff,
        peopleCount
    } = props;

    const navigation = useNavigation();

    const onMessage = () => {
        navigation.navigate("EventChatScreen", { eventID: eventId, eventName })
    }

    const [messages, setMessages] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);

    const splitIdsArray = (ids) => {
        if (ids.length > 0) {
            let splittedIds = [];
            let seeker = 0;
            while (seeker < ids.length) {
                let elementSplitIds = [];
                for (let idx = 0; idx < 10; idx++) {
                    if (seeker + idx < ids.length) {
                        elementSplitIds.push(ids[seeker + idx]);
                    }
                }

                splittedIds.push(elementSplitIds);
                seeker = seeker + 10;
            }
            return splittedIds;
        } else {
            return [];
        }
    }

    const userAvatarUrlForMessage = useCallback((message) => {
        const user = chatUsers.find(chatUser => chatUser.uid === message.userId);
        if (user === undefined) {
            return '';
        } else {
            return user.userAvatar;
        }
    }, [chatUsers]);

    const userNameForMessage = useCallback((message) => {
        const user = chatUsers.find(chatUser => chatUser.uid === message.userId);
        if (user === undefined) {
            return '---';
        } else {
            if (user.userName !== undefined && user.userName !== "") {
                return user.userName;
            } else if (user.userNickName !== undefined && user.userNickName !== "") {
                return user.userNickName;
            } else {
                return user.email;
            }
        }
    }, [chatUsers]);

    const dateAndTimeString = (message) => {
        const time = new Date(message.when);
        const now = new Date();

        const timeDateString = format(time, 'yyyy-MM-dd');
        const nowDateString = format(now, 'yyyy-MM-dd');

        if (nowDateString === timeDateString) {
            return format(time, 'h:mm a');
        } else {
            return format(time, 'MMM d, h:mm a');
        }
    }

    const renderMessageItem = (gameMessage) => {
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <View style={{
                    flexDirection: 'row',  
                    paddingLeft: 15,
                    flex: 1,
                    marginTop: 10,
                    marginBottom: 15
                    }}>

                    <Image 
                        style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.3)' }}
                        source={{ uri: userAvatarUrlForMessage(gameMessage) }}/>
                    
                    <View style={{flexDirection: 'column', marginLeft: 10, marginRight: 15, flex: 1}}>
                        <View style={{flexDirection: 'row', alignItems:'flex-end'}}>
                            <Text style={{fontWeight: 'bold', fontSize: 14, color: 'white'}}>
                                {userNameForMessage(gameMessage)}
                            </Text>
                        </View>

                        <Text style={{ marginTop: 5, color: 'white' }}>
                            {gameMessage.content}
                        </Text>
                    </View>

                    <Text style={{color: 'gray', fontSize: 11, marginLeft: 5, color: 'white', marginRight: 15}}>
                        { dateAndTimeString(gameMessage) }
                    </Text>
                </View>
            </View>
        );
    };

    let unsubscribe = null;

    const loadNewUserData = async (newUserIds) => {
        const userIdArraysArray = splitIdsArray(newUserIds);
        const promises = userIdArraysArray.map(idsArray => new Promise(resolve => {
            firebase.firestore().collection("users")
                .where("uid", "in", idsArray)
                .get()
                .then(querySnapshot => {
                    let elems = [];
                    querySnapshot.forEach(documentSnapshot => {
                        let user = documentSnapshot.data();
                        elems = [...elems, user];
                    });
                    resolve(elems);
                });
            }));
        
        const userArraysArray = await Promise.all(promises);

        let users = [];
        userArraysArray.forEach(userArrays => {
            users = [...users, ...userArrays];
        });

        setChatUsers([...chatUsers, ...users]);
    }

    useEffect(() => {

        if (unsubscribe !== null) {
            unsubscribe();
        }

        unsubscribe = firebase.firestore().collection("eventChat").where("eventID", "==", eventId).orderBy("when", "desc").limit(2)
            .onSnapshot(querySnapshot => {
                let msgs = [];
                let newUserIds = [];
                querySnapshot.forEach((doc) => {
                    const message = doc.data();
                    const userId = message.userId;
                    if (!(chatUsers.includes(user => user.uid === userId))) {
                        newUserIds.push(userId);
                    }
                    msgs.push(message);
                });
                setMessages(msgs.reverse());
                
                if (newUserIds.length > 0) {
                    loadNewUserData(newUserIds);
                }
            });

        return () => unsubscribe?.()
    }, []);

    return (
        <View style={styles.container}>

            <LinearGradient
                colors={['#00000000', '#0000007f']}
                style={styles.gradientView}>

                    <View style={styles.controllersBox}>

                        <TouchableOpacity
                            style={styles.smallButtons}
                            onPress={onMuteOnOff}>
                            <MaterialIcons name={true === isMuted ? "mic-off" : "mic"} size={smallButtonIconSize} color="white"/> 
                        </TouchableOpacity>

                        <View style={{width: buttonsIndentSize}} />

                        <TouchableOpacity
                            style={styles.smallButtons}
                            onPress={onCameraOnOff}>
                            <MaterialIcons name={isCameraOn === true ? "videocam" : "videocam-off"} size={smallButtonIconSize} color="white"/> 
                        </TouchableOpacity>

                        <View style={{width: buttonsIndentSize}} />

                        <TouchableOpacity
                            style={styles.smallButtons}
                            onPress={onMessage}>
                            <MaterialIcons name="message" size={24} color="white"/> 
                        </TouchableOpacity>

                        <View style={{width: buttonsIndentSize}} />

                        <TouchableOpacity
                            style={styles.largeButtons}
                            onPress={onEndCall}>
                            <MaterialIcons name="call-end" size={largeButtonIconSize} color="white"/> 
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.peopleCountText}>
                        {peopleCount === 0 ? "No" : peopleCount} people in {eventName}
                    </Text>

                    <View style={{
                        width: '100%',
                        flexDirection: 'column',
                    }}>
                        {messages.map(message => renderMessageItem(message))}
                        {messages.length > 0 &&
                            <View style={styles.showAllButtons}>
                                <TouchableOpacity
                                    onPress={onMessage}>
                                    <Text style={{color: 'white'}}>
                                        Show all
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    
            </LinearGradient>
        </View>
    );
}

export default CallControlView;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
    },
    gradientView: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    controllersBox: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    smallButtons: {
        width: smallButtonsSize,
        height: smallButtonsSize,
        borderRadius: smallButtonsSize / 2,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    largeButtons: {
        width: largeButtonSize,
        height: largeButtonSize,
        borderRadius: largeButtonSize / 2,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },

    peopleCountText: {
        marginTop: 10,
        marginBottom: 15,
        fontWeight: 'bold',
        color: 'white'
    },

    showAllButtons: {
        width:'100%',
        alignItems: 'flex-end',
        marginBottom: 10,
        paddingRight: 20
    }
});