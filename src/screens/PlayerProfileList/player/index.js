import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Back, Filter, Menu, RightArrow } from "../../KuldeepSRC/src/icon";
import { bigHitSlop } from "../../KuldeepSRC/src/utils";
import { PlayerItem } from "./component";
import PlayerListModel from "./PlayerList.model";
import { SingleHeading, Root } from "@component";
import {
  eventsCollection,
  userEnteredContestsCollection,
  usersCollection,
  contestsCollection
} from "../../../firebase";
import Spinner from "react-native-loading-spinner-overlay";
import PlayerFilterSidebar from "./filterSidebar";
import { useSelector } from 'react-redux';
import { useAdsBanner } from '@hooks';

const Player = (props) => {
  const [showFilter, setShowfilter] = useState(false);
  const [playerModel, setPlayerModel] = useState(() => PlayerListModel);
  const { firebaseAllCollectionData, auth } = useSelector(s => s);
  const {
    event, 
  } = props.route.params;
  let allEvents = [...firebaseAllCollectionData.firebaseCollectionData.eventsData];
  const [
    renderAdsBanner,
    BannerAdsComponent
] = useAdsBanner(auth);
  const fetchData = async () => {
    const userEnteredContestColRes = await userEnteredContestsCollection.get();
    const userColRes = await usersCollection.get();
    const contestColRes = await contestsCollection.get();
    console.log('PLAYERLIST_CHECK_1 - ', JSON.stringify(event));
    setPlayerModel(
      playerModel.loadContent(
        allEvents,
        userEnteredContestColRes,
        userColRes,
        props.route.params.event,
        contestColRes,
        event
      )
    );
  };
  useEffect(() => {
    console.log(
      "I_WILL_RUN_ON_CHANGE_3 - ",
      JSON.stringify(props.route.params.event)
    );
  }, [props.route.params.event]);
  useEffect(() => {
    if (!playerModel.loading) {
      setPlayerModel(
        playerModel.updates([
          { playerList: [], loading: true, initLoaded: false },
        ])
      );
    }
    fetchData();
  }, []);

   
  // return null;
  return (
    <Root>
      <ScrollView style={styles.scrolContainer}>
        <Spinner visible={playerModel.loading} />
        <PlayerFilterSidebar
          setPlayerModel={setPlayerModel}
          playerModel={playerModel}
          filterVisible={showFilter}
          setIsFilterVisible={() => setShowfilter((i) => !i)}
        />
        <View style={styles.header}>
          <View style={styles.rowCenter}>
            <View style={{ flexDirection: "row" }}>
              {/* <TouchableOpacity hitSlop={bigHitSlop} onPress={()=>props.navigation.openDrawer()}>
              <Menu />
            </TouchableOpacity> */}
              <TouchableOpacity
                hitSlop={bigHitSlop}
                onPress={() => props.navigation.goBack()}
              >
                <Back style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowfilter(!showFilter);
            }}
            style={{ marginRight: 30 }}
            hitSlop={bigHitSlop}
          >
            <Filter />
          </TouchableOpacity>
        </View>
        {showFilter && (
          <View style={styles.filterContainer}>
            <Text style={styles.filter}>Filters:</Text>
            <TouchableOpacity>
              <Text style={styles.tag}>Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.tag}>Filters</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.listContainer}>
          <SingleHeading
            containerStyle={styles.eventNameHeadingStyle}
            textColor={"white"}
            placeholder={
              playerModel.loading ? '' :
              (playerModel?.selectedEvent?.eventName ||
              props.route.params.event?.eventName)
            }
          />
          {playerModel?.initLoaded && playerModel?.playerList.length == 0 && (
            <Text style={styles.noPlayerAvailTextStyle}>
              No Players Available
            </Text>
          )}
          {playerModel?.initLoaded && playerModel?.playerList.length > 0 && (
            <FlatList
              data={playerModel?.playerList || []}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                return <PlayerItem
                  event={event}
                  allEvents={allEvents}
                  item={item} navigation={props.navigation} />
              }}
              keyExtractor={(item, index) => index}
            />
          )}
        </View>
      </ScrollView>
      <BannerAdsComponent />
    </Root>
  );
};
const styles = StyleSheet.create({
  noPlayerAvailTextStyle: {
    alignSelf: "center",
    marginVertical: 30,
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  eventNameHeadingStyle: {
    marginTop: 30,
    alignItems: "flex-start",
    paddingHorizontal: 30,
    backgroundColor: "#0B214D",
  },
  tag: { fontSize: 18, lineHeight: 22, marginLeft: 10 },
  filter: { fontWeight: "bold", fontSize: 18, lineHeight: 22 },
  filterContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  scrolContainer: { height: "100%", backgroundColor: "white" },
  rowCenter: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: { fontSize: 18, lineHeight: 22, marginLeft: 30 },
  header: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  listContainer: { marginTop: 10, paddingVertical: 0 },
});
export default Player;