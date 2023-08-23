import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  ActivityIndicator,
  Platform,
} from "react-native";

import { firebase } from '../../firebase';
import 'firebase/firestore';

import {
    TwilioVideo
} from "react-native-twilio-video-webrtc";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import VideoThumbView from "./videoThumbView";

import { format } from 'date-fns';


const VideoBroadcastingView = (props) => {

    const { 
        gameScheduleId,
        gameData,
        playingMode,
        player1Name, 
        player2Name, 
        playerId1, 
        playerId2,
    } = props;

    const twilioAuthString = "Basic QUM0ZTZkOWVhMzlhZjBjMTc3Yzc2NjVjZDI4YjgwMzZlODplZTdmZmM5ZTg4ZjIwNGIxNzRiZDBmNTllMTZiNjViMw==";
    const twilioAuthHeader = {"Authorization": twilioAuthString};

    const twilioVideo = useRef(null);
    const twilioLocalVideoView = useRef(null);

    const [isLoadingToken, setLoadingToken] = useState(true);
    const [accessToken, setAccessToken] = useState();

    const [videoParticipantTracks, setVideoParticipantTracks] = useState({});
    const [roomSid, setRoomSid] = useState("");
    
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const [status, setStatus] = useState("disconnected");

    const [showLayoutControls, setShowLayoutControls] = useState(false);
    const [layoutMode, setLayoutMode] = useState(Platform.OS === 'android' ? 2 : 0);    // 0 for sidebar layout, 1 for grid layout, 2 for side by side

    const [showingPlayer1Id, setShowingPlayer1Id] = useState(playerId1);
    const [showingPlayer2Id, setShowingPlayer2Id] = useState(playerId2);
    const [showingPlayer1Name, setShowingPlayer1Name] = useState(player1Name);
    const [showingPlayer2Name, setShowingPlayer2Name] = useState(player2Name);
    const [playerNamesSwitched, setPlayerNamesSwitched] = useState(false);

    let disconnected = false;

    useEffect(() => {
        if (!playerNamesSwitched) {
            setShowingPlayer1Name(player1Name);
            setShowingPlayer2Name(player2Name);
        } else {
            setShowingPlayer1Name(player2Name);
            setShowingPlayer2Name(player1Name);
        }
    }, [player1Name, player2Name]);

    useEffect(() => {
        if (gameData !== undefined) {
            _processTwilioRoom();
        }
    }, [gameScheduleId]);

    useEffect(() => {
        if (accessToken !== undefined) {
            _connectRoom();
        }
    }, [accessToken]);

    useEffect(() => {
        return () => {
            console.log('disconnecting');
            twilioVideo.current.disconnect();
            disconnected = true;
        }
    }, []);

    const _processTwilioRoom = async () => {

        const response = await fetch(`https://video.twilio.com/v1/Rooms?UniqueName=${gameScheduleId}&Status=in-progress`, {
            method: 'GET',
            headers: twilioAuthHeader
        });

        const responseJSON = await response.json();
        if (responseJSON.rooms === undefined || responseJSON.rooms.length == 0) {
            
            const requestBody = `UniqueName=${gameScheduleId}&RecordParticipantsOnConnect=${(gameData.gameRecordingOn === undefined || gameData.gameRecordingOn === false) ? 'False' : 'True'}`;
                
            const createRoomResponse = await fetch('https://video.twilio.com/v1/Rooms', {
                body: requestBody,
                headers: {"Authorization": twilioAuthString, "Content-Type": 'application/x-www-form-urlencoded'},
                method: 'POST'
            });
            const createRoomResponseJson = await createRoomResponse.json();
            console.log("Create room response - ", createRoomResponseJson);
            if (!disconnected) {
                _loadAccessToken();
            }
        } else {
            console.log("Room already created. => ", responseJSON.rooms[0]);
            if (!disconnected) {
                _loadAccessToken();
            }
        }
    };

    const _loadAccessToken = () => {

        console.log('Loading Twilio room access token => +++++++++++++++++++++++++ ');
        var firebaseUser = firebase.auth().currentUser;
        if (firebaseUser !== null) {

            fetch('https://us-central1-players-recreation-league.cloudfunctions.net/twilioAccessToken',
                { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ client_identify: firebaseUser.uid, room_name: gameScheduleId }) })
            .then((response) => response.text())
            .then((token) => {
                if (!disconnected) {
                    setAccessToken(token);
                    setLoadingToken(false);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => {
                if (!disconnected) {
                    setLoadingToken(false)
                }
            });
        }
    };

    const _connectRoom = async () => {

        console.log('Connecting room with access token -> ', accessToken);

        if (Platform.OS === "android") {
          await _requestAudioPermission();
          await _requestCameraPermission();
        }
        
        if (!disconnected) {
            twilioVideo.current.connect({ accessToken: accessToken, enableNetworkQualityReporting: true, enableVideo: playingMode, enableAudio: playingMode });
            setStatus("connecting");
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

    const _onConnectButtonPress = async () => {
        console.log('_onConnectButtonPress');
        twilioVideo.current.setLocalVideoEnabled(true).then(isEnabled => {
          console.log("Local video finally enabled");
          setIsVideoEnabled(true);
    
          if (roomSid !== "") {
            fetch('https://video.twilio.com/v1/Rooms/' + roomSid + '/Participants/' + firebase.auth().currentUser.uid, {
                method: 'GET',
                headers: twilioAuthHeader
              })
              .then((response) => response.json())
              .then((participantDataForMe) => {
    
                const accountSId = participantDataForMe.account_sid;
                const participantSId = participantDataForMe.sid;
                const participantIdentify = participantDataForMe.identity;

                let gameRef = firebase.firestore().collection("gameSchedule").doc(gameScheduleId);
                gameRef.update({currentTwilioRoomSid: roomSid});
    
                let data = {roomSid: roomSid};
                data[participantSId] = {userId: participantIdentify, accountSId: accountSId, participantSId: participantSId, when: format(new Date(), "yyyy-MM-dd HH:mm:ss xxx")};
                gameRef.collection("twilioRooms").doc(roomSid).set(data, {merge: true});
              });
          }
        });
        twilioVideo.current.setLocalAudioEnabled(true).then(isEnabled => {
          console.log("Local audio finally enabled");
        });
    };

    const _onCameraFlip = () => {
        if (isPlayingMode()) {
            twilioVideo.current.flipCamera();
        }
    };
    
    
    const _onEndButtonPress = () => {
        twilioVideo.current.setLocalVideoEnabled(false);
        twilioVideo.current.setLocalAudioEnabled(false);
        setIsVideoEnabled(false);
    };

    /*
    * Twilio room callbacks
    */
   // ====================
   const _onRoomDidConnect = ({roomSid, roomName}) => {
        console.log("Successfully connected to room, with room sid, roomName", roomSid, roomName);

        setRoomSid(roomSid);
        
        twilioVideo.current.setLocalVideoEnabled(false);
        twilioVideo.current.setLocalAudioEnabled(false);

        setIsVideoEnabled(false);
        setStatus("connected");
    };

    const _onRoomDidDisconnect = ({ error }) => {
        // console.log("Room did disconnect, error => ", error);
        setStatus("disconnected");
        // if (overlayedLoading) {
        //   setOverlayedLoading(false);
    
        //   if (unsubscribeRef?.current) {
        //     console.log("unsubscribing snapshot in GameView before going back");
        //     unsubscribeRef?.current();
        //   }
    
        //   navigation.goBack();
        // }
      };
    
    const _onRoomDidFailToConnect = (error) => {
        console.log("Room did failed to connect, error => ", error);
    
        if (!disconnected) {
            setStatus("disconnected");
        }
    
        console.log("Trying reconnect...");
        // connectRoom(accessToken);
    };
    
    const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    
        console.log("onParticipantAddedVideoTrack: ", participant, track);
        console.log("Participant added video track - sid - ", track.trackSid, " Participant Sid ", participant.sid);
    
        videoParticipantTracks[participant.identity] = {
          trackSid: track.trackSid,
          participantSid: participant.sid,
          videoEnabled: track.enabled
        };
        
        console.log("new PTracks => ", videoParticipantTracks);
        if (!disconnected) {
            setVideoParticipantTracks({...videoParticipantTracks});
        }
    
    };

    const _onParticipantEnabledVideoTrack = ({ participant, track }) => {
        console.log("onParticipant enabled video track: ", participant, track);
        videoParticipantTracks[participant.identity] = {
            trackSid: track.trackSid,
            participantSid: participant.sid,
            videoEnabled: true
          };
  
          if (!disconnected) {
              setVideoParticipantTracks({...videoParticipantTracks});
          }
    };

    const _onParticipantDisabledVideoTrack = ({ participant, track }) => {
        console.log("onParticipant disabled video track: ", participant, track);
        videoParticipantTracks[participant.identity] = {
            trackSid: track.trackSid,
            participantSid: participant.sid,
            videoEnabled: false
        };

        if (!disconnected) {
            setVideoParticipantTracks({...videoParticipantTracks});
        }
    };
    
    const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
        console.log("onParticipantRemovedVideoTrack: ", participant, track);
        
        videoParticipantTracks[participant.identity] = {
          trackSid: "",
          participantSid: "",
          videoEnabled: false
        };

        if (!disconnected) {
            setVideoParticipantTracks({...videoParticipantTracks});
        }
      };
    
    const _onNetworkLevelChanged = ({ participant, isLocalUser, quality }) => {
        console.log("Participant", participant, "isLocalUser", isLocalUser, "quality", quality);
    };

    const _camStarted = () => {
        console.log("Camera started");
    };

    const switchPlayerVideos = () => {        
        
        const playerId = showingPlayer2Id;
        const playerName = showingPlayer2Name;
        setPlayerNamesSwitched(!playerNamesSwitched);
        setShowingPlayer2Id(showingPlayer1Id);
        setShowingPlayer2Name(showingPlayer1Name);
        setShowingPlayer1Id(playerId);
        setShowingPlayer1Name(playerName);
        setShowLayoutControls(false);
    }

    const playerIsMe = (playerId) => {
        return playerId === firebase.auth().currentUser.uid;
    }

    const isPlayingMode = () => {
        return playerIsMe(playerId1) || playerIsMe(playerId2)
    }

    const styleForFirstBox =  () => {
        if (layoutMode === 0) {
            return styles.firstPlayerBox;
        }

        if (layoutMode === 1) {
            return styles.gridFirstPlayerBox;
        }

        return styles.sideBySideFirstBox;
    }

    const styleForSecondBox =  () => {
        if (layoutMode === 0) {
            return styles.smallVideoBox;
        }

        if (layoutMode === 1) {
            return styles.gridSecondPlayerBox;
        }

        return styles.sideBySideSecondBox;
    }

    return (
        <View style={[
            styles.fullContainer,
            layoutMode === 2 && { flexDirection: 'row' }
        ]}>
            {isLoadingToken &&
                <View style={styles.loadingSpinnerContainer}>
                    <ActivityIndicator />
                </View>
            }
            {!isLoadingToken &&
            <>
                {(status === "connecting") &&
                    <Text style={styles.connectingText}>
                        Connecting...
                    </Text>
                }

                {(status === "connected") &&
                    <>
                        <VideoThumbView 
                            containerStyle={ styleForFirstBox() }
                            playerId={showingPlayer2Id}
                            playerName={showingPlayer2Name}
                            twilioLocalVideoView={twilioLocalVideoView}
                            videoParticipantTracks={videoParticipantTracks}
                            showStartStopButton={isPlayingMode() && (layoutMode === 0 || playerIsMe(showingPlayer2Id))}
                            isVideoEnabled={isVideoEnabled}
                            _onConnectButtonPress={_onConnectButtonPress}
                            _onEndButtonPress={_onEndButtonPress}
                            _onCameraFlip={_onCameraFlip}/>
                        
                        <VideoThumbView 
                            containerStyle={ styleForSecondBox() }
                            playerId={showingPlayer1Id}
                            playerName={showingPlayer1Name}
                            twilioLocalVideoView={twilioLocalVideoView}
                            videoParticipantTracks={videoParticipantTracks}
                            showStartStopButton={isPlayingMode() && (layoutMode !== 0 && playerIsMe(showingPlayer1Id))}
                            isVideoEnabled={isVideoEnabled}
                            _onCameraFlip={_onCameraFlip}
                            _onConnectButtonPress={_onConnectButtonPress}
                            _onEndButtonPress={_onEndButtonPress}/>
                        
                        <TouchableOpacity 
                            onPress={() => setShowLayoutControls(!showLayoutControls)}
                            style={styles.horizDotsButton}>
                                <MaterialIcons 
                                    color="white"
                                    size={18}
                                    name="more-horiz"/>
                        </TouchableOpacity>

                        {showLayoutControls &&
                            <View style={styles.layoutControlButtonsContainer}>
                                <TouchableOpacity 
                                    onPress={switchPlayerVideos}
                                    style={styles.layoutControlRowButton}>
                                        <Feather name="refresh-ccw" color="white" size={20} />
                                        <Text style={styles.layoutControlRowButtonText}>
                                            Switch players
                                        </Text>
                                </TouchableOpacity>
                                <Text style={[styles.layoutControlRowButtonText, { marginTop: 10 }]}>
                                    Change Layout
                                </Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: 5
                                }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setLayoutMode(0)
                                            setShowLayoutControls(false);
                                        }}
                                        style={styles.layoutIconsButton}>
                                            <MaterialCommunityIcons 
                                                name="page-layout-sidebar-right" 
                                                color={layoutMode === 0 ? 'white' : 'rgba(255,255,255,0.5)'}
                                                size={20} />
                                        
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setLayoutMode(1);
                                            setShowLayoutControls(false);
                                        }}
                                        style={styles.layoutIconsButton}>
                                            <MaterialCommunityIcons 
                                                name="view-stream" 
                                                color={layoutMode === 1 ? 'white' : 'rgba(255,255,255,0.5)'}
                                                size={20} />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setLayoutMode(2);
                                            setShowLayoutControls(false);
                                        }}
                                        style={styles.layoutIconsButton}>
                                        <MaterialCommunityIcons 
                                            name="view-parallel" 
                                            color={layoutMode === 2 ? 'white' : 'rgba(255,255,255,0.5)'}
                                            size={20} />    
                                    </TouchableOpacity>
                                </View>
                                {/* <TouchableOpacity 
                                    onPress={switchLayouts}
                                    style={[styles.layoutControlRowButton, {marginLeft: 15}]}>
                                        {layoutMode === 0 ? 
                                        <MaterialCommunityIcons name="view-stream" color="white" size={20} />
                                        :
                                        <MaterialCommunityIcons name="page-layout-sidebar-right" color="white" size={20} />
                                        }
                                        <Text style={styles.layoutControlRowButtonText}>
                                            {layoutMode === 0 ? "Grid Layout" : "Sidebar Layout"}
                                        </Text>
                                </TouchableOpacity> */}
                            </View>
                        }
                    </>
                }
            </>
            }

            <TwilioVideo
                ref={twilioVideo}
                onRoomDidConnect={_onRoomDidConnect}
                onRoomDidDisconnect={_onRoomDidDisconnect}
                onRoomDidFailToConnect={_onRoomDidFailToConnect}
                onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
                onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
                onParticipantEnabledVideoTrack={_onParticipantEnabledVideoTrack}
                onParticipantDisabledVideoTrack={_onParticipantDisabledVideoTrack}
                onParticipantDisabledAudioTrack={() => {
                    console.log("Participant disabled audio track");
                }}
                onParticipantRemovedAudioTrack={() => {
                    console.log("Participant removed audio track");
                }}
                onNetworkQualityLevelsChanged={_onNetworkLevelChanged}
                onCameraDidStart={_camStarted} />
        </View>
    );
}

export default VideoBroadcastingView;

const styles = StyleSheet.create({

    fullContainer: {
        flex: 4,
        borderRadius:15,
        backgroundColor: '#dfdfdf',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
    },

    loadingSpinnerContainer: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    firstPlayerBox: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#3f3f3f'
    },

    gridFirstPlayerBox: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#3f3f3f'
    },

    gridSecondPlayerBox: {
        backgroundColor: '#4f4f4f',
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
    },

    sideBySideFirstBox: {
        flex: 1,
        alignItems: 'center',
        height: '100%'
    },

    sideBySideSecondBox: {
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
        height: '100%',
    },

    horizDotsButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
        position: 'absolute',
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        top: 5
    },

    layoutControlButtonsContainer: {
        flexDirection: 'column',
        width: 140,
        position: 'absolute',
        right: 10,
        top: 40,
        borderRadius: 5,
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },

    layoutIconsButton : {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },

    layoutControlRowButton: {
        flexDirection: 'row',
        height: 36,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },

    layoutControlRowButtonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 12
    },

    connectingText: { 
        position: "absolute", 
        width: 200, 
        bottom: 10, 
        left: '50%', 
        marginLeft: -100 
    },

    startButton: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        backgroundColor: "red", 
        position: "absolute", 
        bottom: 10, 
        left: '50%', 
        marginLeft: -15
    },

    stopButton: {
        width: 30, 
        height: 30, 
        borderRadius: 0, 
        backgroundColor: "red", 
        position: "absolute", 
        bottom: 30, 
        left: '50%', 
        marginLeft: -30
    },

    smallVideoBox: {
        width: 80,
        height: 120,
        borderRadius:10,
        backgroundColor: '#adadad',
        position: "absolute",
        bottom: 10,
        right: 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden'
    }
});

