import React, { memo, useEffect, useState, useImperativeHandle } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert,
  Image,
  Platform,
  Keyboard,

} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { createThumbnail } from "react-native-create-thumbnail";

import Modal from "react-native-modal";
import { Video } from 'expo-av';

// import Video from "react-native-video";
import Styles from "./indexCss";
import { getWp, wp, hp } from "@utils";
import { WebView } from "react-native-webview";
// import RNVideoHelper from 'react-native-video-helper';
// import ImageResizer from 'react-native-image-resizer';
AntDesign.loadFont();
MaterialIcons.loadFont();

//mode = "view" : "select";
const ImageVideoPlaceholder = React.forwardRef((props, ref) => {
  const {
    renderText = "",
    type,
    selectedData = () => { },
    containerStyle = {},
    mode = "select",
    viewURI = undefined,
    resetViewURI = () => { },
    imageStyle = {},
    renderChildren = false,
    disabledOnPress = false,
    wantThumbnail = true
  } = props;
  const [data, setData] = useState({ type, content: undefined });
  const [modalVisibility, setModalVisibility] = useState(false);
  const [thumbnail, setThumbnail] = useState(undefined);
  const [permissionStatus, setPermissionStatus] = useState(false);
  useEffect(() => {
    return;
    if (mode == 'view' && type == 'video' && wantThumbnail) {
      createThumbnail({
        url: viewURI,
        timeStamp: 10000,
      })
        .then(response => {
          console.log('ON_THUMNAIL_GET - ', response);
          setThumbnail(response);
        })
        .catch(err => console.log({ err }));
    }
  }, []);
  useEffect(() => {
    (async () => {
      await getCameraRequest();
    })();
  }, []);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setData({ type, content: undefined });
    },
  }));
  const getCameraRequest = async () => {
    if (Platform.OS == "android") {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status == "granted") {
        setPermissionStatus(true);
      }else if (status != "granted") {
        setPermissionStatus(false);
        //alert("Sorry, we need camera roll permissions to make this work!");
      }
      return status;
    }
  };



  const pickImage = async () => {
    try {
      if (permissionStatus == false && Platform.OS == "android") {
         let permissionSt = await getCameraRequest();
         if (permissionSt != 'granted') {
            return;
         }
      }
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          type == "photo"
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos,
        quality: 1,
      });
      if (!result.cancelled) {
        const sourceUri = result.uri;
        //TEST FOR RESIZE DATA - 
        if (type == 'video') {
          setData({
            type,
            content: result,
          });
          selectedData(result.uri);
          return;
          // RNVideoHelper.compress(sourceUri, {
          //   startTime: 0,
          //   endTime: 5,
          //   quality: 'low',
          //   defaultOrientation: 0
          // }).progress(value => {
          //   console.warn('progress', value);
          // }).then(compressedUri => {
          //   console.warn('compressedUri', compressedUri);
          //   setData({
          //     type,
          //     content: {
          //       ...result,
          //       uri: compressedUri
          //     },
          //   });
          //   selectedData(compressedUri);
          // });
        } else {
          setData({
            type,
            content: result,
          });
          return selectedData(result.uri);
            // ImageResizer.createResizedImage(sourceUri, 800, 800, 'JPEG', 100, 0, null)
            // .then(response => {
            //   console.log('IMAGE_RESIZE_TEST_HERE - ', response.uri);
            //   setData({
            //     type,
            //     content: {
            //       ...result,
            //       uri: response.uri
            //     },
            //   });
            //   selectedData(response.uri); 
            // })
            // .catch(err => {
            //   return Alert.alert('Message', 'Invalid Image!');
            // });
        } 
        return
        setData({
          type,
          content: result,
        });
        selectedData(result.uri);
      }
    } catch (error) {
      Alert.alert("Message", "Something went wrong!");
      console.log(error);
    }
  };
  const RenderImagePlaceholderText = () => {
    return <Text style={Styles.textStyle}>{renderText}</Text>;
  };
  const selectOnPressHandler = () => {
    Keyboard.dismiss();
    if (viewURI || viewURI?.length > 0 || mode == "view") {
      return setModalVisibility(true);
    }
    try {
      if (!data.content) {
        return pickImage();
      }

      return setModalVisibility(true);
    } catch (error) {
      return Alert.alert("Message", "Something went wrong!");
    }
  };
  const RenderImage = React.useCallback(
    ({ style = {} }) => {
      if (!viewURI && !data?.content?.uri) {
        return null;
      }
      let uri = viewURI ? viewURI : data?.content?.uri;
      return (
        <Image
          source={{ uri }}
          style={[Styles.imageStyle, imageStyle, style]}
        />
      );
    },
    [viewURI, data]
  );
  const deleteDataHandler = () => {
    if (viewURI) {
      console.log("viewURI_TEST_HERE", viewURI)
      setData({ type, content: undefined });
      setModalVisibility(false);
      return resetViewURI();
    }
    resetViewURI();
    setModalVisibility(false);
    setTimeout(() => {
      setData({ type, content: undefined });
    }, 200);
  };
  // const RenderModalContent = () => {
  //   if (!viewURI && !data.content?.uri) {
  //     return null;
  //   }
  //   return (
  //     <View>
  //       {mode == "select" && (
  //         <TouchableOpacity
  //           style={Styles.deleteIconView}
  //           onPress={deleteDataHandler}
  //         >
  //           <MaterialIcons name={"delete"} size={getWp(25)} color={"white"} />
  //         </TouchableOpacity>
  //       )}
  //       <TouchableOpacity
  //         style={Styles.closeContainer}
  //         onPress={() => setModalVisibility(false)}
  //       >
  //         <AntDesign name={"close"} size={getWp(24)} color={"white"} />
  //       </TouchableOpacity>
  //       {data.type == "photo" ? (
  //         <RenderImage style={Styles.renderModalImage} />
  //       ) : data.type == "video" && mode == "select" ? (
  //         <Video
  //           playInBackground={false}
  //           source={{ uri: mode == "select" ? data.content?.uri : viewURI }}
  //           onError={() => Alert.alert("Message", "Something went wrong!")}
  //           style={[Styles.backgroundVideo]}
  //         />
  //       ) : (
  //             <WebView source={{ uri: viewURI }} style={[Styles.backgroundVideo]} />
  //           )}
  //     </View>
  //   );
  // };
  const RenderModalContent = () => {
    if (!viewURI && !data.content?.uri) {
      return null;
    }
    return (
      <View>
        {mode == "select" && (
          <TouchableOpacity
            style={Styles.deleteIconView}
            onPress={deleteDataHandler}
          >
            <MaterialIcons name={"delete"} size={getWp(25)} color={"white"} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={Styles.closeContainer}
          onPress={() => setModalVisibility(false)}
        >
          <AntDesign name={"close"} size={getWp(24)} color={"white"} />
        </TouchableOpacity>
        {data.type == "photo" ? (
          <RenderImage style={Styles.renderModalImage} />
        ) : data.type == "video" && mode == "select" ? (
          <Video
            useNativeControls
            source={{ uri: data.content?.uri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={{ width: wp(80), height: hp(80) }}
          />
          // <Video
          //   playInBackground={false}
          //   source={{ uri: mode == "select" ? data.content?.uri : viewURI }}
          //   onError={() => Alert.alert("Message", "Something went wrong!")}
          //   style={[Styles.backgroundVideo]}
          // />
        ) : (
              <WebView source={{ uri: viewURI }} style={[Styles.backgroundVideo]} />
            )}
      </View>
    );
  };
  // const RenderModalContent = () => {
  //   if (!viewURI && !data.content?.uri) {
  //     return null;
  //   }
  //   return (
  //     <View>
  //       {mode == "select" && (
  //         <TouchableOpacity
  //           style={Styles.deleteIconView}
  //           onPress={deleteDataHandler}
  //         >
  //           <MaterialIcons name={"delete"} size={getWp(25)} color={"white"} />
  //         </TouchableOpacity>
  //       )}
  //       <TouchableOpacity
  //         style={Styles.closeContainer}
  //         onPress={() => setModalVisibility(false)}
  //       >
  //         <AntDesign name={"close"} size={getWp(24)} color={"white"} />
  //       </TouchableOpacity>
  //       {data.type == "photo" ? (
  //         <RenderImage style={Styles.renderModalImage} />
  //       ) : data.type == "video" && mode == "select" ? (
  //         <Video
  //           playInBackground={false}
  //           source={{ uri: mode == "select" ? data.content?.uri : viewURI }}
  //           onError={() => Alert.alert("Message", "Something went wrong!")}
  //           style={[Styles.backgroundVideo]}
  //         />
  //       ) : (
  //             <WebView source={{ uri: viewURI }} style={[Styles.backgroundVideo]} />
  //           )}
  //     </View>
  //   );
  // };

  const RenderVideoThumnail = ({ style = {} }) => {
    if (!thumbnail) {
      return null;
    }
    return (
      <Image
        source={{ uri: thumbnail.path }}
        style={[Styles.imageStyle, imageStyle, style]}
      />
    );
  }
  return (
    <View>
      <TouchableOpacity
        disabled={disabledOnPress}
        onPress={selectOnPressHandler}
        style={[Styles.container, containerStyle]}
      >
        {/* {renderChildren ? (
          props.children
        ) : data.content?.uri || viewURI ? (
          <RenderImage />
        ) : renderText.length > 0 ? (
          <RenderImagePlaceholderText />
        ) : null} */}

        {renderChildren ?
          props.children
          : (mode == 'view' && type == 'video') ?
            <RenderVideoThumnail />
            : data.content?.uri.length > 0 || viewURI?.length > 0 ?
              <RenderImage />
              : renderText.length > 0 ?
                <RenderImagePlaceholderText />
                : null}





        <Modal
          isVisible={modalVisibility}
          onBackButtonPress={() => setModalVisibility(false)}
          onBackdropPress={() => setModalVisibility(false)}
        >
          <View style={Styles.modalContainer}>
            <RenderModalContent />
          </View>
        </Modal>
      </TouchableOpacity>
    </View>
  );
});

export default memo(ImageVideoPlaceholder);
