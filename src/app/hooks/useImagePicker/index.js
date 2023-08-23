import React, {useState, useEffect} from 'react';
import { Platform, Alert } from 'react-native';
import * as ImagePicker from "expo-image-picker";

const useImagePicker = (props) => {
    const [pickedImage, setPickedImage] = useState({ type: undefined, content: undefined });

    const getCameraRequest = async () => {
        if (Platform.OS !== "web" && Platform.OS != "ios") {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== "granted") {
                alert("Sorry, we need camera roll permissions to make this work!");
            }
        }
    }
    useEffect(() => {
        (async () => {
            await getCameraRequest();
        })();
    }, []);

    const pickImage = async (type = "photo") => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: type == "photo" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
                quality: 1
            });
            if (!result.cancelled) {
                setPickedImage(prev => ({
                    type,
                    content: result
                }))
            }
        } catch (error) {
            Alert.alert("Message", "Something went wrong!");
            console.log(error);
        }
    }

    return {
        pickImage,
        pickedImage
    }
}

export default useImagePicker;