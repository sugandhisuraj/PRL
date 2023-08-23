
class AddNewContestModel {


    contestBracketType = 0;
    contestDescription = "";
    contestEquipment = "";
    contestID = 0;
    contestLogo = "";
    contestMaxPlayers = 0;
    contestName = "";
    contestRounds = 0;
    contestRules = "";
    contestScoringDescription = "";
    contestScoringType = "";
    contestTypeID = 0;
    eventID = "";
    contestPhoto = '';
    contestVideo = '';
    contestDate = '';
    contestDateEnd = '';

    contestTypeData = [];
    selectedContestType = {};
    contestBracketTypes = [];
    contestBracketSelectedType = {};
    loading = true;
    reset = () => {
        this.contestBracketType = 0;
        this.contestDescription = "";
        this.contestEquipment = "";
        this.contestID = 0;
        this.contestLogo = "";
        this.contestMaxPlayers = 0;
        this.contestName = "";
        this.contestRounds = 0;
        this.contestRules = "";
        this.contestScoringDescription = "";
        this.contestScoringType = "";
        this.contestTypeID = 0;
        this.eventID = "";
        this.contestPhoto = '';
        this.contestVideo = '';
        this.contestDate = '';
        this.contestDateEnd = '';

        this.contestTypeData = [];
        this.selectedContestType = {};
        this.contestBracketTypes = [];
        this.contestBracketSelectedType = {};
        this.loading = true;
        return this.createClone();
    }
    update = (key, value) => {
        this[key] = value;
        return this.createClone();
    }
    updates = (data) => {
        for (let obj in data) {
            this[obj.key] = obj.value;
        }
        return this.createClone();
    }
    createClone = () => {
        return { ...this };
    }
    saveContestData = () => {
        let saveEditedContestData = {
            contestID: Date.now(),
            eventID: this.eventID,
            contestBracketType: this.contestBracketType,
            contestDescription: this.contestDescription,
            contestEquipment: this.contestEquipment,
            //contestID :  parseInt(Math.random() * 100),
            // contestID: Date.now(),
            contestLogo: this.contestLogo,
            contestMaxPlayers: this.contestMaxPlayers,
            contestName: this.contestName,
            contestRounds: this.contestRounds,
            contestRules: this.contestRules,
            contestScoringDescription: this.contestScoringDescription,
            contestScoringType: this.contestScoringType,
            contestTypeID: this.contestTypeID,
            contestPhoto: this.contestPhoto,
            contestVideo: this.contestVideo,
            contestDate: this.contestDate,
            contestDateEnd: this.contestDateEnd
        }

        return saveEditedContestData;
    }
    resetEventModalForm = () => {
        this.eventName = "";
        this.eventLogo = "";
        this.eventDate = "";
        this.eventDateEnd = "";
        this.charityID = "";
        this.eventCategory = "";
        this.eventSubCategory = "";
        this.eventGenre = "";
        this.eventDescription = "";
        this.eventContestType = "";
        this.eventPicture = "";
        this.eventVideo = "";
        return this.createClone();
    }
    init = (eventModel, bracketTypes, contestTypesData) => {
        // let selectedContestType = eventModel.contestTypesData.filter(itr => itr.value == eventModel.eventContestType);
        this.contestMaxPlayers = '';
        this.contestDescription = '';
        this.contestBracketTypes = bracketTypes;
        this.eventID = eventModel.currentEventData.eventID;
        this.contestTypeData = contestTypesData;
        this.selectedContestType = { ...contestTypesData[0] };
        this.loading = false;
        return this.onChangeContestType(contestTypesData[0]);
        return this.createClone();
    }
    onChangeContestType = (selectedContestType, chooseFromContest = false) => {
        if (chooseFromContest) {
            this.contestBracketSelectedType = this.contestBracketTypes.find(i => {
                return selectedContestType.contestBracketType == i.contestBracketTypeID
            });
            this.contestEquipment = selectedContestType?.contestEquipment || '';
            this.contestScoringType = selectedContestType?.contestScoringType || '';
            this.contestName = selectedContestType?.contestName || '';
            this.contestTypeID = selectedContestType?.contestTypeID || '';
            this.contestLogo = selectedContestType?.contestLogo || '';
            this.contestPhoto = selectedContestType?.contestPhoto || '';
            this.contestVideo = selectedContestType?.contestVideo || '';
            this.contestRules = selectedContestType?.contestRules || '';
            this.contestScoringDescription = selectedContestType?.contestScoringDescription || '';
            this.contestMaxPlayers = selectedContestType?.contestMaxPlayers || '';
            this.contestDescription = selectedContestType?.contestDescription || '';
            this.contestDate = selectedContestType?.contestDate;
            this.contestDateEnd = selectedContestType?.contestDateEnd;
        } else {
            this.contestBracketSelectedType = {};
            this.contestEquipment = selectedContestType?.contestTypeEquipment || '';
            this.contestScoringType = selectedContestType?.contestScoringType || '';
            this.contestName = selectedContestType?.contestType || '';
            this.contestTypeID = selectedContestType?.contestTypeID || '';
            this.contestLogo = selectedContestType?.contestTypeLogo || '';
            this.contestPhoto = selectedContestType?.contestTypePhoto || '';
            this.contestVideo = selectedContestType?.contestTypeVideo || '';
            this.contestRules = selectedContestType?.contestTypeRules || '';
            this.contestScoringDescription = selectedContestType?.contestTypeScoring || '';
            this.contestDate = '';
            this.contestDateEnd = '';
        }

        this.selectedContestType = selectedContestType;
        return this.createClone();
    }
    onSelectBracketType = (selectedBracketType) => {
        this.contestBracketType = selectedBracketType.contestBracketTypeID;
        this.contestBracketSelectedType = selectedBracketType;
        return this.createClone();
    }
    onNewContestTypeAdded = (newContestTypeAdded) => {
        let newContestTypeData = [...this.contestTypeData];
        newContestTypeData.push(newContestTypeAdded);
        this.contestTypeData = newContestTypeData;
        //return this.createClone();
        return this.onChangeContestType(newContestTypeAdded);
    }
}

export default new AddNewContestModel();


