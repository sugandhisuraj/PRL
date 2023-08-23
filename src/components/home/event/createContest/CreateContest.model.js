import {
    transformFirebaseValues,
    maxNumberArrOfObj
} from '@utils';

class CreateContest {

    //Firebase fields
    contestScoringType = "";
    contestType = "";
    contestTypeEquipment = "";
    contestTypeID = "";
    contestTypeLogo = "";
    contestTypePhoto = "";
    contestTypeRules = "";
    contestTypeScoring = "";
    contestTypeVideo = "";

    //Firebase fields ends

    contestScoringTypes = [];
    selectedContestScoringType = {};

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
    loadContents = (scoringTypes, allContestTypes) => {
        let contestScoringTypes = transformFirebaseValues(scoringTypes, 'name');
        this.contestScoringTypes = contestScoringTypes;
        const transContestType = transformFirebaseValues(allContestTypes, 'contestTypeID')
        let contestTypeID = maxNumberArrOfObj(transContestType, 'contestTypeID');
        this.contestTypeID = ++contestTypeID;
        return this.createClone();
    }
    saveContestData = () => {
        return {
            contestScoringType: this.contestScoringType,
            contestType: this.contestType,
            contestTypeEquipment: this.contestTypeEquipment,
            contestTypeID: this.contestTypeID,
            contestTypeLogo: this.contestTypeLogo,
            contestTypePhoto: this.contestTypePhoto,
            contestTypeRules: this.contestTypeRules,
            contestTypeScoring: this.contestTypeScoring,
            contestTypeVideo: this.contestTypeVideo,
        }
    }
    onChangeScoringType = (selectedScoring) => {
        this.contestScoringType = selectedScoring.value;
        this.selectedContestScoringType = selectedScoring;
        return this.createClone();
    }

    reset = () => {
        this.contestScoringType = "";
        this.contestType = "";
        this.contestTypeEquipment = "";
        this.contestTypeID = "";
        this.contestTypeLogo = "";
        this.contestTypePhoto = "";
        this.contestTypeRules = "";
        this.contestTypeScoring = "";
        this.contestTypeVideo = "";

        //Firebase fields ends

        this.selectedContestScoringType = {};
        return this.createClone();
    }
    checkIsFormFill = () => {
        let returnVal = {
            error: false,
            value: ''
        };
        if (this.contestType.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Contest Name';
        }
        else if (this.contestTypeLogo.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Select Contest Logo';
        }else if (this.contestTypeRules.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Contest Rules';
        } else if (this.contestScoringType.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Select Scoring Types';
        } else if (this.contestTypeScoring.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Contest Scoring';
        } else if (this.contestTypeEquipment.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Contest Equipments';
        } else if (this.contestTypePhoto.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Select Contest Photo';
        } else if (this.contestTypeVideo.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Select Contest Video';
        }

        return returnVal;
    }
}

export default new CreateContest();


