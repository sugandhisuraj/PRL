import React, { useEffect, useState, Fragment } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker/src/index';
import { Header } from '../KuldeepSRC/src/components';
import { COLOR } from '../KuldeepSRC/src/utils';
import { Description, Mission, WatchVideo, ProfileInfo } from '../Charity/components';
import {
  UploadDocument,
  ImageVideoPlaceholder
} from '@component';
import { charitiesCollection } from '../../firebase';
import Feather from 'react-native-vector-icons/Feather';
import { useLoader, useFirebaseUpload } from '@hooks';
import EditCharityModel from './editCharityModel';

Feather.loadFont();
const EditCharity = (props) => {
  const [setLoader,
    LoaderComponent] = useLoader();
  const navigation = useNavigation();
  const [editCharityModel, setEditCharityModel] = useState(() => EditCharityModel);
  const {
    convertToBlob,
    uploadBlobToFirebase
  } = useFirebaseUpload();

  const initialProps = () => {
    let recieveCharity = props.route.params.propsData;
    console.log('PROP_REC_CHARITY - ', JSON.stringify(recieveCharity));
    setEditCharityModel(editCharityModel.init(recieveCharity));

  }

  useEffect(() => {
    initialProps()
  }, [])



  // const allHandler = async () => {
  //   if (video?.includes("file:/")) {
  //     const charityVideoBlob = await convertToBlob(video, 'charityVideos/');
  //     uploadBlobToFirebase(charityVideoBlob)
  //       .then(async (charityVideoURL) => {
  //         const upChRes = await charitiesCollection.doc(data.id).update({
  //           charityVideo: charityVideoURL
  //         });
  //       });
  //   }
  //   if (picture?.includes("file:/")) {
  //     const charityPictureBlob = await convertToBlob(picture, 'charityImages/');
  //     uploadBlobToFirebase(charityPictureBlob)
  //       .then(async (charityPictureURl) => {
  //         const upChRes = await charitiesCollection.doc(data.id).update({
  //           charityPicture: charityPictureURl
  //         });
  //       });
  //   } 
  // }
  const saveEditCharityToFirebase = async (dataToSaveToFirebase) => {

    try {
      const charityUpdateResponse = await charitiesCollection.doc(dataToSaveToFirebase.id).update(dataToSaveToFirebase.data);
      setLoader(false);
      props.route.params.updateToSpecificEntry(dataToSaveToFirebase.data);
      props.navigation.goBack();
    } catch (error) {
      setLoader(false);
      console.log('SAVE_EDIT_CHAIRTY - ', error);
      throw new Error(error);
    }
  }
  const editCharityHandler = async () => {

    try {
      setLoader(true);
      let getCharityData = await editCharityModel.saveFirebase();

      if (getCharityData.data.charityLogo?.includes("file:/")) {
        const charityLogoBlob = await convertToBlob(getCharityData.data.charityLogo, 'charityLogo/');
        uploadBlobToFirebase(charityLogoBlob)
          .then(async (charityLogoURL) => {
            getCharityData.data.charityLogo = charityLogoURL;
            if (getCharityData.data.charityPicture?.includes("file:/")) {
              const charityPictureBlob = await convertToBlob(getCharityData.data.charityPicture, 'charityImages/');
              uploadBlobToFirebase(charityPictureBlob)
                .then(async (charityPictureURl) => {
                  getCharityData.data.charityPicture = charityPictureURl;
                  if (getCharityData.data.charityVideo?.includes("file:/")) {
                    const charityBlobVideo = await convertToBlob(getCharityData.data.charityVideo, 'charityVideo/');
                    uploadBlobToFirebase(charityBlobVideo)
                      .then(async (charityVideoURL) => {
                        getCharityData.data.charityVideo = charityVideoURL;
                        if (getCharityData.data.charityTaxDocument?.includes("content:/")) {
                          const charityBlobDoc = await convertToBlob(getCharityData.data.charityTaxDocument, 'charityDoc/');
                          uploadBlobToFirebase(charityBlobDoc)
                            .then(async (charityTaxDocumentURL) => {
                              getCharityData.data.charityTaxDocument = charityTaxDocumentURL;
                              return saveEditCharityToFirebase(getCharityData);
                            });
                        } else {
                          return saveEditCharityToFirebase(getCharityData);
                        }
                      });
                  } else {
                    return saveEditCharityToFirebase(getCharityData);
                  }
                });
            } else {
              return saveEditCharityToFirebase(getCharityData);
            }
          });
      }
      else if (getCharityData.data.charityPicture?.includes("file:/")) {
        const charityPictureBlob = await convertToBlob(getCharityData.data.charityPicture, 'charityImages/');
        uploadBlobToFirebase(charityPictureBlob)
          .then(async (charityPictureURl) => {
            getCharityData.data.charityPicture = charityPictureURl;
            if (getCharityData.data.charityVideo?.includes("file:/")) {
              const charityBlobVideo = await convertToBlob(getCharityData.data.charityVideo, 'charityVideo/');
              uploadBlobToFirebase(charityBlobVideo)
                .then(async (charityVideoURL) => {
                  getCharityData.data.charityVideo = charityVideoURL;
                  if (getCharityData.data.charityTaxDocument?.includes("content:/")) {
                    const charityBlobDoc = await convertToBlob(getCharityData.data.charityTaxDocument, 'charityDoc/');
                    uploadBlobToFirebase(charityBlobDoc)
                      .then(async (charityTaxDocumentURL) => {
                        getCharityData.data.charityTaxDocument = charityTaxDocumentURL;
                        return saveEditCharityToFirebase(getCharityData);
                      });
                  } else {
                    return saveEditCharityToFirebase(getCharityData);
                  }
                });
            } else {
              return saveEditCharityToFirebase(getCharityData);
            }
          });
      } else if (getCharityData.data.charityVideo?.includes("file:/")) {
        const charityBlobVideo = await convertToBlob(getCharityData.data.charityVideo, 'charityVideo/');
        uploadBlobToFirebase(charityBlobVideo)
          .then(async (charityVideoURL) => {
            getCharityData.data.charityVideo = charityVideoURL;
            if (getCharityData.data.charityTaxDocument?.includes("content:/")) {
              const charityBlobDoc = await convertToBlob(getCharityData.data.charityTaxDocument, 'charityDoc/');
              uploadBlobToFirebase(charityBlobDoc)
                .then(async (charityTaxDocumentURL) => {
                  getCharityData.data.charityTaxDocument = charityTaxDocumentURL;
                  return saveEditCharityToFirebase(getCharityData);
                });
            } else {
              return saveEditCharityToFirebase(getCharityData);
            }
          });
      } else if (getCharityData.data.charityTaxDocument?.includes("content:/")) {
        const charityBlobDoc = await convertToBlob(getCharityData.data.charityTaxDocument, 'charityDoc/');
        uploadBlobToFirebase(charityBlobDoc)
          .then(async (charityTaxDocumentURL) => {
            getCharityData.data.charityTaxDocument = charityTaxDocumentURL;
            return saveEditCharityToFirebase(getCharityData);
          });
      } else {
        return saveEditCharityToFirebase(getCharityData);
      }
    } catch (error) {
      console.log('ERROR_EDIT_CHARIY - ', error);
      setLoader(false);
      setTimeout(() => {
        Alert.alert('Message', 'Something went wrong!');
      }, 300);
    }
  }
  const selectPhoto = async () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = {
        //   uri: 'data:image/jpeg;base64,' + response.data
        // };
        // setFilePath(source);
        console.log(source);
      }
    });
  };

  return (
    <View>
      <LoaderComponent />
      <Header
        hideMenu
        onBack={() => {
          navigation.goBack();
        }}
      />
      <View style={styles.container}>
        <View style={styles.center}>
          {/* <Image
            style={styles.logo}
            // source={{uri: 'https://via.placeholder.com/150'}}
            source={{ uri: editCharityModel.editCharity?.charityLogo === null ? 'https://via.placeholder.com/150' : `${editCharityModel.editCharity.charityLogo}` }}
          /> */}

          <ImageVideoPlaceholder
            selectedData={(p) => setEditCharityModel(editCharityModel.updateKey('charityLogo', p))}
            resetViewURI={() => setEditCharityModel(editCharityModel.updateKey('charityLogo', null))}
            viewURI={editCharityModel.editCharityEdit.charityLogo}
            type={'photo'}
            mode={'select'}
            containerStyle={styles.logo}
            imageStyle={[{ height: 93, width: 93 }]}
            renderText={'Upload Charity Logo'}
          />
        </View>
        <View style={{ marginTop: 55 }}>
          <ProfileInfo
            Username={editCharityModel.editCharityEdit.charityName}
            Useremail={editCharityModel.editCharityEdit.charityContactEmail}
            Userweb={editCharityModel.editCharityEdit.charityURL}
            Userphone={editCharityModel.editCharityEdit.charityContactNumber}
            onChangeNameText={(val) =>
              setEditCharityModel(editCharityModel.updateKey('charityName', val))}
            onChangeEmailText={(val) =>
              setEditCharityModel(editCharityModel.updateKey('charityContactEmail', val))}
            onChangeWebText={(val) =>
              setEditCharityModel(editCharityModel.updateKey('charityURL', val))}
            onChangePhoneText={(val) =>
              setEditCharityModel(editCharityModel.updateKey('charityContactNumber', val))}
            edit={true}
            name={editCharityModel.editCharityEdit.charityName}
            web={editCharityModel.editCharityEdit.charityURL}
            email={editCharityModel.editCharityEdit.charityContactEmail}
            phone={editCharityModel.editCharityEdit.charityContactNumber}
          />

          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{ height: "70%" }}
          >

            <Mission
              text={editCharityModel.editCharityEdit?.charityMission}
              edit={true}
              onChangeText={(val) =>
                setEditCharityModel(editCharityModel.updateKey('charityMission', val))}
              value={editCharityModel.editCharityEdit?.charityMission}
            />

            <Description
              edit={true}
              onUpload={() => {
                //selectPhoto();
              }}
              component={(viewURI, imageStyle) => {
                console.log('VIEW_RECIEVED - ', viewURI);
                return <ImageVideoPlaceholder
                  selectedData={(p) => setEditCharityModel(editCharityModel.updateKey('charityPicture', p))}
                  resetViewURI={() => setEditCharityModel(editCharityModel.updateKey('charityPicture', null))}
                  viewURI={editCharityModel.editCharityEdit.charityPicture}
                  type={'photo'}
                  mode={'select'}
                  containerStyle={imageStyle}
                  imageStyle={[imageStyle, { marginTop: 0 }]}
                  // renderChildren={!editCharityModel.editCharityEdit.charityPicture}
                  renderText={'Upload Charity Picture'}
                >
                  <Feather name='play' color='#FFF' size={30} />
                </ImageVideoPlaceholder>
              }}
              url={editCharityModel.editCharityEdit?.charityPicture ? `${editCharityModel.editCharityEdit.charityPicture}` : ''}
              description={editCharityModel.editCharityEdit?.charityDescription}
              onChangeDescText={(val) =>
                setEditCharityModel(editCharityModel.updateKey('charityDescription', val))}
              Userdesc={editCharityModel.editCharityEdit?.charityDescription}
            />

            <WatchVideo
              onCancel={() => props.navigation.goBack()}
              edit
              url={'https://via.placeholder.com/150'}
              onCancel={() => { }}
              onSubmit={() => editCharityHandler()}
              onEdit={() => { }}
              // onUpload={() => {
              //   selectPhoto();
              // }}
              component={() => {
                return <View style={{ flexDirection: 'column' }}>

                  <ImageVideoPlaceholder
                    selectedData={(p) => setEditCharityModel(editCharityModel.updateKey('charityVideo', p))}
                    type={'video'}
                    mode={'select'}
                    // viewURI={editCharityModel.editCharityEdit.charityVideo}
                    // resetViewURI={() => setEditCharityModel(editCharityModel.updateKey('charityVideo', null))} 
                    containerStyle={{
                      width: 300,
                      height: 100,
                      backgroundColor: Colors.Grey,
                      marginTop: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center'
                    }}
                    imageStyle={{
                      width: 300,
                      height: 100,
                    }}
                    renderText={'Upload Charity Video'}
                  >
                    <Feather name='play' color='#FFF' size={30} />
                  </ImageVideoPlaceholder>
                  <UploadDocument
                    containerStyle={{ marginTop: 30 }}
                    label={"Upload Tax Document"}
                    setPickedDocument={(charityTaxDocument) => {
                      setEditCharityModel(editCharityModel.updateKey('charityTaxDocument', charityTaxDocument))

                    }}
                  />
                </View>
              }}
            />
            <View style={{ height: 150 }} />
          </ScrollView>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    backgroundColor: 'white',
    position: 'absolute',
    top: Platform.OS === 'ios' ? 150 : 100,
    zIndex: 99999999999,
    width: '100%',
    borderRadius: 50,
  },
  logo: {
    borderRadius: 50,
    position: 'absolute',
    top: -50,
    backgroundColor: COLOR.GRAY,
    height: 93,
    width: 93,
    alignSelf: 'center'
  },
  center: { alignItems: 'center' },
  imagePlateContainer: {
    width: "85%",
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
});
export default EditCharity;