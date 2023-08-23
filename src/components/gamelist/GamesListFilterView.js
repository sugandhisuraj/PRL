// External Imports
import React, { useState, useEffect } from "react";
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import { firebase } from '../../firebase';
import 'firebase/firestore';
import ArrowDownImage from '@assets/ArrowDown.png';
import ArrowUpImage from '@assets/ArrowUp.png';

const GamesListFilterView = (props) => {

  const sectionData = [{ name: "Event" }, {name: "Contest Type"}, { name: "Contest" }];
  const [eventCollapsed, setEventCollapsed] = useState(true);
  const [contestCollapsed, setContestCollapsed] = useState(true);
  const [contestTypeCollapsed, setContestTypeCollapsed] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState(0);
  const [selectedContestTypeId, setSelectedContestTypeId] = useState(0);
  const [selectedContestId, setSelectedContestId] = useState(0);
  const [eventContests, setEventContests] = useState([]);

  const filterContests = (eventID, contestTypeID) => {
    if (eventID === "" || eventID === 0 || eventID === undefined) {
      if (contestTypeID === "" || contestTypeID === 0 || contestTypeID === undefined) {
        setEventContests(props.allContests);
      } else {
        setEventContests(props.allContests.filter(contest => contest.contestTypeID === contestTypeID));
      }
    } else {
      const eventFiltered = props.allContests.filter(contest => contest.eventID === eventID);
      if (contestTypeID === "" || contestTypeID === 0 || contestTypeID === undefined) {
        setEventContests(eventFiltered);
      } else {
        setEventContests(eventFiltered.filter(contest => contest.contestTypeID === contestTypeID));
      }
    }
  };

  const renderContestType = ({ item }) => {
    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}
        onPress={() => {
          if (selectedContestTypeId === item.contestTypeID) {
            setSelectedContestTypeId(0);
            filterContests(selectedEventId, 0);
            setSelectedContestId(0);
          } else {
            setSelectedContestTypeId(item.contestTypeID);
            filterContests(selectedEventId, item.contestTypeID);
            setSelectedContestId(0);
          }
        }}>
        <View style={{ width: 24, height: 24, borderColor: 'white', borderWidth: 1, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
          {selectedContestTypeId == item.contestTypeID &&
            <View style={{ backgroundColor: 'white', borderColor: 'white', borderWidth: 1, borderRadius: 6, width: 12, height: 12, alignSelf: 'center' }} />
          }
        </View>
        <Text style={{ color: 'white', marginLeft: 15 }}>
          {item.contestType}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEvent = ({ item }) => {
    return (
      <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}
        onPress={() => {
          if (selectedEventId === item.eventID) {
            setSelectedEventId(0);
            filterContests(0, selectedContestTypeId);
            setSelectedContestId(0);
          } else {
            setSelectedEventId(item.eventID);
            filterContests(item.eventID, selectedContestTypeId);
            setSelectedContestId(0);
          }
        }}>
        <View style={{ width: 24, height: 24, borderColor: 'white', borderWidth: 1, borderRadius: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
          {selectedEventId == item.eventID &&
            <View style={{ backgroundColor: 'white', borderColor: 'white', borderWidth: 1, borderRadius: 6, width: 12, height: 12, alignSelf: 'center' }} />
          }
        </View>
        <Text style={{ color: 'white', marginLeft: 15 }}>
          {item.eventName}
        </Text>
      </TouchableOpacity>
    );
  };

  const eventNameFromId = (eventID) => {
    const foundObject = props.allEvents.find(event => event.eventID == eventID);
    if (foundObject !== undefined) {
      return foundObject.eventName;
    } else {
      return "???";
    }
  };

  const renderContest = ({ item }) => (
    <TouchableOpacity style={[{ flex: 1, padding: 10, borderWidth: 1, borderColor: 'white' },
      (selectedContestId == item.contestID) && { backgroundColor: 'white' }]}
      onPress={() => {
        if (selectedContestId === item.contestID) {
          setSelectedContestId(0);
        } else {
          setSelectedContestId(item.contestID);
        }
      }}>
      <Text style={selectedContestId === item.contestID ? { color: '#0B214D' } : { color: 'white' }}>
        {eventNameFromId(item.eventID)} - {item.contestName}
      </Text>
    </TouchableOpacity>
  )

  const renderSection = ({ item }) => (
    <View style={{ marginTop: 15 }}>
      <View>
        <Text style={{ color: 'white', fontWeight: 'bold', padding: 10, fontSize: 16 }}>
          {item.name}
        </Text>
        <TouchableOpacity style={{ position: 'absolute', right: 0, width: 24, height: 24, justifyContent: 'center' }}
          onPress={() => {
            if (item.name === 'Event') {
              setEventCollapsed(!eventCollapsed);
            } else if (item.name === 'Contest') {
              setContestCollapsed(!contestCollapsed);
            } else if (item.name === 'Contest Type') {
              setContestTypeCollapsed(!contestTypeCollapsed);
            }
          }}>
          {(item.name === 'Event' && eventCollapsed) || (item.name === 'Contest' && contestCollapsed) || (item.name === 'Contest Type' && contestTypeCollapsed) ?
            <Image source={ArrowUpImage} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} /> :
            <Image source={ArrowDownImage} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
          }
        </TouchableOpacity>
      </View>

      {((item.name === 'Event' && eventCollapsed) || (item.name === 'Contest' && contestCollapsed) || (item.name === 'Contest Type' && contestTypeCollapsed)) &&
        <FlatList
          style={{ marginLeft: 15 }}
          data={item.name === 'Event' ? props.allEvents : item.name === 'Contest' ? eventContests : props.allContestTypes }
          renderItem={item.name === 'Event' ? renderEvent : item.name === 'Contest' ? renderContest : renderContestType} />
      }
    </View>
  )

  useEffect(() => {
    setSelectedEventId(props.filteringEventId);
    
    if (props.filteringEventId === "" || props.filteringEventId === 0 || props.filteringEventId === undefined) {
      setEventContests(props.allContests);
    } else {
      setEventContests(props.allContests.filter(contest => contest.eventID === props.filteringEventId));
    }

    setSelectedContestId(props.filteringContestId);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "#0B214D", padding: 15 }}>
      <View style={{ alignItems: 'flex-end' }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={{width: 60}}
            onPress={() => {
              setSelectedContestId(0);
              setSelectedEventId(0);
              setSelectedContestTypeId(0);
              filterContests(0, 0);
            }}>
            <Text style={{ color: 'white' }}>
              Clear
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
                props.onFilter(selectedEventId, selectedContestId);
                props.onDismiss();
            }}>
            <Text style={{ color: 'white' }}>
              Done
          </Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        style={{ marginTop: 20 }}
        data={sectionData}
        renderItem={renderSection}
      />
    </View>
  );
};

export default GamesListFilterView;
