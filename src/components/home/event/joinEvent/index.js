import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { useDispatch, connect, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import Refresh from "react-native-vector-icons/FontAwesome";
import {
  updateViewEventModel,
  initViewEventModel,
  updateFirebaseDataEvents,
} from "../../../../store/actions";

import Styles from "./indexCss";
import { Root, FilterModel, RedeemDialogInput } from "@component";
import FilterImg from "@assets/FilterIcon.png";
import FilterEventSidebar from "./filterSideBar";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  eventsCollection,
  userEnteredContestsCollection,
  userEventInviteListCollection,
} from "../../../../firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAdsBanner, useLoader } from "@hooks";
import {
  transformFirebaseValues,
  getLargeNum,
  renderInterstatial,
  getWp,
} from "@utils";
import { createNativeWrapper } from "react-native-gesture-handler";
Feather.loadFont();
AntDesign.loadFont();
const JoinEventScreen = ({ navigation }) => {
  const redeemDialogBox = useRef();
  const [setLoader, LoaderComponent] = useLoader();
  const dispatch = useDispatch();
  const [filterVisible, setIsFilterVisible] = useState(false);
  const viewEventModel = useSelector((state) => state.event.viewEventModel);
  const { firebaseAllCollectionData, auth } = useSelector((s) => s);
  const setViewEventModel = (payload) =>
    dispatch(updateViewEventModel(payload));
  const [renderAdsBanner, BannerAdsComponent] = useAdsBanner(auth);
  const {
    events,
    isFilter,
    isDateRange,
    pastEvents,
    liveEvents,
    upcommingEvents,
  } = viewEventModel?.getEvents();

  useEffect(() => {
    let unsubscribe = eventsCollection.onSnapshot(function (querySnapshot) {
      if (viewEventModel.isLoadedOnce) {
        // setViewEventModel(viewEventModel.updates([{
        //     loading: true
        // }]));
        var events = [];
        querySnapshot.forEach(function (doc) {
          let docData = doc.data();
          let isEventToProcess = viewEventModel.events.find((i) => {
            return i.eventID == docData.eventID;
          });
          if (
            isEventToProcess ||
            docData.eventCategory == "Public" ||
            docData.eventCategory == "Public Charity"
          ) {
            events.push({
              ...docData,
              id: doc.id,
              value: docData["eventName"],
              isSelected: false,
            });
          } else {
            if (
              docData.eventCategory == "Private" &&
              auth.userId == docData.organizerID
            ) {
              events.push({
                ...docData,
                id: doc.id,
                value: docData["eventName"],
                isSelected: false,
              });
            }
          }
        });
        setTimeout(() => {
          setViewEventModel(
            viewEventModel.updates([
              {
                events: events,
                loading: false,
              },
            ])
          );
          dispatch(
            updateFirebaseDataEvents(
              events,
              firebaseAllCollectionData.firebaseCollectionData
            )
          );
        }, 1000);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [viewEventModel.isLoadedOnce]);

  useEffect(() => {
    dispatch(
      initViewEventModel({
        ...firebaseAllCollectionData.firebaseCollectionData,
      })
    );
  }, []);

  const onPlayerPress = (event, index) => {
    return renderInterstatial(function () {
      navigation.navigate("EventInfoStack", {
        screen: "PlayerListScreen",
        params: {
          event,
          index,
          allEvents: [...viewEventModel.events],
        },
      });
    }, "firstPlayerProfileList");
    navigation.navigate("EventInfoStack", {
      screen: "PlayerListScreen",
      params: {
        event,
        index,
        allEvents: [...viewEventModel.events],
      },
    });
  };
  const handleEventPress = (eventData) => {
    //console.log('ON_PRESS_HERE - ', eventData);
    navigation.navigate("EventInfoStack", {
      screen: "EventInfoScreen",
      params: { eventData: { ...eventData } },
    });
  };
  const FilterData = (text) => {
    return (
      <TouchableOpacity
        onPress={() =>
          setViewEventModel(viewEventModel.removeSelectedFilter(text.key))
        }
        style={[Styles.touchFilterStyle]}
      >
        <Text style={[Styles.filterContentTextStyle]}>{text.val}</Text>
        <AntDesign
          name={"close"}
          color={"white"}
          style={Styles.closeIconStyle}
        />
      </TouchableOpacity>
    );
  };
  const FilterSection = ({ heading, content = [], containerStyle = {} }) => {
    return (
      <View style={[Styles.filterContainer, containerStyle]}>
        <Text style={Styles.filterTextStyle}>{heading}:</Text>
        <View style={Styles.filterContentContainer}>
          {content.map(FilterData)}
        </View>
      </View>
    );
  };

  const Event = useCallback(
    (event, index) => {
      return (
        <TouchableOpacity
          style={Styles.eventContainer}
          onPress={() => handleEventPress(event)}
        >
          <View style={Styles.eventImgContainer}>
            <View style={Styles.eventImgView}>
              <Image
                source={{ uri: event.eventLogo }}
                style={Styles.eventImgView}
              />
            </View>
          </View>
          <View style={Styles.eventInfoContainer}>
            <Text style={Styles.eventNameText}>{event.eventName}</Text>
            {/* <Text style={Styles.numOfGameText}>
                        Number of Games
                    </Text> */}
            <Text style={Styles.numOfGameText}>
              {event?.eventDescription || ""}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => onPlayerPress(event, index)}
            style={Styles.touchBtnStyle}
          >
            <Text
              style={Styles.profileTextStyle}
            >{`View Player \n Profiles`}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [viewEventModel]
  );

  const Events = useCallback(
    ({ heading = "", renderEvent }) => {
      return (
        <View style={Styles.eventsContainer}>
          <View style={Styles.eventsHeadingContainer}>
            <Text style={Styles.eventsHeadingText}>{heading}</Text>
          </View>

          <View style={Styles.eventCont}>{renderEvent.map(Event)}</View>
        </View>
      );
    },
    [viewEventModel]
  );

  const FilterSideBarRender = useCallback(() => {
    return (
      <FilterEventSidebar
        filterVisible={filterVisible}
        setIsFilterVisible={() => setIsFilterVisible((i) => !i)}
      />
    );
  }, [viewEventModel, filterVisible]);

  const addedEntrytoUserEnteredCollection = async (event) => {
    try {
      const data = {
        email: auth.userCol.email,
        emailType: "Event Invite",
        eventDate: new Date(),
        eventID: event.eventID,
        eventName: event.eventName,
        organizerEmail: auth.userCol.email,
        organizerID: auth.userCol.uid,
      };
      const saveToUserInviteList = await userEventInviteListCollection.add(
        data
      );
      console.log("SAVE_TO_USER_INVITE_LIST - ", saveToUserInviteList.id);
      return;
      const getData = await userEnteredContestsCollection.get();
      const transData = transformFirebaseValues(
        getData,
        "userEnteredContestID"
      );
      let savedId = getLargeNum(transData, "userEnteredContestID");
      let userContestColEntry = {
        //contestID: eventFeesModel.allContestCreated[0].uploadedData.contestID,
        //contestName: eventFeesModel.allContestCreated[0].uploadedData.contestName,
        contestID: 0,
        contestName: "INVITE",
        eventID: eventID,
        userContestPaidAmount: 0,
        userContestPaidStatus: "Paid",
        userContestParticipationType: "INVITE",
        userContestSignupDate: new Date().toString(),
        userEnteredContestID: ++savedId,
        userID: auth.userId,
      };
      console.log(
        "ENTRY_USER_ENTERED_COLL - ",
        JSON.stringify(userContestColEntry)
      );
      let savedContestCol = await userEnteredContestsCollection.add(
        userContestColEntry
      );
      return savedContestCol.id;
    } catch (error) {
      console.log("ERROR_USER_ENTERED_CONTEST - ", error);
      throw new Error(error);
    }
  };

  const onRedeemDialogSubmit = async (inviteCode) => {
    try {
      if (inviteCode == "") {
        return;
      }
      if (isNaN(inviteCode)) {
        return Alert.alert("Message", "Not a Valid Invite Code");
      }
      console.log("REDEEM_CODE_ENTERED - ", inviteCode);
      setLoader(true);
      const fetchEventsOnInviteCode = await eventsCollection
        .where("inviteCode", "==", parseInt(inviteCode))
        .get();
      if (fetchEventsOnInviteCode.docs.length != 1) {
        setTimeout(() => {
          setLoader(false);
          setTimeout(() => {
            return Alert.alert("Message", "Invalid Invite Code");
          }, 500);
        }, 1000);
        return;
      }
      const transEvent = transformFirebaseValues(
        fetchEventsOnInviteCode,
        "eventName",
        [{ isSelected: "false" }]
      );
      console.log("ON_INVITE_EVENT_222 - ", transEvent[0].eventID);
      let isEventAlreadyExist = viewEventModel.events.some(
        (i) => i.eventID == transEvent[0].eventID
      );
      console.log(isEventAlreadyExist);
      if (isEventAlreadyExist) {
        setTimeout(() => {
          setLoader(false);
          setTimeout(() => {
            return Alert.alert("Message", "Event already exist in your List");
          }, 500);
        }, 1000);
        return;
      }

      const addDataToUserEnteredCol = await addedEntrytoUserEnteredCollection(
        transEvent[0]
      );
      let oldEvModelEvents = [...viewEventModel.events];
      oldEvModelEvents.push(transEvent[0]);
      setViewEventModel(
        viewEventModel.updates([
          {
            events: oldEvModelEvents,
            loading: false,
          },
        ])
      );
      setLoader(false);
      setTimeout(() => {
        return Alert.alert(
          "Message",
          `Event - ${transEvent[0].eventName} is Successfully Added!`
        );
      }, 1000);
    } catch (error) {
      console.log("ERROR_ON_INVITE_LOGIC - ", error);
      setTimeout(() => {
        setLoader(false);
        setTimeout(() => {
          return Alert.alert("Message", "Something went wrong!");
        }, 500);
      }, 1000);
    }
  };
  
  return (
    <Root>
      <Spinner visible={viewEventModel.loading} />
      <LoaderComponent />
      <KeyboardAwareScrollView
        style={{
          ...Styles.container,
          maxHeight: renderAdsBanner ? "95%" : "99%",
        }}
      >
        <FilterEventSidebar
          filterVisible={filterVisible}
          setIsFilterVisible={() => setIsFilterVisible((i) => !i)}
        />
        <View style={Styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Feather name="menu" size={25} color={"#000"} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {/* <TouchableOpacity onPress={() => setRefresh(!refresh)} style={{ marginRight: 30 }}>
                            <Refresh name="refresh" size={20} color={'#000'} />
                        </TouchableOpacity> */}
            {auth?.userCol?.userType != "admin" && (
              <TouchableOpacity
                onPress={() => redeemDialogBox.current.showDialog()}
              >
                <Text style={Styles.redeemEventTextStyle}>Redeem Event</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setIsFilterVisible((i) => !i)}>
              <Image source={FilterImg} />
            </TouchableOpacity>
          </View>
        </View>
        {isFilter && (
          <FilterSection
            heading={"Filters"}
            content={viewEventModel.getSelectedFilter()}
          />
        )}
        {isDateRange && (
          <FilterSection
            containerStyle={Styles.filterContainerStyle}
            heading={"Date Range"}
            content={viewEventModel.getDateRange()}
          />
        )}
        {liveEvents.length > 0 && (
          <Events heading={"Current Events"} renderEvent={liveEvents} />
        )}
        {upcommingEvents.length > 0 && (
          <Events heading={"Upcomming Events"} renderEvent={upcommingEvents} />
        )}
        {pastEvents.length > 0 && (
          <Events heading={"Past Events"} renderEvent={pastEvents} />
        )}
      </KeyboardAwareScrollView>
      <BannerAdsComponent />
      <RedeemDialogInput
        ref={redeemDialogBox}
        submitInput={onRedeemDialogSubmit}
      />
    </Root>
  );
};

export default connect()(JoinEventScreen);

/*
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Upcoming Events</Text>
            {events.map((event, index) => {
                return (<View style={{ backgroundColor: Colors.blue }} key={index}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("BookEvents")}>
                        <MaterialIcon name="basketball" color={Colors.white} />
                        <Text style={{ color: Colors.white }}>{event.eventName}</Text>
                        <MaterialIcon name="account-multiple" color={Colors.white} />
                        <Text style={{ color: Colors.white }}>{event.eventDescription}</Text>
                        <MaterialIcon name="calendar" color={Colors.white} />
                        <Text style={{ color: Colors.white }}>{event.eventDate}</Text>
                    </TouchableOpacity>
                    <Button
                        title="Spots Available"
                    />
                </View>)
            })}
            <Text style={styles.title}>Past Events</Text>
            {pastEvents}
            <Text style={styles.title}>Top Charities</Text>
            {topCharities}
        </View>
    )
*/
