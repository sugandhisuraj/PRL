import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from "react-native";

import { firebase } from '../../firebase';

import { TwilioVideoLocalView, TwilioVideoParticipantView } from "react-native-twilio-video-webrtc";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const PlayerThumbnailView = (props) => {

    const {
        spacing,
        isRightEnd,
        isBottomEnd,
        itemWidth,
        itemHeight,
        isMuted,
        isCameraOff,
        twilioLocalVideoView,
        participantIdentify,
        participantSid,
        videoTrackSid,
        isLocalVideo,
        onPressThumbnail
    } = props;

    console.log('isLocalVideo => ', isLocalVideo, "And isMuted => ", isMuted);

    const styles = StyleSheet.create({
        contentContainer: {
            width: itemWidth,
            height: itemHeight,
            paddingLeft: spacing,
            paddingRight: isRightEnd ? spacing : 0,
            paddingTop: spacing,
            paddingBottom: isBottomEnd ? spacing : 0
        },
        container: {
            backgroundColor: 'black',
            width: '100%',
            alignItems: 'center',
            height: '100%'
        },
        statusBox: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            flexDirection: 'row',
        },
        smallButtons: {
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center'
        },
        playerNameBar: {
            position: 'absolute', 
            justifyContent: 'center',
            alignContent: 'center',
            height: 20,
            borderRadius: 10,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: 'rgba(0,0,0,0.3)',
            top: 5
        },
        playerNameText: {
            color: 'white',
        }
    });

    const videoAvailable = () => {

        if (isLocalVideo) {
            return !isCameraOff;
        }

        if (participantSid === undefined || videoTrackSid === undefined) {
            return false;
        }

        if (participantSid === '' || videoTrackSid === '') {
            return false;
        }

        return !isCameraOff;
    }

    const playerName = () => {
        if (participantIdentify === undefined || participantIdentify === '') {
            return '';
        } else {
            if (isLocalVideo) {
                return "You";
            }
            const comps = participantIdentify.split(':::');
            console.log("Name comps => ", comps);
            if (comps.length > 1) {
                return comps[1];
            } else {
                return participantIdentify;
            }
        }
    }

    return (
        <TouchableOpacity 
            onPress={onPressThumbnail}
            style={styles.contentContainer}>
            <View style={styles.container}>
                {videoAvailable() &&
                <>
                    {isLocalVideo ? 
                        <TwilioVideoLocalView
                            ref = {twilioLocalVideoView}
                            applyZOrder={true} 
                            enabled={true} 
                            style={{
                                width: '100%',
                                height: '100%',
                            }} />
                    :
                    <TwilioVideoParticipantView
                        applyZOrder={true}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                        key={participantSid}
                        trackIdentifier={{participantSid, videoTrackSid}} />
                    }
                </>
                }
                <View style={styles.statusBox}>
                    {true === isMuted &&
                        <View
                            style={styles.smallButtons}
                            onPress={() => {
                                
                            }}>
                            <MaterialIcons name="mic-off" size={16} color="white"/>
                        </View>
                    }

                    {true === isCameraOff &&
                        <View
                            style={styles.smallButtons}
                            onPress={() => {}}>
                            <MaterialIcons name="videocam-off" size={16} color="white"/>
                        </View>
                    }
                </View>
                {participantSid !== undefined &&
                <View style={styles.playerNameBar}>
                    <Text style={styles.playerNameText}>{playerName()}</Text>
                </View>
                }
            </View>
        </TouchableOpacity>
    );

    
}

export default PlayerThumbnailView;

