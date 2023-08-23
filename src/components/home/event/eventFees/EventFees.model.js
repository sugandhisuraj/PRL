
import { transformFirebaseValues } from '@utils';


class EventFeesModel {

    paymentTerms = '';
    charityThankYouNote = '';
    eventInformation = '';
    contestName = '';
    contestFee = '';

    spinner = true;
    allContestCreated = [];
    selectedContest = {};
    eventContestFeeTypes = [];
    getDataForFirebase = (eventModal) => {
        let selectedEventContestFeeTypes = this.eventContestFeeTypes.filter(i => i.isSelected);
        let arrayForAddInContestFee = [];
        let singleContestFeeModel = {
            active: true,
            contestID: '',
            contestName: '',
            eventContestFeeCents: 0,
            eventContestFeeID: '',
            eventID: eventModal.EventFormFields.eventID,
            sortOrder: 0
        };

        this.allContestCreated.map(i => {
            let addContestFee = { ...singleContestFeeModel };
            addContestFee.contestName = i.uploadedData.contestName;
            addContestFee.eventContestFeeCents = parseFloat(i.fees).toFixed(2) * 100;
            addContestFee.contestID = i.uploadedData.contestID;
            arrayForAddInContestFee.push(addContestFee);
        });


        selectedEventContestFeeTypes.map((singleFee, index) => {
            let createNewFeeModal = { ...singleContestFeeModel };
            createNewFeeModal.contestName = singleFee.eventContestFeeType;
            createNewFeeModal.eventContestFeeCents = parseFloat(singleFee.eventContestFeeCents).toFixed(2) * 100;
            createNewFeeModal.sortOrder = singleFee.sortOrder;
            arrayForAddInContestFee.push({ ...createNewFeeModal });
        })
        return arrayForAddInContestFee;
    }
    // onInit = (selectedContest) => {
    //     this.allContestCreated = 
    //     return this.createClone();
    // }
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
    loadContent = (eventContestData, eventModalProps) => {
        let eventContestFeeTypesData = transformFirebaseValues(eventContestData, 'eventContestFeeType', [
            { 'isSelected': false },
            { 'eventContestFeeCents': 0 }
        ]);
        this.eventContestFeeTypes = eventContestFeeTypesData;
        let allContestCreated = [];
        eventModalProps.createContestFactory.map(i => {
            allContestCreated.push({ ...i });
        })
        this.allContestCreated = allContestCreated;
        this.spinner = false;
        return this.createClone();
    }
    resetFeesModel = () => {
        let newEventContestFeeTypes = [...this.eventContestFeeTypes];
        let updatedContestFee = [];
        newEventContestFeeTypes.map((i) => {
            updatedContestFee.push({
                ...i,
                'isSelected': false,
                'eventContestFeeCents': 0
            });
        });
        this.eventContestFeeTypes = updatedContestFee;
        this.allContestCreated = [];
        return this.createClone();
    }
    onSelectEventContestFeeTypes = (index) => {
        let eventContestFeeTypesNew = this.eventContestFeeTypes.slice();
        eventContestFeeTypesNew[index].isSelected = !eventContestFeeTypesNew[index].isSelected;
        eventContestFeeTypesNew[index].eventContestFeeCents = '';
        this.eventContestFeeTypes = eventContestFeeTypesNew;
        return this.createClone();
    }
    onChangeTextEventContestFeeTypes = (index, fees) => {
        let eventContestFeeTypesNew = this.eventContestFeeTypes.slice();
        eventContestFeeTypesNew[index].eventContestFeeCents = fees;
        this.eventContestFeeTypes = eventContestFeeTypesNew;
        return this.createClone();
    }
    getCreateBtnTitle = () => {
        let title = "Create";
        if (
            this.paymentTerms.length > 0 ||
            this.charityThankYouNote.length > 0 ||
            this.eventInformation.length > 0 ||
            this.contestFee.length > 0
        ) {
            title = "Save";
        }
        return title;
    }
    updateAllContestFee = (contestFee, index) => {
        let oldContest = [...this.allContestCreated];
        let oldChild = { ...oldContest[index] };
        oldChild.fees = contestFee;
        oldContest[index] = oldChild;
        this.allContestCreated = oldContest;
        return this.createClone();
    }
}

export default new EventFeesModel();
