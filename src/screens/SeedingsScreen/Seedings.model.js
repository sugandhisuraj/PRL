import moment from 'moment';
const firebaseModel = {
    contestID: null,
    eventID: null,
    gameDate: '',
    gameEstStartTime: '',
    gameEstStartTimestamp: '',
    gameRecordingOn: true,
    gameScheduleCompleted: false,
    gameSeedMethod: 'Random',
    gameStartDate: '',
    gameTimeBetweenMins: 1,
    gameTotalRounds: 1
}
class SeddingsModel {
    noEventsAvail = false;
    events = [];
    bracketTypes = [];
    selectedEvent = {};
    numOfPeriod = 5;
    loader = true;
    HH = [];
    MM = [];
    BTM = [];
    selectedHH = "";
    selectedMM = "";
    selectedMeridian = "AM";
    selectedBtm = 5;
    recordGamesPermission = [];
    selectedRecordGamesPermission = 'Yes';
    selectedContestBracketType = '';
    fields = {};
    gameStartDatePick = '';
    constructor() {
        this.HH = new Array(12).fill(1).map((i, j) => {
            if (j + 1 < 10) {
                let v = j + 1 + '';
                return { value: `0${v}` };
            } else {
                return { value: j + 1 + '' };
            }
        });
        this.MM = new Array(60).fill(1).map((i, j) => {
            if (j + 1 < 11) {
                let v = j + '';
                return { value: `0${v}` };
            } else {
                return { value: j + '' };
            }
        });
        this.BTM = new Array(59).fill(1).map((i, j) => ({ value: j + 1 }));
        this.recordGamesPermission = [
            {
                value: 'Yes'
            },
            {
                value: 'No'
            }
        ]
    }
    init = (allEvents, bracketTypes, auth, filteredPlayerData, allContestData) => {
        let oprEvents = [];

        if (auth.userCol.userType == 'admin') {
            oprEvents = [...allEvents];
        } else {
            oprEvents = allEvents.filter(i => {
                return i.organizerID == auth.userId;
            });
        }
        this.events = oprEvents.map((aE) => {
            let players = [];
            let contestData = [];
            allContestData.map((cD) => {
                if (cD.eventID == aE.eventID) {
                    contestData.push(cD);
                }
            });
            contestData = contestData.map((cd) => {
                let returnValue = { ...cd, players: [] };
                filteredPlayerData.map((pd) => {
                    if (cd.contestID == pd.contestID) {
                        returnValue.players.push(pd);
                    }
                });
                return returnValue;
            });
            //let filteredContestPlayers = removeDuplicateFromArr(contestData.players, 'userID');
            //contestData.players = [...filteredContestPlayers];
            return {
                ...aE,
                players: players,
                contestData
            }
        });
        console.log('COMPOSITION_SEDDINGS_2 - ', JSON.stringify(this.events));
        if (this.events.length == 0) {
            this.noEventsAvail = true;
            this.loader = false;
            return this.createClone();
        }
        this.selectedEvent = this.events[0];
        this.bracketTypes = bracketTypes;
        let fields = { ...firebaseModel };
        fields.eventID = this.selectedEvent.eventID;
        this.fields = fields;
        this.loader = false;
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

    onEventSelect = (eventData) => {

        this.selectedEvent = { ...eventData };
        let newFields = { ...this.fields };
        newFields.eventID = eventData.eventID;
        newFields.contestID = null;
        this.fields = { ...newFields };
        return this.createClone();
    }
    onContestSelect = (contestData) => {
        let newFields = { ...this.fields };
        newFields.contestID = contestData.contestID;
        this.fields = newFields;
        return this.createClone();
    }
    onSchDateSelect = (date) => {
        let newFields = { ...this.fields };
        let gameStartDatePick = new Date(date);
        this.gameStartDatePick = gameStartDatePick;
        newFields.gameDate = moment(this.gameStartDatePick).format('MM/DD/YYYY');
        newFields.gameStartDate = moment(this.gameStartDatePick).format('MM/DD/YYYY');
        this.fields = newFields;
        return this.createClone();
    }
    getFirebaseData = () => {
        let fields = { ...this.fields };
        let gameEstStartTime = `${this.selectedHH}:${this.selectedMM} ${this.selectedMeridian}`;
        let gameRecordingOn = this.selectedRecordGamesPermission == 'Yes';
        let readyTimestamp = this.gameStartDatePick;
        let readyHour = parseInt(this.selectedHH);
        if (this.selectedMeridian == 'PM') {
            readyHour = readyHour + 12;
        }
        readyTimestamp.setHours(readyHour, parseInt(this.selectedMM));
        return {
            contestID: fields.contestID,
            eventID: fields.eventID,
            gameDate: fields.gameDate,
            gameEstStartTime: gameEstStartTime,
            gameEstStartTimestamp: readyTimestamp,
            gameRecordingOn: gameRecordingOn,
            gameScheduleCompleted: false,
            gameSeedMethod: 'Random',
            gameStartDate: fields.gameDate,
            gameTimeBetweenMins: this.selectedBtm,
            gameTotalRounds: parseInt(this.numOfPeriod),
            createdAt: new Date(),
            bracketType: this.selectedContestBracketType
        }
    }
    currentContestNumPlayers = () => {
        if (!this.fields.contestID) {
            return {
                ...filterContest,
                numOfPlayers: null
            };
        }
        let filterContest = this.selectedEvent.contestData.find(i => i.contestID == this.fields.contestID);
         
        if (filterContest == undefined || 
            filterContest == null || 
            filterContest.players == undefined 
            || filterContest.players?.length == 0) { 
            return {
                ...filterContest,
                numOfPlayers: 0
            };
        } 
        return {
            ...filterContest,
            numOfPlayers: filterContest.players.length
        };
    }
}

export default SeddingsModel;