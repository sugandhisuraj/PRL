
import { transformFirebaseValues, removeDuplicateFromArr } from '@utils';

class PlayerListModel {
    loading = true;
    initLoaded = false;

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
        selectedEvent,
        contestColRes,
        event) => {
        let userEnteredContestTrans = transformFirebaseValues(userEnteredContestColRes, 'userID');
        let userColResTrans = transformFirebaseValues(userColRes, 'uid');
        let contestColResTrans = transformFirebaseValues(contestColRes, 'contestID');
        let playersList = [];
        event.isSelected = true;
        this.selectedEvent = { ...event };

        let userEntContest = userEnteredContestTrans.filter(enteredContest => {
            return selectedEvent?.eventID == enteredContest.eventID;
        });
        let removeDuplicateContest = removeDuplicateFromArr(userEntContest, 'userID');
        if (removeDuplicateContest.length > 0) {
            removeDuplicateContest.map((singleUserCon) => {

                let user = userColResTrans.find(u => singleUserCon.userID == u.uid);
                let contestData = [];
                userEntContest.map((userEntC) => {
                    if (singleUserCon.userID == userEntC.userID) {
                        let isContestFind = false;
                        contestColResTrans.map((contest) => {
                            if (userEntC.contestID == contest.contestID) {
                                isContestFind = true;
                                contestData.push(contest);
                            }
                        });
                        if (!isContestFind) {
                            contestData.push(userEntC);
                        }
                    }
                });

                let playersData = {
                    userData: user,
                    contestData,
                    eventData: this.selectedEvent
                };

                playersList.push(playersData);
            });


        }
        

        this.playerList = playersList;
        this.onPlayerList = playersList;
        this.events = allEvents;
        this.userEnteredContest = userEnteredContestTrans;
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