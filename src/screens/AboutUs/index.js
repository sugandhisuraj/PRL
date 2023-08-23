import React, { useEffect, useState, Fragment } from 'react'
import { View, Text, Image, TouchableOpacity, Platform, Keyboard, Alert } from 'react-native'
import Header from './components/header'
import PHONETALK from './PHONETALK.png'
import EMAIL from './EMAIL.png'
import PIN from './PIN.png'
import Spinner from 'react-native-loading-spinner-overlay';
import { Spinner as NSpinner } from 'native-base';
import { WebViewModal, AppVersion, Root, TextInput, TouchableButton } from '@component';
import {
    prlAboutTermsPrivacyCollection
} from '../../firebase';
import { transformFirebaseValues } from '@utils';
import { useSelector, connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useKeyboardStatus } from '@hooks';
import { getWp, getHp, FONTSIZE } from '@utils';
import { FirebaseEmail } from '@classes';

function AboutUs(props) {
    const [loading, setLoading] = useState(false);
    //const [aboutUsData, setAboutUsData] = useState({})
    const aboutUsData = useSelector(state => state.appInfoData.appInfoData);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTC, setShowTC] = useState(false);
    const isKeyboardOpen = useKeyboardStatus();
    const {
        showFeedback = true
    } = props;
    const { auth } = useSelector(s => s);
    const [feedbackText, setFeedbackText] = useState('');
    const [feedbackProcess, setFeedBackProcess] = useState(false);
    const saveFeedback = async () => {
        try {
            Keyboard.dismiss();
            setFeedBackProcess(true);
            setTimeout(async () => {
                const feedbackResponse = await FirebaseEmail.sendMail(FirebaseEmail.feedBack({
                    feedbackText: feedbackText,
                    ccUids: auth.userId
                }));
                console.log('FEEDBACK_RECORD_ADD_RESPONSe - ', feedbackResponse.id);
                setTimeout(() => {
                    setFeedbackText('');
                    setFeedBackProcess(false);
                    return Alert.alert('Message', 'Your message was sent. Thanks for the Feedback');
                }, 1000);
            }, 400);
        } catch (error) {
            console.log('SAVE_FEEDBACK_ERROR - ', error);
            setTimeout(() => { 
                setFeedBackProcess(false);
                return Alert.alert('Message', 'Something went wrong!');
            }, 1000);
        }
    }
    return (
        <Root childViewStyle={{ backgroundColor: 'white' }}>
            <KeyboardAwareScrollView style={{
                // borderWidth: 1,
                // borderColor: 'red',
                backgroundColor: 'white',
                maxHeight: '90%'
            }}
                keyboardShouldPersistTaps={"always"}>
                <View style={[{ flex: 1 },
                props?.hideTray && { backgroundColor: 'white' }]}>
                    <Spinner visible={loading} />
                    <WebViewModal
                        modalVisible={showPrivacy}
                        onClose={() => setShowPrivacy(i => !i)}
                        html={aboutUsData?.htmlPrivacyPolicy || ''}
                    />
                    <WebViewModal
                        modalVisible={showTC}
                        onClose={() => setShowTC(i => !i)}
                        html={aboutUsData?.htmlTermsOfUse || ''}
                    />
                    <Header
                        renderMenu={!props.hideTray}
                        onMenuPress={() => props.navigation.openDrawer()}
                    />
                    <View>

                        <View style={{ padding: 15 }}>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', }}>What we Do</Text>
                            <Text style={{ padding: 5, textAlign: 'left' }}>{aboutUsData?.whatWeDo || ''}</Text>
                        </View>

                        <View style={{ padding: 15 }}>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', }}>Our Mission Statement</Text>
                            <Text style={{ padding: 5, textAlign: 'left' }}>{aboutUsData?.mission || ''}</Text>
                        </View>
                    </View>

                    <View style={{ padding: 15 }}>

                        <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', }}>Contact Support
                </Text>

                        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingTop: 20, alignItems: 'center' }}>
                            <Image source={PHONETALK} height={20}
                                style={{ marginRight: 20 }} />
                            <Text style={{ fontSize: 13, color: 'black', fontWeight: 'bold', }}>{aboutUsData?.phone || ''}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingTop: 12, alignItems: 'center' }}>
                            <Image source={EMAIL} height={20}
                                style={{ marginRight: 20 }} />
                            <Text style={{ fontSize: 13, color: 'black', fontWeight: 'bold', }}>{aboutUsData?.email || ''}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', paddingLeft: 20, paddingTop: 12, alignItems: 'center' }}>
                            <Image source={PIN} height={20}
                                style={{ marginRight: 20 }} />
                            <Text style={{ fontSize: 13, color: 'black', fontWeight: 'bold', }}>{aboutUsData?.website || ''}</Text>
                        </View>
                    </View>

                    {
                        showFeedback &&
                        <View style={{ paddingHorizontal: 18 }}>
                            <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', }}>
                                Feedback
                    </Text>
                            <TextInput
                                editable={!feedbackProcess}
                                containerStyle={{ padding: 15, marginTop: 10, height: 100 }}
                                inputStyle={{ height: 90, paddingHorizontal: 5, fontSize: FONTSIZE.Text14 }}
                                multiline={true}
                                placeholder={"Share your feedback"}
                                value={feedbackText}
                                onChangeText={setFeedbackText}
                            />

                            {feedbackProcess ?
                                <View style={{ marginTop: getHp(1) }}>
                                    <NSpinner color={'#0B214D'} size={'large'} />
                                </View> :
                                <TouchableButton
                                    containerStyle={{ marginTop: getHp(10), alignSelf: 'center' }}
                                    type={'nextStep'}
                                    title={"Send"}
                                    propButtonStyle={{ width: getWp(120) }}
                                    onPress={saveFeedback}
                                    titleStyle={{ fontSize: 16 }}
                                />}
                        </View>
                    }


                </View>
                <View style={{ height: 30 }} />
            </KeyboardAwareScrollView>
            { !isKeyboardOpen ?

                !props?.hideTray &&
                <Fragment>
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: getHp(75), alignSelf: 'center', justifyContent: 'space-around' }}>
                        <View style={{ paddingRight: 5 }}>
                            <TouchableOpacity onPress={() => { setShowPrivacy(i => !i) }}>
                                <Text style={{ fontSize: 13, color: '#0B214D', fontWeight: 'bold', }}>Privacy Policy</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ paddingLeft: 15 }}>
                            <TouchableOpacity onPress={() => { setShowTC(i => !i) }}>
                                <Text style={{ fontSize: 13, color: '#0B214D', fontWeight: 'bold', }}>Terms and Condition's</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </Fragment> : null

            }
            {
                !isKeyboardOpen && <View style={{ position: 'absolute', bottom: Platform.OS == 'ios' ? getHp(27) : getHp(18), alignSelf: 'center' }}>

                    <Text style={{ fontSize: 14, color: 'black', fontWeight: 'bold', textAlign: 'center', marginBottom: getHp(3) }}>Founded 2020</Text>
                    <AppVersion textColor={'black'} />
                </View>
            }
        </Root>
    )
}

export default connect()(AboutUs);