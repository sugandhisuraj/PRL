import React, { Fragment, useState, useEffect, useMemo, useRef } from 'react';
import { TouchableOpacity, View, Image, Text, ScrollView, Alert } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Feather from 'react-native-vector-icons/Feather';
import { Root, TextInput, TouchableButton, DateInput } from '@component';
import Styles from './indexCss';
import FilterImg from '@assets/FilterIcon.png';
import SeddingModel from './Seedings.model';
import { useSelector, useDispatch, connect } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getHp, getWp, removeDuplicateFromArr, transformFirebaseValues, FONTSIZE, wp, hp } from '@utils';
import {
    userEnteredContestsCollection,
    contestsCollection,
    gameScheduleDetailsCollection
} from '../../firebase';
import {
    CustomModalDropDown
} from '@component';
import { Spinner as NSpinner } from 'native-base';
AntDesign.loadFont();
const SeedingsScreen = (props) => {
    const {
        navigation
    } = props;
    const [model, setModel] = useState(() => new SeddingModel());
    const [renderEventList, setRenderEventList] = useState(false);
    const [process, setProcess] = useState(false);
    const { firebaseAllCollectionData, auth } = useSelector(s => s);
    const formsRef = useRef({
        contest: useRef()
    })
    const loadSeedings = async () => {
        const allEvents = [...firebaseAllCollectionData.firebaseCollectionData.eventsData];

        const bracketTypes = [...firebaseAllCollectionData.firebaseCollectionData.contestBracketTypesData];
        const allPlayersDataRes = await userEnteredContestsCollection.get();
        const allPlayersData = transformFirebaseValues(allPlayersDataRes, 'eventID');
        //const filteredPlayerData = removeDuplicateFromArr(allPlayersData, 'userID');
        const filteredPlayerData = allPlayersData;
        const contestColRes = await contestsCollection.get();
        const allContestData = transformFirebaseValues(contestColRes, 'contestName');
        setModel(model.init(allEvents, bracketTypes, auth, filteredPlayerData, allContestData));
    }
    useEffect(() => {
        loadSeedings();
    }, []);
    //console.log('ALL_SEDD_TEST_33 - ', JSON.stringify(model.events));
    const EventList = (props) => {
        return <TouchableOpacity
            onPress={() => {
                formsRef.current.contest.current.reset();
                setRenderEventList(false);
                setModel(model.onEventSelect(props.eventData));
            }}
            style={{ ...Styles.eventListData, borderBottomWidth: props.renderBorder ? .5 : 0 }}>
            {
                props.eventData.eventLogo && <Image source={{ uri: props.eventData.eventLogo }}
                    style={Styles.listEventImgStyle}
                    resizeMode={'contain'}
                />
            }
            <Text style={Styles.listEventNameText}>{props.eventData.eventName}</Text>
        </TouchableOpacity>
    }
    const useImgSource = useMemo(() => {
        return <Image source={{ uri: model.selectedEvent.eventLogo }}
            style={Styles.listEventImgStyle}
            resizeMode={'contain'}
        />
    }, [model?.selectedEvent?.eventLogo]);

    const NoEventsAvailComponent = () => {
        return (
            <View style={Styles.noEventAvailContainer}>
                <Text style={Styles.noEventAvailTextStyle}>No Events Availabe for Schedule Games</Text>
            </View>
        );
    }
    const EventPlate = () => {

        return <TouchableOpacity
            onPress={() => {
                setRenderEventList(i => !i);
            }} style={Styles.eventPlateContainer}>
            <View style={{ flexDirection: 'row' }}>
                {
                    model?.selectedEvent?.eventLogo && useImgSource
                }
                <View style={{ marginLeft: getWp(20), justifyContent: 'space-between', width: '70%' }}>
                    <Text style={Styles.selectedEventTextStyle}>{model?.selectedEvent?.eventName}</Text>
                    {/* <Text style={Styles.totalPlayerTextStyle}>
                        {model?.selectedEvent?.players ? model?.selectedEvent?.players?.length > 0 ? model?.selectedEvent?.players?.length + ' Players' : `0 Players` : ''}</Text> */}
                </View>

            </View>
            <AntDesign name={!renderEventList ? 'down' : 'up'} size={getWp(22)} color={'black'} />

        </TouchableOpacity>
    }
    const saveScheduleData = async () => {
        try {
            setProcess(true);
            const saveScheduleData = model.getFirebaseData();
            console.log("GAME_SCHEDULE_ ", JSON.stringify(saveScheduleData));
            //return;
            const saveGameScheduleResponse = await gameScheduleDetailsCollection.add(saveScheduleData);
            setTimeout(() => {
                setProcess(false);
                return Alert.alert('Message', 'Game Schedule Created');
            }, 1000);
        } catch (error) {
            console.log('ERROR_WHILE_CREATE_GAME_SCHEDULE - ', error);
            setTimeout(() => {
                setProcess(false);
                return Alert.alert('Message', 'Something went wrong! Try again!');
            }, 1000);

        }

    }
    let numOfPlayersC = model.currentContestNumPlayers().numOfPlayers;
    let numOfPlayers = numOfPlayersC == null ? '' : 
            numOfPlayers == 0 ? '0 Players' : numOfPlayersC + ' Players';
    return (
        <Root childViewStyle={{ backgroundColor: '#E5E5E5' }}>
            <Spinner visible={model.loader} />
            <KeyboardAwareScrollView style={{ ...Styles.container }}>
                <View style={Styles.headerContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Feather name="menu" size={25} color={'#000'} />
                        </TouchableOpacity>
                        <Text style={Styles.seddingsTextStyle}>Seedings</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={FilterImg} />
                    </View>
                </View>
                {
                    model.loader == false && model.noEventsAvail == true ?
                        <NoEventsAvailComponent />
                        : <Fragment>
                            <EventPlate />
                            <View style={Styles.contestBracketTypeContainer}>
                                <View>
                                    <Text style={Styles.commonheadingStyle}>Select Contest</Text>
                                    <CustomModalDropDown
                                        onSelect={(contestData) => {
                                            return setModel(model.onContestSelect(contestData));
                                        }
                                        }
                                        ref={formsRef.current.contest}
                                        width={getWp(175)}
                                        height={getHp(40)}
                                        items={model?.selectedEvent?.contestData || []}
                                        //placeholder={model.fields?.contestID == null ? "Select Contest" : model.currentContestNumPlayers().contestName} 
                                        placeholder={'Select Contest'}
                                        dropdownContainer={{ borderRadius: getWp(10) }}
                                        containerStyle={{ borderRadius: getWp(10) }}
                                    />
                                    <Text style={{...Styles.totalPlayerTextStyle, marginLeft: 10 }}>
                                        {numOfPlayers}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={Styles.commonheadingStyle}>Select Bracket Type</Text>
                                    <CustomModalDropDown
                                        onSelect={(bracketTypes) => {
                                            console.log('ON_SELECT_BRACKET_TYPE - ', bracketTypes.contestBracketType);
                                            setModel(model.update('selectedContestBracketType', bracketTypes.contestBracketType));
                                        }
                                        }
                                        width={getWp(175)}
                                        height={getHp(40)}
                                        items={model.bracketTypes || []}
                                        placeholder="Bracket Types"
                                        dropdownStyle={{ marginRight: -getWp(40), marginTop: getHp(5) }}
                                        dropdownContainer={{ borderRadius: getWp(10) }}
                                        containerStyle={{ borderRadius: getWp(10) }}
                                    />
                                </View>
                            </View>

                            <View style={{
                                ...Styles.contestBracketTypeContainer,
                                alignItems: 'center',
                                justifyContent: 'space-evenly'
                            }}>
                                <Text style={Styles.commonheadingStyle}>Select Start Date</Text>

                                <DateInput
                                    //ref={formsRef.current.startDate}
                                    title={"Start Date"}
                                    onDateSet={(gameStartDatePick) =>
                                        setModel(model.onSchDateSelect(gameStartDatePick))
                                    }
                                    dateTextStyle={{ fontWeight: '700' }}
                                    dateTouchContainer={{ backgroundColor: 'white' }}
                                />
                            </View>
                            <View style={Styles.contestBracketTypeContainer}>
                                <View>
                                    <Text style={Styles.commonheadingStyle}>Select Start Time</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <CustomModalDropDown
                                            onSelect={(hh) => {
                                                setModel(model.update('selectedHH', hh.value));
                                            }
                                            }
                                            width={getWp(70)}
                                            height={getHp(40)}
                                            items={model?.HH || []}
                                            placeholder="HH"
                                            dropdownContainer={{ borderRadius: 0 }}
                                            containerStyle={{ borderRadius: 0 }}
                                        />

                                        <CustomModalDropDown
                                            onSelect={(mm) => {
                                                setModel(model.update('selectedMM', mm.value));
                                            }
                                            }
                                            width={getWp(70)}
                                            height={getHp(40)}
                                            items={model.MM || []}
                                            placeholder="MM"
                                            dropdownContainer={{ borderRadius: 0 }}
                                            containerStyle={{ borderRadius: 0 }}
                                        />

                                        <CustomModalDropDown
                                            onSelect={(meridian) => {
                                                setModel(model.update('selectedMeridian', meridian.value));
                                            }
                                            }
                                            width={getWp(70)}
                                            height={getHp(40)}
                                            items={[{ value: 'AM' }, { value: 'PM' }]}
                                            placeholder="AM"
                                            dropdownContainer={{ borderRadius: 0 }}
                                            containerStyle={{ borderRadius: 0 }}
                                        />
                                    </View>
                                </View>

                                <View>
                                    <Text style={Styles.commonheadingStyle}>Between Time Min.</Text>
                                    <CustomModalDropDown
                                        onSelect={(btm) => {
                                            setModel(model.update('selectedBtm', btm.value));
                                        }
                                        }
                                        width={getWp(80)}
                                        height={getHp(40)}
                                        items={model.BTM || []}
                                        placeholder="5"
                                        dropdownStyle={{ marginRight: -getWp(40), marginTop: getHp(5) }}
                                        dropdownContainer={{ borderRadius: 0 }}
                                        containerStyle={{ borderRadius: 0 }}
                                    />
                                </View>
                            </View>

                            <View style={Styles.numOfPerContainer}>
                                <Text style={Styles.numOfPerText}>
                                    Number of Periods
                                </Text>
                                <TextInput
                                    isNumeric
                                    containerStyle={Styles.inputContainerStyle}
                                    // inputStyle={Styles.inputStyle}
                                    placeholder={'Period'}
                                    value={model.numOfPeriod}
                                    onChangeText={(numOfPeriod) =>
                                        setModel(model.update('numOfPeriod', numOfPeriod))
                                    }
                                />
                            </View>
                            <View style={{
                                ...Styles.numOfPerContainer,
                                width: '60%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: getHp(10)
                            }}>
                                <Text style={Styles.numOfPerText}>Record All Games</Text>
                                <CustomModalDropDown
                                    onSelect={(recordPermission) => {
                                        setModel(model.update('selectedRecordGamesPermission', recordPermission.value));
                                    }
                                    }
                                    width={getWp(90)}
                                    height={getHp(40)}
                                    items={model.recordGamesPermission || []}
                                    placeholder="Yes"
                                    dropdownStyle={{ marginRight: -getWp(40), marginTop: getHp(5) }}
                                    dropdownContainer={{ borderRadius: 0 }}
                                    containerStyle={{ borderRadius: 0 }}
                                />
                            </View>
                            <View style={{ alignSelf: 'center', marginTop: getHp(30) }}>
                                {
                                    process ?
                                        <NSpinner color={'#0B214D'} size={'large'} /> :
                                        <TouchableButton
                                            type={'nextStep'}
                                            title={"Generate Schedule"}
                                            propButtonStyle={{ width: getWp(200), height: getHp(50) }}
                                            onPress={() => {
                                                saveScheduleData();
                                            }}
                                            titleStyle={{ fontSize: FONTSIZE.Text16 }}
                                        />
                                }

                            </View>

                            {
                                renderEventList && <View style={Styles.eventListAbsoluteContainer}>
                                    <ScrollView style={{ maxHeight: 250 }}>
                                        {
                                            model.events.map((e, i, l) => {
                                                return <EventList eventData={e} renderBorder={i < l.length - 1} />
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            }
                        </Fragment>

                }

            </KeyboardAwareScrollView>
        </Root>
    );
}

export default connect()(SeedingsScreen);