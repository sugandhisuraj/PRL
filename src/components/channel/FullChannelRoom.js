import React, { useEffect, useState, useRef } from "react";
import { useSelector } from 'react-redux';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    PermissionsAndroid,
    View,
    Text,
    ActivityIndicator
} from "react-native";

import { StatusBar } from "react-native";
import { useAdsBanner } from '@hooks';
import CallControlView from "./CallControlView";
import PlayerThumbnailView from "./PlayerThumbnailView";
import { TwilioVideo } from "react-native-twilio-video-webrtc";
import LoadingOverlayView from './LoadingOverlayView';

import { firebase } from '../../firebase';

import SystemSetting from 'react-native-system-setting';

const FullChannelRoomView = (props) => {

    const audioType = "system";

    const {
        navigation, route
    } = props;

    const {
        eventId,
        eventName,
    } = route.params;

    const { auth } = useSelector(s => s);

    const [
        renderBanner,
        BannerAdsComponent
    ] = useAdsBanner(auth);

    const twilioAuthString = "Basic QUM0ZTZkOWVhMzlhZjBjMTc3Yzc2NjVjZDI4YjgwMzZlODplZTdmZmM5ZTg4ZjIwNGIxNzRiZDBmNTllMTZiNjViMw==";
    const twilioAuthHeader = {"Authorization": twilioAuthString};

    const twilioVideo = useRef(null);
    const twilioLocalVideoView = useRef(null);

    const [roomConnected, setRoomConnected] = useState(false);
    const [accessToken, setAccessToken] = useState("");

    const [videoParticipantTracks, setVideoParticipantTracks] = useState({});
    const [roomSid, setRoomSid] = useState("");
    const [participants, setParticipants] = useState([]);

    const [muted, setMuted] = useState(true);
    const [isCameraOn, setCameraOn] = useState(true);
    const [isSpeakerOn, setSpeakerOn] = useState(true);

    const [originalVolume, setOriginalVolume] = useState(0);

    const [outDisconnecting, setOutDisconnecting] = useState(false);

    let disconnected = false;

    const eventRoomName = `Event-${eventId}`;

    const handleMuteOnOff = () =>  {
        console.log('Local audio enabled to => ', muted);
        twilioVideo.current.setLocalAudioEnabled(muted);
        setMuted(!muted);
    }

    const handleVideoOnOff = () =>  {
        twilioVideo.current.setLocalVideoEnabled(!isCameraOn);
        setCameraOn(!isCameraOn);
    }

    const handleSpeakerOnOff = () => {
        if (isSpeakerOn) {
            console.log("Set system volume to 0.01");
            SystemSetting.setVolume(0, {type: audioType, showUI: true});
        } else {
            console.log("Set system volume to ", originalVolume);
            SystemSetting.setVolume(originalVolume, {type: audioType, showUI: true});
        }
        setSpeakerOn(!isSpeakerOn);
    }

    const handleEndCall = () => {
        SystemSetting.setVolume(originalVolume, {type: audioType, showUI: true});
        setOutDisconnecting(true);
        twilioVideo.current.disconnect();
        // navigation.goBack();
    }

    const calcNumberOfRows = () => {
        return 3;
    }

    const calcItemWidth = (isRightEnd) => {
        const windowWidth = Dimensions.get('window').width;
        const itemContentWidth = (windowWidth - 5 * (calcNumberOfRows() + 1)) / calcNumberOfRows();

        if (isRightEnd) {
            return (itemContentWidth + 10);
        } else {
            return itemContentWidth + 5;
        }
    }

    const calcItemHeight = () => {
        return 150;
    }

    const _processTwilioRoom = async () => {

        const response = await fetch(`https://video.twilio.com/v1/Rooms?UniqueName=${eventRoomName}&Status=in-progress`, {
            method: 'GET',
            headers: twilioAuthHeader
        });

        const responseJSON = await response.json();
        if (responseJSON.rooms === undefined || responseJSON.rooms.length == 0) {
            
            const requestBody = `UniqueName=${eventRoomName}&RecordParticipantsOnConnect=True`;
                
            const createRoomResponse = await fetch('https://video.twilio.com/v1/Rooms', {
                body: requestBody,
                headers: {"Authorization": twilioAuthString, "Content-Type": 'application/x-www-form-urlencoded'},
                method: 'POST'
            });
            const createRoomResponseJson = await createRoomResponse.json();
            if (!disconnected) {
                _loadAccessToken();
            }
        } else {
            // console.log("Event room already created. => ", responseJSON.rooms[0]);
            if (!disconnected) {
                _loadAccessToken();
            }
        }
    };

    const _loadAccessToken = async () => {

        var firebaseUser = firebase.auth().currentUser;
        if (firebaseUser !== null) {

            try {

                const userDoc = await firebase.firestore().collection("users").doc(firebaseUser.uid).get();
                const userName = userDoc.data().userName;

                const twilioClientId = `${firebaseUser.uid}:::${userName}`;

                const response = await fetch(
                    'https://us-central1-players-recreation-league.cloudfunctions.net/twilioAccessToken',
                    { 
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' }, 
                        body: JSON.stringify({ client_identify: twilioClientId, room_name: eventRoomName }) 
                    });
                const token = await response.text();
                if (!disconnected) {
                    setAccessToken(token);
                }
            } catch (err) {
                console.log("ACCESS token loading failed => ", err);
            }
            
        }
    };

    const _connectRoom = async () => {

        if (Platform.OS === "android") {
          await _requestAudioPermission();
          await _requestCameraPermission();
        }
        
        if (!disconnected) {
            twilioVideo.current.connect({ 
                accessToken: accessToken, 
                enableNetworkQualityReporting: true, 
                enableVideo: true, 
                enableAudio: false 
            });
        }
    };

    const _requestAudioPermission = () => {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Need permission to access microphone",
            message:
              "To broadcast your play, please allow the PRL app access to your microphone",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
    };
    
    const _requestCameraPermission = () => {
        return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
          title: "Need permission to access camera",
          message: "To broadcast your play, please allow the PRL app access to your camera",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        });
    };

    const processParticipantAudioTrack = (participant, track) => {

        if (participant.identity.startsWith("web")) {
            return;
        }

        let videoParticipantTrack = videoParticipantTracks[participant.identity];

        if (videoParticipantTrack === undefined) {
            videoParticipantTracks[participant.identity] = {
                participantIdentify: participant.identity,
                participantSid: participant.sid,
                audioTrackSid: track.trackSid,
                audioEnabled: track.enabled,
            };
        } else {
            videoParticipantTrack.audioTrackSid = track.trackSid;
            videoParticipantTrack.audioEnabled = track.enabled;

            videoParticipantTracks[participant.identity] = videoParticipantTrack;
        }

        if (!disconnected) {
            setVideoParticipantTracks({...videoParticipantTracks});
        }
    }

    const processParticipantVideoTrack = (participant, track) => {

        if (participant.identity.startsWith("web")) {
            return;
        }

        let videoParticipantTrack = videoParticipantTracks[participant.identity];

        if (videoParticipantTrack === undefined) {
            videoParticipantTracks[participant.identity] = {
                participantIdentify: participant.identity,
                participantSid: participant.sid,
                videoTrackSid: track.trackSid,
                videoEnabled: track.enabled,
            };
        } else {
            videoParticipantTrack.videoTrackSid = track.trackSid;
            videoParticipantTrack.videoEnabled = track.enabled;

            videoParticipantTracks[participant.identity] = videoParticipantTrack;
        }

        if (!disconnected) {
            setVideoParticipantTracks({...videoParticipantTracks});
        }
    }

    useEffect(() => {
        console.log("REMOTE participants => ", participants.length);
    }, [participants]);

    useEffect(() => {
        if (accessToken !== undefined && accessToken !== "") {
            _connectRoom();
        }
    }, [accessToken]);

    useEffect(() => {
        console.log("videoParticipantTracks updated.");
        setParticipants([...Object.values(videoParticipantTracks)]);
    }, [videoParticipantTracks]);

    useEffect(() => {
        if (eventId !== "") {
            _processTwilioRoom();
        }
    }, [eventId]);

    useEffect(() => {

        SystemSetting.getVolume(audioType).then(volume => {
            console.log('Current volume is ' + volume);
            setOriginalVolume(volume);
        });

        return () => {
            disconnected = true;
        }
    }, []);

    return (
        <View style={{ height: '100%', backgroundColor: '#0B214D', flexDirection: 'column' }}>

            <StatusBar barStyle="light-content" />

            {/* <NavHeaderView 
                onBack={() => navigation.goBack()}
            /> */}
            {!roomConnected ?
            <LoadingOverlayView />
            :
            <View style={{
                flex: 1
            }}>
                <FlatList
                    contentContainerStyle={styles.flatListContentContainer}
                    numColumns={3}
                    keyExtractor={({index}) => index}
                    data={participants}
                    renderItem={({item, index}) => {
                        const firebaseUser = firebase.auth().currentUser;
                        const isLocal = item.participantIdentify.startsWith(firebaseUser.uid);
                        return (
                            <PlayerThumbnailView 
                                onPressThumbnail={() => {
                                    if (isLocal) {
                                        twilioVideo.current.flipCamera();
                                    }
                                }}
                                spacing={5}
                                twilioLocalVideoView={twilioLocalVideoView}
                                isLocalVideo={isLocal}
                                isRightEnd={index % 3 === 2}
                                isBottomEnd = {false}
                                isMuted={isLocal ? muted : true !== item.audioEnabled}
                                isCameraOff={isLocal ? !isCameraOn : true !== item.videoEnabled}
                                itemWidth={calcItemWidth(index % 3 === 2)}
                                itemHeight={calcItemHeight()}
                                participantIdentify={item.participantIdentify}
                                videoTrackSid={item.videoTrackSid}
                                participantSid={item.participantSid}/>
                        )
                    }}
                />

                <CallControlView 
                    eventId={eventId}
                    eventName={eventName}
                    peopleCount={participants.length}
                    eventName={eventName}
                    isMuted={muted}
                    isCameraOn={isCameraOn}
                    isSpeakerOn={isSpeakerOn}
                    onMuteOnOff={handleMuteOnOff}
                    onEndCall={handleEndCall}
                    onCameraOnOff={handleVideoOnOff}
                    onSpeakerOnOff={handleSpeakerOnOff}/>

                {outDisconnecting &&
                    <View style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.3)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                    }}>
                        <ActivityIndicator 
                            color="white"/>
                        <Text style={{
                            marginTop: 10,
                            color: 'white'
                        }}>
                            Disconnecting...
                        </Text>
                    </View>
                }
            </View>
            }

            {renderBanner &&
            <View style={styles.bannerAdContainer}>
                <BannerAdsComponent />
            </View>
            }

            <TwilioVideo
                ref={twilioVideo}
                onCameraDidStart={() => {
                    console.log("Camera did start");
                }}
                onCameraDidStopRunning={() => {
                    console.log("Camera did stop running");
                }}
                onCameraWasInterrupted={() => {
                    console.log("Camera was interrupted");
                }}
                onParticipantAddedAudioTrack={({participant, track}) => {
                    console.log("Participant added audio track with params => ", "participant => ", participant, "track => ", track);
                    /*
                    {"participant": {"identity": "frLRs3WmjIdictNWKqUWmcInAVN2:::Rick Gmail", "sid": "PA59e9815af21d7c85ba93849259127024"}, 
                    "track": {"enabled": true, "trackName": "microphone", "trackSid": "MT82e05b933d2a9657095c001edde0536e"}}
                    */
                    processParticipantAudioTrack(participant, track);
                }}
                onParticipantAddedVideoTrack={({participant, track}) => {
                    console.log("Participant added video track with params => ", "participant =>", participant, "track => ", track);
                    /*{"participant": {"identity": "oKajCJzjKnctAiaNZCVhEx1cylq2:::Ichiro Outlook", "sid": "PAb43983dc6afecacb60458c6ffd401140"}, 
                        "track": {"enabled": true, "trackName": "camera", "trackSid": "MT45c3c15aca27f6164a1020c02e86f81d"}}
                    */

                    processParticipantVideoTrack(participant, track);
                }}
                onParticipantDisabledVideoTrack={({participant, track}) => {
                    console.log("Participant disabled video track with params => ", "participant => ", participant, "track => ", track);
                    processParticipantVideoTrack(participant, track);
                }}
                onParticipantDisabledAudioTrack={({participant, track}) => {
                    console.log("Participant disabled audio track with params => ", "participant => ", participant, "track => ", track);
                    /*
                    {"participant": {"identity": "frLRs3WmjIdictNWKqUWmcInAVN2:::Rick Gmail", "sid": "PA59e9815af21d7c85ba93849259127024"}, 
                    "track": {"enabled": true, "trackName": "microphone", "trackSid": "MT82e05b933d2a9657095c001edde0536e"}}
                    */
                    processParticipantAudioTrack(participant, track);
                }}
                onParticipantEnabledVideoTrack={({participant, track}) => {
                    console.log("Participant enabled video track with params => ", "participant => ", participant, "track => ", track);
                    processParticipantVideoTrack(participant, track);
                }}
                onParticipantEnabledAudioTrack={({participant, track}) => {
                    console.log("Participant added audio track with params => ", "participant => ", participant, "track => ", track);
                    processParticipantAudioTrack(participant, track);
                }}
                onParticipantRemovedAudioTrack={(params) => {
                    console.log("Participant removed audio track with params => ", params);

                }}
                onParticipantRemovedVideoTrack={(params) => {
                    console.log("Participant removed video track with params => ", params);
                    /*
                    {"participant": {
                        "identity": "oKajCJzjKnctAiaNZCVhEx1cylq2:::Ichiro Outlook", 
                        "sid": "PAb43983dc6afecacb60458c6ffd401140"}, 
                        "track": {"enabled": true, "trackName": "camera", "trackSid": "MT45c3c15aca27f6164a1020c02e86f81d"}}
                    */

                }}
                onRoomDidConnect={({participants, roomName, roomSid}) => {
                    console.log("Room did connect with => ", "roomName", roomName, "roomSid", roomSid, "participants", participants);
                    // participants": [{"identity": "frLRs3WmjIdictNWKqUWmcInAVN2:::Rick Gmail", "sid": "PA2608873303bf8638d20e5e93de066d7b"}], 
                    // "roomName": "Event-2", 
                    // "roomSid": "RM2ed0343177248312ea87f623a38d3bab"

                    twilioVideo.current.setLocalAudioEnabled(!muted);
                    twilioVideo.current.toggleSoundSetup(true);
                    // twilioVideo.current.setRemoteAudioEnabled(false);
                    setRoomConnected(true);

                    let currentTracks = videoParticipantTracks;
                    participants.forEach(participant => {
                        currentTracks[participant.identity] = {
                            participantIdentify: participant.identity,
                            participantSid: participant.sid
                        };
                    });
            
                    setVideoParticipantTracks({...currentTracks});            
                }}
                onRoomDidDisconnect={({roomName, roomSid}) => {
                    console.log("Room did disconnect with params => ", "roomName", roomName, "roomSid", roomSid);
                    //  {"roomName": "Event-2", "roomSid": "RM2ed0343177248312ea87f623a38d3bab"}
                    if (outDisconnecting) {
                        setOutDisconnecting(false);
                    }
                    navigation.goBack();
                }}
                onRoomDidFailToConnect={(params) => {
                    console.log("Room did fail to connect with params => ", params);
                }}
                onRoomParticipantDidConnect={({participant, roomName, roomSid}) => {
                    /*
                    {"participant": {
                        "identity": "oKajCJzjKnctAiaNZCVhEx1cylq2:::Ichiro Outlook", 
                        "sid": "PAb43983dc6afecacb60458c6ffd401140"
                        }, 
                        "roomName": "Event-2", "roomSid": "RM113c56a480219923d8df972bed15e113"}
                    */
                    console.log("Room participant did connect with params => ", "participant => ", participant);

                    videoParticipantTracks[participant.identity] = {
                        participantIdentify: participant.identity,
                        participantSid: participant.sid
                    };
                    
                    if (!disconnected) {
                        setVideoParticipantTracks({...videoParticipantTracks});
                    }
                }}
                onRoomParticipantDidDisconnect={({participant, roomName, roomSid}) => {
                    console.log("Room participant did disconnect with params => ", "participant => ", participant);

                    delete videoParticipantTracks[participant.identity];
        
                    if (!disconnected) {
                        setVideoParticipantTracks({...videoParticipantTracks});
                    }
                }}
                onNetworkQualityLevelsChanged={(params) => {
                    // console.log("Network quality levels changed with params => ", params);
                }}
                onStatsReceived={(params) => {
                    console.log("Stats received with params => ", params);
                }}
                onDataTrackMessageReceived={(params) => {
                    console.log("Data track message received with params => ", params);
                }}/>
        </View>
    );
};

export default FullChannelRoomView;

const styles = StyleSheet.create({
    flatListContentContainer: {
        width: '100%',
        height: '100%',
        marginTop: 40,
    },
    bannerAdContainer: {
        width: '100%', 
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})