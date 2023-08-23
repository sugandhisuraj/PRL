import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Spinner from 'react-native-loading-spinner-overlay';
import {
    Header,
    Root,
    TextInput,
    ImageVideoPlaceholder,
    DateInput,
    CustomModalDropDown,
    SingleHeading,
    TextAreaInput,
    TouchableButton,
    CreateEventProgress
} from "@component";
import { useLoader, useFirebaseUpload } from "@hooks";
import Styles from "./indexCss";
import { useBackHandler } from '@react-native-community/hooks';

import {
    eventCategoriesCollection,
    eventSubCategoriesCollection,
    eventGenreTypesCollection,
    contestTypesCollection,
    firebase,
    eventsCollection,
} from "../../../../firebase";
import { wp, hp, getHp, getWp, FONTSIZE } from "@utils";
import { useDispatch, useSelector, connect } from "react-redux";
import { readCharities } from "../../../../store/actions";
import { updateEventModel, initEventModel } from "../../../../store/actions";
import AntDesign from "react-native-vector-icons/AntDesign";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Entypo from 'react-native-vector-icons/Entypo';

Entypo.loadFont();
AntDesign.loadFont();

const ContestTypeScreen = (props) => {
    const [setLoader, LoaderComponent] = useLoader();

    const { firebaseAllCollectionData } = useSelector(s => s);
    const dispatch = useDispatch();
    const { eventModel } = useSelector((state) => state.event);
    const setEventModel = (newEventModel) => {
        dispatch(updateEventModel(newEventModel));
    };

    const formsRef = useRef({
        contestTypeRef: useRef(),
    });

    const onNextStepPress = () => {

        if (eventModel.createContestFactory.length == 0) {
            return Alert.alert('Message', 'You have to add at-least 1 Contest!');
        }
        let isAllContestUploaded = eventModel.createContestFactory.every(i => i.isUploadedOnce);
        if (!isAllContestUploaded) {
            return Alert.alert('Message', 'Save All Contest Info!');
        }
        return props.navigation.navigate('EventProfileCreateScreen');
    }

    useBackHandler(()=>{
        return false;
    });
     
    return (
        <Root childViewStyle={Styles.childViewStyle}>
            <LoaderComponent />
            {/* <Spinner visible={eventModel.loading} /> */}
            <KeyboardAwareScrollView
                keyboardShouldPersistTaps={'always'}
                contentContainerStyle={Styles.container}>
                <Header
                    hideMenu
                    heading={"Create Event - Contest Type"}
                    menuOnPress={() => {
                        props.navigation.openDrawer();
                    }}
                    leftOnPress={() => {
                        props.navigation.goBack();
                    }}
                />
                <View style={Styles.createContestTypesContainer}>
                    <CustomModalDropDown
                        ref={formsRef.current.contestTypeRef}
                        width={getWp(323)}
                        height={getHp(45)}
                        items={eventModel?.contestTypesData || []}
                        placeholder="Select Contest Types"
                        onSelect={(contest) => {
                            setEventModel(
                                eventModel.mutateToContestFactory(contest)
                            );
                        }}
                    />
                    <View style={Styles.selectedContestContainer}>
                        {
                            eventModel.createContestFactory.map((i, index) => {

                                return (
                                    <View style={Styles.selectedContestRow}>
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                                !i.isUploadedOnce ? <TouchableOpacity
                                                    onPress={() => {
                                                        setEventModel(
                                                            eventModel.mutateToContestFactory(null, 'remove', index)
                                                        );
                                                    }}>
                                                    <AntDesign
                                                        size={18}
                                                        color={'black'}
                                                        name={'close'} />
                                                </TouchableOpacity> :
                                                    <Entypo size={18}
                                                        color={'lightgreen'}
                                                        name={'check'} />
                                            }
                                            <Text style={Styles.selectedContestTextStyle}>
                                                {
                                                    i.isUploadedOnce ?
                                                        i.uploadedData.contestName
                                                        : i.selectedContest.contestType}
                                            </Text>
                                        </View>

                                        <TouchableOpacity
                                            onPress={() => {
                                                props.navigation.navigate('CutomizeContestScreen', {
                                                    currentContestFactoryIndex: index
                                                })
                                            }}
                                        >
                                            <AntDesign
                                                name={'right'}
                                                size={18}
                                                color={'black'} />
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        }
                    </View>
                    <Text style={Styles.orTextStyle}>
                        OR
                    </Text>
                    <TouchableButton
                        type={"small"}
                        backgroundColor={"#0B214D"}
                        title={"Create Custom Contest"}
                        propButtonStyle={Styles.customContestTyle}
                        onPress={() => {
                            props.navigation.navigate('EventStack', {
                                screen: 'CreateContestScreen'
                            });
                        }}
                    />
                </View>
                <View style={Styles.nextContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableButton
                            type={"prevStep"}
                            title={"Previous Step"}
                            onPress={() => props.navigation.goBack()}
                        />
                        <View style={{ width: getWp(10) }} />
                        <TouchableButton
                            type={'nextStep'}
                            title={"Next Step"}
                            propButtonStyle={{ width: getWp(200) }}
                            onPress={onNextStepPress}
                            titleStyle={{ fontSize: FONTSIZE.Text16 }}
                        />
                    </View>

                    <CreateEventProgress
                        containerStyle={{ marginTop: getHp(30) }}
                        selectedIndex={2}
                    />
                </View>
                <View style={{ height: 60 }} />
            </KeyboardAwareScrollView>
        </Root>
    );
};

export default connect()(ContestTypeScreen);