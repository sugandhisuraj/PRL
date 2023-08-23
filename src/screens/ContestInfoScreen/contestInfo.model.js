
//Mode == 0 View
//Mode == 1 Edit
import {
    transformFirebaseValues,
    maxNumberArrOfObj
} from '@utils';
class ContestInfoModel {

    ContestDetails = {};
    EventDetails = {};

    loading = true;
    //Edit Purpose keys
    allBracketTypeData = [];
    contestScoringTypes = [];
    mode = 0;
    editedContestDetails = {};

    //Edit Purpose Keys
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

    init = (
        ContestDetails,
        EventDetails,
        allBracketTypeData,
        contestScoringTypes) => {
        this.contestScoringTypes = transformFirebaseValues(contestScoringTypes, 'name');
        this.ContestDetails = { ...ContestDetails };
        this.EventDetails = { ...EventDetails };
        this.editedContestDetails = { ...ContestDetails };
        this.mode = 0;
        this.allBracketTypeData = allBracketTypeData;
        this.loading = false;
        return this.createClone();
    }
    onEditContest = (key, value) => {
        let editedContestDetails = { ...this.editedContestDetails };
        editedContestDetails[key] = value;
        this.editedContestDetails = editedContestDetails;
        return this.createClone();
    }
    dataSaved = (updatedData) => {
        let newUpdatedData = {
            ...this.ContestDetails,
            ...updatedData.data
        }
        this.ContestDetails = newUpdatedData;
        this.editedContestDetails = newUpdatedData;
        this.mode = 0;
        return this.createClone();
    }
    saveEditContestData = () => {
        let editedContestDetails = { ...this.editedContestDetails };
        return {
            id: editedContestDetails.id,
            data: {
                contestName: editedContestDetails.contestName,
                contestDate: editedContestDetails.contestDate,
                contestDateEnd: editedContestDetails.contestDateEnd,
                contestMaxPlayers: editedContestDetails.contestMaxPlayers,
                contestBracketType: editedContestDetails.contestBracketType,
                contestDescription: editedContestDetails.contestDescription,
                contestRules: editedContestDetails.contestRules,
                contestScoringDescription: editedContestDetails.contestScoringDescription,
                contestEquipment: editedContestDetails.contestEquipment,
                contestScoringType: editedContestDetails.contestScoringType,
                
                contestLogo: editedContestDetails.contestLogo,
                contestPhoto: editedContestDetails.contestPhoto,
                contestVideo: editedContestDetails.contestVideo

            }
        }
    }
}
export default new ContestInfoModel();