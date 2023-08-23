
import { transformFirebaseValues, removeDuplicateFromArr } from '@utils';
import moment from 'moment';

class PlayerListModel {
    loading = true;
    initLoaded = false;
    competetorList = [];
    playerList = [];
    onPlayerList = [];
    events = [];
    userEnteredContest = [];
    users = [];
    contest = [];
    selectedEvent = {};
    selectedContest = {};
    resetAllChecks = (item, key = 'isSelected') => {
        return [...item].map((i) => {
            return { ...i, [key]: false }
        });
    }
    clearFilter = () => {
        this.selectedEvent = {};
        this.selectedContest = {};
        this.playerList = this.onPlayerList;
        this.events = this.resetAllChecks(this.events, 'isSelected');
        return this.createClone();
    }
    update = (key, value) => {
        this[key] = value;
        return this.createClone();
    }
    updates = (data) => {
        for (let key in data) {
            for (let objKey in data[key]) {
                this[objKey] = data[key][objKey];
            }
        }
        return this.createClone();
    }
    createClone = () => {
        return { ...this };
    }

    loadContent = (allEvents,
        userEnteredContestColRes,
        userColRes,
        contestColRes,
        userID) => {
        console.log('USER_ID_REC_HERE - ', userID);
        let userColResTrans = transformFirebaseValues(userColRes, 'uid');
        let contestColResTrans = transformFirebaseValues(contestColRes, 'contestID');

        let userEnteredContestColResTrans = transformFirebaseValues(userEnteredContestColRes, 'userID');
        let myEnteredContestData = [];
        userEnteredContestColResTrans.map((ui) => {
            if (ui.userID == userID) {
                myEnteredContestData.push(ui);
            }
        })

        myEnteredContestData = removeDuplicateFromArr(myEnteredContestData, 'eventID');
        let currentCompetetiorEvents = [];
        myEnteredContestData.map((c) => {
            allEvents.map((e) => {
                if (c.eventID == e.eventID) {
                    currentCompetetiorEvents.push(e);
                }
            });
        });

        console.log('MY_COMPETETIOR_EVENTS - ', JSON.stringify(currentCompetetiorEvents));
        let competetorList = [];
        let competetorModel = {
            playersList: [],
            event: {},
            visible: false
        };
        currentCompetetiorEvents.map((e, i) => {
            let mod = { ...competetorModel };
            mod.playersList = [];
            if (i == 0) {
                mod.visible = true;
            }
            mod.event = e;
            let currentExecutedCompetetiors = [];
            userEnteredContestColResTrans.map(enteredContest => {
                if (e?.eventID == enteredContest.eventID) {
                    currentExecutedCompetetiors.push(enteredContest);
                }
            });
            let removeDuplicateFromCurrentCompetetiors = removeDuplicateFromArr(currentExecutedCompetetiors, 'userID');
            if (removeDuplicateFromCurrentCompetetiors.length > 0) {
                
                removeDuplicateFromCurrentCompetetiors.map(cEC => {
                    let pushData = {
                        userData: {},
                        contestData: [],
                        eventData: e,
                        isUserFind: false,
                        userEnteredContest: {}
                    };
                    userColResTrans.map(userM => {
                        if (userM.uid == cEC.userID) {
                            pushData.userData = { ...userM };
                            pushData.isUserFind = true;
                            pushData.userEnteredContest = {...cEC};
                            let contestData = [];
                            currentExecutedCompetetiors.map(cEC1 => {
                                contestColResTrans.map(cCRT => {
                                    if (cCRT.contestID == cEC1.contestID && userM.uid == cEC1.userID) {
                                        contestData.push(cCRT);  
                                    }
                                })
                            });
                            let removeDup = removeDuplicateFromArr(contestData, 'contestID');
                            pushData.contestData = [...removeDup];
                            
                        }
                    }); 
                    if (pushData.isUserFind) {
                        mod.playersList.push(pushData);
                    }
                });
                
            }
            // if (currentExecutedCompetetiors.length > 0) {
            //     currentExecutedCompetetiors.map(cEC => {
            //         let userData = userColResTrans.find(user => user.uid == cEC.userID);

            //         let playersData = {
            //             userData,
            //             contestData: [],
            //             eventData: e
            //         };
            //         mod.playersList.push(playersData);
            //     })
            // } 
            competetorList.push({ ...mod });
        });
        this.competetorList = competetorList;
        this.onPlayerList = competetorList;
        this.events = allEvents;
        this.userEnteredContest = userEnteredContestColResTrans;
        this.users = userColResTrans;
        this.loading = false;
        this.initLoaded = true;
        this.contest = contestColResTrans;
        return this.createClone();
        // console.log('EVENT_RES - ', JSON.stringify(eventTrans));
        // console.log('user_ENTERED_CONTEST_TRANS - ', JSON.stringify(userEnteredContestTrans));
        // console.log("USER_COL_RES - ", JSON.stringify(userColResTrans));
        // console.log('COMPLETE_PLAYER_LIST - ', JSON.stringify(playersList));
    }
    onOptionsPress = (item, index, type) => {
        if (type == 'selectedEvent') {
            let newEvent = [...this.events].map(i => ({ ...i, isSelected: false }));
            newEvent[index].isSelected = !newEvent[index].isSelected;
            this.selectedEvent = item;
            this.events = newEvent;
            this.switchEventContent(item);
        }
        else if (type == 'selectedContest') {
            this.selectedContest = { ...item };
        }
        return this.createClone();
    }
    switchEventContent = (selectedEvent) => {
        let playersList = [];

        let userEntContest = this.userEnteredContest.filter(enteredContest => {
            return selectedEvent?.eventID == enteredContest.eventID;
        });

        if (userEntContest.length > 0) {
            this.users.map(user => {
                let userContestData = userEntContest.filter(entContest => {
                    return entContest.userID == user.uid;
                });
                let conToBePush = [];
                let updatedUserContestData = userContestData.map(i => {
                    let contestInfoData = undefined;
                    if (i?.contestID != undefined) {
                        let check = this.contest.find(contest => {
                            return i.contestID == contest.contestID;
                        });
                        if (check != undefined) {
                            contestInfoData = check;
                        }
                    }
                    if (contestInfoData != undefined) {
                        conToBePush.push({
                            ...i,
                            contestInfoData
                        });
                    }
                });
                if (conToBePush.length > 0) {
                    let playersData = {
                        userData: user,
                        contestData: conToBePush,
                        eventData: selectedEvent
                    };
                    playersList.push(playersData);
                }

            });
        }

        this.playerList = playersList;
        return;
    }

    onOpenSpecifiPlayer = (index, status) => {
        console.log('INDEX_RECIEVE - ', index, 'STATUS - ', status);
        let newCompetetitorData = [...this.competetorList];
        let notVisible = newCompetetitorData.map(i => ({ ...i, visible: false }));
        notVisible[index].visible = status;
        this.competetorList = notVisible;
        return this.createClone();
    }
};

export default new PlayerListModel();

//Old Transformation
/*
eventTrans.map(event => {
            let userEntContest = userEnteredContestTrans.filter(enteredContest => {
                return event.eventID == enteredContest.eventID;
            });
            userEntContest.map(singleUserEnt => {
                let getUserInfo = userColResTrans.find(user => {
                    return user.uid == singleUserEnt.userID;
                });
                if (getUserInfo) {
                    let playersData = {
                        userData: getUserInfo,
                        contestData: singleUserEnt,
                        eventData: event
                    };
                    playersList.push(playersData);
                }
            })
        });
*/