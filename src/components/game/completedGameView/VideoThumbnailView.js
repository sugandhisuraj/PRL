import React, { useState } from "react"; 

import { View, Text, ActivityIndicator } from "react-native";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Video } from 'expo-av';

MaterialIcons.loadFont();

const VideoThumbnailView = (props) => {

    const [videoLoaded, setVideoLoaded] = useState(false);

    return (
        <View style={{backgroundColor: 'black', flex: 1, borderRadius: 10, height: 300, margin: 10, justifyContent: 'center', alignItems: 'center'}}
            >
          {props.video.compositionStatus === "composition-available" ? (
              <Video 
                source={{uri: props.video.videoLink }}
                useNativeControls
                isLooping
                style={{width: '100%', height: '100%'}}
                onPlaybackStatusUpdate={status => {
                    console.log("Video playback status => ", status);
                    setVideoLoaded(status.isLoaded);
                }} />
          ) : (
            <Text style={{ color: 'white'}}>
              Video is being processed.({props.video.compositionProgress}%)
            </Text>
          )}
          {!videoLoaded &&
            <View style={{width: '100%', height: '100%', position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator />
            </View>
          }
        </View>
      );
};

export default VideoThumbnailView;