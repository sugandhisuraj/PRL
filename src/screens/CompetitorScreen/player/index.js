import React, { useState, useEffect, Fragment } from "react";
import {
  Image,
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
import PlayerListModel from "./Competetior.model";
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
import AntDesign from 'react-native-vector-icons/AntDesign'
import { useAdsBanner } from '@hooks';

AntDesign.loadFont();

const Player = (props) => {
  const [showFilter, setShowfilter] = useState(false);
  const [playerModel, setPlayerModel] = useState(() => PlayerListModel);
  const { firebaseAllCollectionData, auth } = useSelector(s => s);
  const [
    renderAdsBanner,
    BannerAdsComponent
  ] = useAdsBanner(auth);
  console.log('AUHT_CT - ', auth.userId);
  const fetchData = async () => {
    const userEnteredContestColRes = await userEnteredContestsCollection.get();
    const userColRes = await usersCollection.get();
    const contestColRes = await contestsCollection.get();

    let allEvents = [...firebaseAllCollectionData.firebaseCollectionData.eventsData];
    console.log('COMPETTITOR_SCREE_TEST - ', JSON.stringify(allEvents));
    setPlayerModel(
      playerModel.loadContent(
        allEvents,
        userEnteredContestColRes,
        userColRes,
        contestColRes,
        auth.userId
      )
    );
  };
  // useEffect(() => {
  //   console.log(
  //     "I_WILL_RUN_ON_CHANGE_3 - ",
  //     JSON.stringify(props.route.params.event)
  //   );
  // }, [props.route.params.event]);
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

  console.log('JSON_CHECK_@@ - ', JSON.stringify(playerModel.competetorList))
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
                onPress={() => props.navigation.navigate('Home', {
                  screen: 'HomeScreen'
                })}
              >
                <Back style={{ marginLeft: 20 }} />
              </TouchableOpacity>
            </View>
          </View>
          {/* <TouchableOpacity
            onPress={() => {
              setShowfilter(!showFilter);
            }}
            style={{ marginRight: 30 }}
            hitSlop={bigHitSlop}
          >
            <Filter />
          </TouchableOpacity> */}
        </View>
        {/* {showFilter && (
          <View style={styles.filterContainer}>
            <Text style={styles.filter}>Filters:</Text>
            <TouchableOpacity>
              <Text style={styles.tag}>Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.tag}>Filters</Text>
            </TouchableOpacity>
          </View>
        )} */}
        <View style={styles.listContainer}>
          {
            playerModel.competetorList.length == 0 &&
              playerModel.loading == false ?
              <Text style={styles.noCompetetiorText}>
                There are no Competitor Profiles currently.</Text> : null
          }
          {
            playerModel.competetorList.length > 0 ?
              playerModel.competetorList.map((cList, i) => {
                console.log('EVENT_IMG_TEST_1 - ', cList?.event?.eventLogo);
                return (
                  <Fragment>
                    <SingleHeading
                      onLeftComponent={(RenderPlaceholder) => {
                        return <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <Image
                          source={{ uri: cList?.event?.eventLogo }}
                          style={{
                            height: 50,
                            width: 50, borderRadius: 50,
                          }}
                        />
                        <View style={{marginLeft: 20}}>
                        {RenderPlaceholder}
                        </View>
                        </View>
                      }}
                      containerStyle={styles.eventNameHeadingStyle}
                      textColor={"white"}
                      placeholder={cList?.event?.eventName}
                      nullPlaceholder={true}
                      onRightComponent={() => {
                        return <TouchableOpacity
                          onPress={() => {
                            setPlayerModel(playerModel.onOpenSpecifiPlayer(i, !cList.visible));
                          }}>
                          <AntDesign name={cList.visible ? 'up' : 'down'}
                            color={'white'}
                            size={18}
                          />
                        </TouchableOpacity>
                      }}
                    />
                    {
                      cList.visible && cList.playersList.length > 0 ? (
                        <FlatList
                          data={cList.playersList || []}
                          showsHorizontalScrollIndicator={false}
                          showsVerticalScrollIndicator={false}
                          renderItem={({ item }) => {
                            return <PlayerItem
                              navEventId={cList?.event?.eventID}
                              item={item}
                              navigation={props.navigation} />
                          }}
                          keyExtractor={(item, index) => index}
                        />
                      ) : null
                    }
                    {
                      cList.visible && cList.playersList.length == 0 ?
                        <Text style={styles.noPlayerAvailTextStyle}>No Players Available!</Text> : null
                    }
                  </Fragment>
                );
              }) : null
          }
        </View>
      </ScrollView>
      <BannerAdsComponent />
    </Root>
  );
};
const styles = StyleSheet.create({
  noCompetetiorText: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 15,
    fontWeight: "bold",
    color: 'black'
  },
  noPlayerAvailTextStyle: {
    alignSelf: "center",
    marginVertical: 10,
    fontSize: 16,
    color: "black",
    fontWeight: "600",
  },
  eventNameHeadingStyle: {
    marginTop: 30,
    alignItems: "flex-start",
    paddingHorizontal: 30,
    backgroundColor: "#0B214D",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60
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

/* {playerModel?.initLoaded && playerModel?.playerList.length == 0 && (
            <Text style={styles.noPlayerAvailTextStyle}>
              No Players Available
            </Text>
          )} */