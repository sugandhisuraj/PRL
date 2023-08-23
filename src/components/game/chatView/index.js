import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import { SafeAreaView, TouchableOpacity, View, Text, TextInput, ScrollView, Image, StatusBar } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import KeyboardSpacer from 'react-native-keyboard-spacer';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { format } from 'date-fns';

import { firebase } from '../../../firebase';
import 'firebase/firestore';

const ChatView = ({navigation, route}) => {

    const [game, setGame] = useState(route.params.game);
    const [gameScheduleId, setGameScheduleId] = useState(route.params.gameScheduleId);
    const [messages, setMessages] = useState([]);
    const insets = useSafeAreaInsets();
    const [inputMessage, setInputMessage] = useState("");
    const [sendButtonEnabled, setSendButtonEnabled] = useState(false);
    const [chatUsers, setChatUsers] = useState([]);

    let unsubscribe = null;

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

        console.log("Loaded users in the chat,  old users => ", chatUsers, " : new users => ", users);
        setChatUsers([...chatUsers, ...users]);
    }

    const handleSend = () => {
        const messageData = {
            userId: firebase.auth().currentUser.uid,
            gameID: game.gameID,
            content: inputMessage,
            when: new Date().getTime()
        };

        setInputMessage("");
        firebase.firestore().collection("gameSchedule").doc(gameScheduleId).collection("messages").doc()
            .set(messageData)
            .catch(err => {
                console.log("Error while sending messages", err);
            });
    }

    useEffect(() => {
        setGame(route.params.game);
        setGameScheduleId(route.params.gameScheduleId);
    }, [route.params]);

    useEffect(() => {
        if (inputMessage === "") {
            setSendButtonEnabled(false);
        } else {
            setSendButtonEnabled(true);
        }
    }, [inputMessage]);

    useEffect(() => {
        if (unsubscribe !== null) {
            unsubscribe();
        }

        if (gameScheduleId !== undefined && gameScheduleId !== null) {
            unsubscribe = firebase.firestore().collection("gameSchedule").doc(gameScheduleId).collection("messages").orderBy("when", "desc")
                .onSnapshot(querySnapshot => {
                    console.log("Updated messages", querySnapshot.size);
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
                    setMessages(msgs);
                    
                    if (newUserIds.length > 0) {
                        loadNewUserData(newUserIds);
                    }
                });
        }
    }, [gameScheduleId]);

    useEffect(() => {
        return () => {
            if (unsubscribe !== null) {
                unsubscribe();
            }
        }
    }, []);


    const dateShouldBeShown = (index) => {
        if (index === messages.length - 1) {
            return true;
        } else {
            const currentMessage = messages[index];
            const prevMessage = messages[index + 1];

            const currentMessageDate = format(new Date(currentMessage.when), 'yyyy-MM-dd');
            const prevMessageDate = format(new Date(prevMessage.when), 'yyyy-MM-dd');

            return currentMessageDate !== prevMessageDate;
        }
    }

    const userBarAndTimeShowBeShown = (index) => {
        if (dateShouldBeShown(index)) {
            return true;
        } else {
            const currentMessage = messages[index];
            const prevMessage = messages[index + 1];

            if (currentMessage.userId !== prevMessage.userId) {
                return true;
            } else {
                const timeDiff = currentMessage.when - prevMessage.when;
                return (timeDiff > 3 * 60 * 1000);
            }
        }
    }

    const userNameForMessage = (message) => {
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
    }

    const userAvatarUrlForMessage = (message) => {
        const user = chatUsers.find(chatUser => chatUser.uid === message.userId);
        if (user === undefined) {
            return '';
        } else {
            return user.userAvatar;
        }
    }

    const renderMessageItem = (gameMessage, index) => {
        console.log("Message => ", gameMessage, index);
        return (
            <View style={{flex: 1, flexDirection: 'column', transform: [{scaleY: -1}]}}>
                {dateShouldBeShown(index) &&
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                        <View style={{flex: 1, backgroundColor:"rgba(0,0,0,0.3)", height: 1}} />
                        <Text style={{color: 'gray', marginLeft: 20, marginRight: 20}}>
                            {format(new Date(gameMessage.when), 'EEEE, MMM d')}
                        </Text>
                        <View style={{flex: 1, backgroundColor:"rgba(0,0,0,0.3)", height: 1}} />
                    </View>
                }
                <View style={{
                    flexDirection: 'row',  
                    paddingLeft: 15,
                    flex: 1,
                    marginTop: userBarAndTimeShowBeShown(index) ? 10 : 0,
                    marginBottom: (index === 0) ? 15 : 0
                    }}>
                    {userBarAndTimeShowBeShown(index) ? 
                        <Image 
                            style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.3)' }}
                            source={{uri: userAvatarUrlForMessage(gameMessage)}}/>
                    :
                        <View style={{ width: 30 }} />
                    }
                    
                    <View style={{flexDirection: 'column', marginLeft: 10, marginRight: 15, flex: 1}}>
                        {userBarAndTimeShowBeShown(index) &&
                            <View style={{flexDirection: 'row', alignItems:'flex-end'}}>
                                <Text style={{fontWeight: 'bold', fontSize: 14}}>
                                    { userNameForMessage(gameMessage) }
                                </Text>
                                <Text style={{color: 'gray', fontSize: 11, marginLeft: 5}}>
                                    {format(new Date(gameMessage.when), 'h:mm, a')}
                                </Text>
                            </View>
                        }
                        <Text style={{ marginTop: 5}}>
                            {gameMessage.content}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{flex: 1, flexDirection: 'column'}}>
            <StatusBar barStyle="dark-content" />
            <View style={{ height: 44, justifyContent: 'center', flexDirection: 'row' }}>
                <View style={{ width: '100%', position: 'absolute', height: '100%', justifyContent: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 16 }}>
                    <Text style={{ fontWeight: 'bold'}}>Chat</Text> in Game #{game.gameID}
                </Text>
                </View>
                <TouchableOpacity style={{ justifyContent: 'center', width: 60, position: 'absolute', left: 0, height: '100%' }}
                    disabled={false}
                    onPress={() => {
                        navigation.goBack();
                    }}>
                    <MaterialIcons name="chevron-left" size={30}/>
                </TouchableOpacity>
            </View>
            {messages.length == 0 ?
            <ScrollView 
                contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}
                keyboardShouldPersistTaps="handled"
                alwaysBounceVertical={false}>
                <Text style={{ color: 'gray' }}>
                    No message now. Please send your first message.
                </Text>
            </ScrollView>
            :
            <FlatList 
                style={{ flex: 1, transform: [{scaleY: -1}] }}
                data={ messages }
                extraData={ chatUsers }
                keyboardShouldPersistTaps="handled"
                renderItem={({item, index}) => renderMessageItem(item, index)}/>
            }
            
            <View 
                style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.1)', width: '100%'}}/>

            <View style={{ flexDirection: 'row'}}>
                <TextInput 
                    style={{ 
                        flex: 1,
                        paddingLeft: 15,
                        paddingRight: 15,
                        paddingTop: 15,
                        paddingBottom: 15
                    }}
                    multiline
                    value={inputMessage}
                    placeholder="Enter message..."
                    onChangeText={setInputMessage}/>
                
                <TouchableOpacity 
                    disabled={!setSendButtonEnabled}
                    style={{
                        width: 44,
                        justifyContent: 'flex-end',
                        paddingBottom: 10
                    }}
                    onPress={handleSend}
                >
                    <MaterialIcons name="send" size={24} color={sendButtonEnabled ? 'black' : 'rgba(0,0,0, 0.5)'}/>
                </TouchableOpacity>
            </View>

            <KeyboardSpacer topSpacing = {-(insets.bottom)}/>
        </SafeAreaView>
    );
};

export default ChatView;