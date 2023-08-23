
class ProfileModel {

    eventID = 0;
    profileImageQ = "";
    profileQ1Label = "";
    profileQ2Label = "";
    profileQ3Label = "";
    profileQ4Label = "";
    profileVideoQ = "";


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

    getFirebaseData = (addData = {}) => {
        return {
            eventID: this.eventID,
            profileImageQ: this.profileImageQ,
            profileQ1Label: this.profileQ1Label,
            profileQ2Label: this.profileQ2Label,
            profileQ3Label: this.profileQ3Label,
            profileQ4Label: this.profileQ4Label,
            profileVideoQ: this.profileVideoQ,
            ...addData
        }
    }
    resetCreateProfileForm = () => {
        this.eventID = 0;
        this.profileImageQ = "";
        this.profileQ1Label = "";
        this.profileQ2Label = "";
        this.profileQ3Label = "";
        this.profileQ4Label = "";
        this.profileVideoQ = "";
        return this.createClone();
    }
    isFormValid = () => {
        let returnVal = {
            error: false,
            value: ''
        }
        if (this.profileQ1Label.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Profile Question 1';
        }else if (this.profileQ2Label.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Profile Question 2';
        }else if (this.profileQ3Label.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Profile Question 3';
        }else if (this.profileQ4Label.length == 0) {
            returnVal.error = true;
            returnVal.value = 'Enter Profile Question 4';
        }else if (this.profileImageQ.length == 0){
            returnVal.error = true;
            returnVal.value = 'Enter Prompt for Player Picture';
        }else if (this.profileVideoQ.length == 0){
            returnVal.error = true;
            returnVal.value = 'Enter Prompt for Player Video';
        }
        return returnVal;
    }
}

export default new ProfileModel();


