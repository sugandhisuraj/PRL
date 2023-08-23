
class ContestModel {


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
    saveContestData = (eventModalProps, currentIndex) => {
        let saveEditedContestData = {};
        let currentContestFactory = eventModalProps.createContestFactory[currentIndex];
        if (!currentContestFactory.isUploadedOnce) {
            saveEditedContestData.contestID = Date.now();
            saveEditedContestData.eventID = this.eventID;
        }
        saveEditedContestData = {
            ...saveEditedContestData,
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

        return {
            uploadedId: currentContestFactory.uploadedId,
            isUploadedOnce: currentContestFactory.isUploadedOnce,
            saveEditedContestData
        };
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
    init = (bracketTypes, eventModel, currentContestFactoryIndex = 0) => {
        // let selectedContestType = eventModel.contestTypesData.filter(itr => itr.value == eventModel.eventContestType);
        this.contestMaxPlayers = '';
        this.contestDescription = '';
        this.contestBracketTypes = bracketTypes;
        this.contestTypeData = eventModel.contestTypesData;
        this.eventID = eventModel.EventFormFields.eventID;
        let currentContest = eventModel.createContestFactory[currentContestFactoryIndex];
        let currentVal = currentContest.isUploadedOnce ? currentContest.uploadedData : currentContest.selectedContest;
        return this.onChangeContestType(currentVal, currentContest.isUploadedOnce);
    }
    onChangeContestType = (selectedContestType, chooseFromContest) => {
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
}

export default new ContestModel();


