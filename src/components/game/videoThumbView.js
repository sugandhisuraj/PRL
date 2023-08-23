import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import {
    TwilioVideoLocalView,
    TwilioVideoParticipantView
} from "react-native-twilio-video-webrtc";

import { firebase } from '../../firebase';
import 'firebase/firestore';

const VideoThumbView = (props) => {

    const { 
        containerStyle,
        playerId,
        playerName,
        twilioLocalVideoView,
        videoParticipantTracks,
        showStartStopButton,
        isVideoEnabled,
        _onConnectButtonPress,
        _onEndButtonPress,
        _onCameraFlip
    } = props;

    const _trackSid = useCallback(() => {
        if (videoParticipantTracks[playerId]) {
            return videoParticipantTracks[playerId].trackSid;
        } else {
            return ""
        }
    }, [videoParticipantTracks, playerId]);

    const _trackVideoEnabled = useCallback(() => {
        if (videoParticipantTracks[playerId]) {
            return videoParticipantTracks[playerId].videoEnabled;
        } else {
            return false;
        }
    }, [videoParticipantTracks, playerId]);

    const _trackIdentifier = useCallback(() => {
        return { participantSid: videoParticipantTracks[playerId].participantSid, videoTrackSid: videoParticipantTracks[playerId].trackSid };
    }, [videoParticipantTracks, playerId]);

    const playerIsMe = () => {
        return playerId === firebase.auth().currentUser.uid;
    }

    return (
        <View style={ containerStyle }>
            {playerIsMe() ? 
                    <TouchableOpacity
                        style={styles.playerContent}
                        onPress={_onCameraFlip}>
    
                        <TwilioVideoLocalView
                            ref = {twilioLocalVideoView}
                            applyZOrder={true} 
                            enabled={true} 
                            style={[styles.localVideoInsideContainer]} />

                        {!isVideoEnabled &&
                            <View style={[styles.localVideoInsideContainer, {zIndex: 100, backgroundColor: '#4f4f4f'}]}/>
                        }
                    </TouchableOpacity>
                :
                <>
                    {(_trackSid() !== "" && _trackVideoEnabled() === true) ?
                        <TwilioVideoParticipantView
                            applyZOrder={true}
                            style={[styles.playerContent]}
                            key={_trackSid()}
                            trackIdentifier={_trackIdentifier()}
                        />
                    :
                        <View style={[styles.localVideoInsideContainer, {zIndex: 10, backgroundColor: '#5f5f5f'}]}/> 
                    }
                </>
            }

            <Text style={styles.playerNameBox}>
                {playerIsMe() ? "You" : playerName }
            </Text>

            {showStartStopButton &&
            <>
                {isVideoEnabled ?
                    <TouchableOpacity
                        style={styles.stopButton}
                        onPress={_onEndButtonPress} />
                :
                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={_onConnectButtonPress} />
                }
            </>
            }
        </View>
    );

};

export default VideoThumbView;

const styles = StyleSheet.create({

    playerNameBox: { 
        textAlign: "center",
        position: 'absolute',
        backgroundColor: 'red',
        color: 'white',
        marginTop:10,
        paddingLeft:10,
        paddingRight:10,
        fontSize: 14,
        borderRadius:10,
        overflow: "hidden",
        fontWeight: "bold",
        zIndex: 10
    },

    playerContent: {
        width: '100%',
        height: '100%',
        backgroundColor: '#5f5f5f'
    },

    localVideoInsideContainer: {
        width: '100%',
        height: '100%',
        left: 0,
        right: 0,
        position: 'absolute',
    },

    startButton: {
        width: 30, 
        height: 30, 
        borderRadius: 15, 
        backgroundColor: "red", 
        position: "absolute", 
        bottom: 10, 
        left: '50%', 
        zIndex: 999,
        marginLeft: -15
    },

    stopButton: {
        width: 30, 
        height: 30, 
        borderRadius: 0, 
        backgroundColor: "red", 
        position: "absolute", 
        bottom: 10,
        left: '50%', 
        zIndex: 999,
        marginLeft: -15
    },
});