
/* eventFormMode 
    0 = create new event
    1 = update event
   eventFormMode */
const CreateContestFactoryModal = (selectedContest) => {
    return {
        selectedContest,
        isUploadedOnce: false,
        uploadedId: null,
        uploadedData: null,
        fees: ''
    }
}
const EventFormFields = {
    eventID: '',
    eventName: '',
    eventLogo: '',
    eventDate: '',
    eventDateEnd: '',
    charityType: '',
    charityID: '',
    eventCategory: '',
    eventSubCategory: '',
    eventGenre: '',
    eventDescription: '',
    eventContestType: '',
    eventPicture: '',
    eventVideo: '',
    eventPaymentTerms: '',
    eventThankYou: '',
    eventInformation: ''
}
class EventModel {

    loading = false;
    EventFormFields = {};

    charityData = [];
    categoryData = [];
    subCategoryData = [];
    genreData = [];
    contestTypesData = [];

    selectedCharityData = {};
    selectedEventContestType = {};

    eventFormMode = 0;
    savedEventFormFields = {
        id: null, data: null
    };

    createContestFactory = [];

    constructor() {
        this.EventFormFields = { ...EventFormFields };
    }
    createHandler = () => {
        console.log('INSIDE_CODE');
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
    loadContents = (
        eventCategoriesData,
        eventSubCategoriesData,
        eventGenreData,
        contestTypesData,
        charityData) => {

        this.EventFormFields = { ...this.EventFormFields, eventID: Date.now() };
        this.contestTypesData = contestTypesData;
        this.categoryData = eventCategoriesData;
        this.subCategoryData = eventSubCategoriesData;
        this.genreData = eventGenreData;
        this.charityData = charityData;

        return this.createClone();
    }
    getFirebaseData = () => {
        return {
            eventFormMode: this.eventFormMode,
            savedEventFormFields: this.savedEventFormFields,
            uploadEventToFirebase: {
                eventID: this.EventFormFields.eventID,
                eventName: this.EventFormFields.eventName,
                eventLogo: this.EventFormFields.eventLogo,
                eventDate: this.EventFormFields.eventDate,
                eventDateEnd: this.EventFormFields.eventDateEnd,
                charityID: this.EventFormFields.charityID == undefined ? 10 : this.EventFormFields.charityID,
                charityType: this.EventFormFields.charityType,
                eventCategory: this.EventFormFields.eventCategory,
                eventSubCategory: this.EventFormFields.eventSubCategory,
                eventGenre: this.EventFormFields.eventGenre,
                eventDescription: this.EventFormFields.eventDescription,
                eventContestType: this.EventFormFields.eventContestType,
                eventPicture: this.EventFormFields.eventPicture,
                eventVideo: this.EventFormFields.eventVideo,

                eventPaymentTerms: this.EventFormFields.eventPaymentTerms,
                eventThankYou: this.EventFormFields.eventThankYou,
                eventInformation: this.EventFormFields.eventInformation
            },

        }
    }
    resetEventModalForm = (shouldResetId = false) => {
        let EventFormFieldsNew = { ...EventFormFields };
        if (shouldResetId) {
            EventFormFieldsNew.eventID = Date.now();
            this.loading = false;
        }
        this.EventFormFields = EventFormFieldsNew;
        this.selectedCharityData = {};
        this.selectedEventContestType = {};
        this.eventFormMode = 0;
        this.savedEventFormFields = {
            id: null, data: null
        };
        this.createContestFactory = [];
        return this.createClone();
    }
    updateEventForm = (key, value, internalCall = false) => {
        let newEventForm = { ...this.EventFormFields };
        newEventForm[key] = value;
        this.EventFormFields = newEventForm;
        if (internalCall) {
            return;
        }
        return this.createClone();
    }

    updateCharityOnSelect = (charityID, charity) => {
        this.selectedCharityData = charity;
        this.updateEventForm('charityID', charityID, true);
        return this.createClone();
    }
    mutationsOnSavedEvents = (savedEventFormField) => {
        this.eventFormMode = 1;
        this.savedEventFormFields = { ...savedEventFormField };
        return this.createClone();
    }
    saveRemainFields = () => {
        return {
            id: this.savedEventFormFields.id,
            data: {
                eventPaymentTerms: this.EventFormFields.eventPaymentTerms,
                eventThankYou: this.EventFormFields.eventThankYou,
                eventInformation: this.EventFormFields.eventInformation,
            }
        }
    }
    updateContestTypeWhenContestAdded = (newlyContestAdded) => {
        let newContest = { ...newlyContestAdded };
        newContest.value = newlyContestAdded.contestType;
        let newAllContest = [...this.contestTypesData];
        newAllContest.push(newContest);
        this.contestTypesData = newAllContest;
        return this.createClone();
    }
    mutateToContestFactory = (selectedContest, mode = 'add', index = 0) => {
        if (mode == 'add') {
            let newContest = { ...CreateContestFactoryModal(selectedContest) };
            let newContestFactory = [...this.createContestFactory];
            newContestFactory.push(newContest);
            this.createContestFactory = newContestFactory;
        } else {
            let cloned = [...this.createContestFactory];
            let removedData = cloned.filter((o, i) => { return i != index; });
            this.createContestFactory = [...removedData];
        }
        return this.createClone();
    }
    onSingleContestUploaded = (uploadedData, uploadedId, index) => {
        let newArr = [...this.createContestFactory];
        let newObj = { ...newArr[index] };
        newObj.isUploadedOnce = true;
        newObj.uploadedId = uploadedId;
        newObj.uploadedData = uploadedData;

        newArr[index] = newObj;
        this.createContestFactory = newArr;
        return this.createClone();
    }
}

export default EventModel;

/*
eventModel.EventFormFields
updateEventForm
*/