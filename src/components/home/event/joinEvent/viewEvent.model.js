
import { transformFirebaseValues } from '@utils';
import moment from 'moment';

class ViewEventModel {
    isLoadedOnce = false;
    loading = true;
    selectedCategory = {};
    selectedSubCategory = {};
    selectedGenre = {};
    selectedContestType = {};

    fromDate = '';
    toDate = '';

    events = [];
    category = [];
    subCategory = [];
    genre = [];
    contestType = [];

    clearFilter = () => {
        this.category = this.resetAllChecks(this.category);
        this.subCategory = this.resetAllChecks(this.subCategory);
        this.genre = this.resetAllChecks(this.genre);
        this.selectedCategory = {};
        this.selectedSubCategory = {};
        this.selectedGenre = {};
        this.selectedContestType = {};
        this.fromDate = '';
        this.toDate = '';
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
    init = (
        events = [],
        eventCategories = [],
        eventSubCategories = [],
        eventGenre = [],
        contestTypes = []) => {

        //Transform arrays according to the order //
        let tEventCategories = eventCategories.sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1);
        let tEventSubCategories = eventSubCategories.sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1);
        let tEventGenre = eventGenre.sort((a, b) => a.sortOrder > b.sortOrder ? 1 : -1);
        //Transform arrays according to the order //
        this.events = events;
        this.category = tEventCategories;
        this.subCategory = tEventSubCategories;
        this.genre = tEventGenre;
        this.contestType = contestTypes;
        this.loading = false;
        this.isLoadedOnce = true;
        return this.createClone();
    }
    resetAllChecks = (item, key = 'isSelected') => {
        return [...item].map((i) => {
            return { ...i, [key]: false }
        });
    }
    onOptionsPress = (item, index, type) => {
        if (type == 'category') {
            console.log('NEW_CATE_1_ - ', JSON.stringify(this.category));
            this.selectedCategory = { ...item };
            let newCategory = this.resetAllChecks(this.category);
            newCategory[index].isSelected = !newCategory[index].isSelected;
            console.log('NEW_CATE_2_ - ', JSON.stringify(newCategory));
            this.category = newCategory.slice();
        }
        else if (type == 'subcategory') {
            this.selectedSubCategory = { ...item };
            let newSubCategory = this.resetAllChecks(this.subCategory);
            newSubCategory[index].isSelected = !newSubCategory[index].isSelected;
            this.subCategory = newSubCategory.slice();
        }
        else if (type == 'genre') {
            this.selectedGenre = { ...item };
            let newGenre = this.resetAllChecks(this.genre);
            newGenre[index].isSelected = !newGenre[index].isSelected;
            this.genre = newGenre.slice();
        }
        else if (type == 'contesttype') {
            this.selectedContestType = { ...item };

        }

        return this.createClone();
    }
    getObjLength = item => Object.keys(item).length > 0;

    removeSelectedFilter = (key) => {
        console.log('KEY_RECIEVE_HERE - ', key);
        if (key == 'selectedCategory') {
            this.category = this.resetAllChecks(this.category);
        }
        else if (key == 'selectedSubCategory') {
            this.subCategory = this.resetAllChecks(this.subCategory);
        } else if (key == 'selectedGenre') {
            this.genre = this.resetAllChecks(this.genre);
        } else if (key == 'date') {
            this.toDate = '';
            this.fromDate = '';
        }
        if (this[key]) {
            this[key] = {};
        }
        return this.createClone();
    }
    getSelectedFilter = () => {

        let selectedFilter = [];
        if (this.getObjLength(this.selectedCategory)) {
            selectedFilter.push({
                val: this.selectedCategory?.eventCategory || '',
                key: 'selectedCategory'
            });
        }
        if (this.getObjLength(this.selectedSubCategory)) {
            selectedFilter.push({
                val: this.selectedSubCategory?.name || '',
                key: 'selectedSubCategory'
            });
        }
        if (this.getObjLength(this.selectedGenre)) {
            selectedFilter.push({
                val: this.selectedGenre?.name || '',
                key: 'selectedGenre'
            });
        }
        if (this.getObjLength(this.selectedContestType)) {
            selectedFilter.push({
                val: this.selectedContestType?.contestType || '',
                key: 'selectedContestType'
            });
        }
        return selectedFilter;
    }
    getDateRange = () => {
        try {
            if (this.toDate == '' || this.fromDate == '') {
                return '';
            }
            let fromDD = moment(this.fromDate).format('DD');
            let fromMM = moment(this.fromDate).format('MM');
            let toDD = moment(this.toDate).format('DD');
            let toMM = moment(this.toDate).format('MM');
            console.log(`GEN_DATE_TO_RENDER -> ${fromDD}/${fromMM}  -  ${toDD}/${toMM}`);
            let val = `${fromDD}/${fromMM}  -  ${toDD}/${toMM}`;
            let returnValue = [{ val, key: 'date' }];
            return returnValue;
        } catch (error) {
            return { val: 'ERROR' };
        }
    }
    getEvents = () => {
        let isFilterOn = false;
        let isCategoryFiltered = false;
        let isSubCatFiltered = false;
        let isGenreFiltered = false;
        let isContestTypeFiltered = false;
        let isDateFiltered = false;
        let renderEvents = [];
        let returnData = {
            isFilter: false,
            isDateRange: false,
            events: [],
            upcommingEvents: [],
            pastEvents: [],
            liveEvents: []
        };
        if (this.getObjLength(this.selectedCategory)) {
            returnData.isFilter = true;
            isFilterOn = true;
            isCategoryFiltered = true;
            this.events.map((event) => {
                if (event.eventCategory == this.selectedCategory?.eventCategory) {
                    renderEvents.push(event);
                }
            })
        }
        if (this.getObjLength(this.selectedSubCategory)) {
            returnData.isFilter = true;
            isFilterOn = true;
            isSubCatFiltered = true;
            let filteredSubEvent = [];
            if (isCategoryFiltered) {
                filteredSubEvent = [...renderEvents].filter((event) => {
                    if (event.eventSubCategory == this.selectedSubCategory?.eventSubCategory) {
                        return true;
                    }
                });

            } else {
                filteredSubEvent = [...this.events].filter((event) => {
                    if (event.eventSubCategory == this.selectedSubCategory?.eventSubCategory) {
                        return true;
                    }
                });
            }
            renderEvents = [...filteredSubEvent];
        }
        if (this.getObjLength(this.selectedGenre)) {
            returnData.isFilter = true;
            let genreEvents = [];
            isFilterOn = true;
            isGenreFiltered = true;
            if (isCategoryFiltered || isSubCatFiltered) {
                genreEvents = [...renderEvents].filter((event) => {
                    if (event.eventGenre == this.selectedGenre?.eventGenreType) {
                        return true;
                    }
                });
            } else {
                genreEvents = [...this.events].filter((event) => {
                    if (event.eventGenre == this.selectedGenre?.eventGenreType) {
                        return true;
                    }
                });
            }
            renderEvents = [...genreEvents];
        }
        if (this.getObjLength(this.selectedContestType)) {
            returnData.isFilter = true;
            isContestTypeFiltered = true;
            let contestTypeEventsFilter = [];
            isFilterOn = true;
            if (isCategoryFiltered || isSubCatFiltered || isGenreFiltered) {
                contestTypeEventsFilter = [...renderEvents].filter((event) => {
                    if (event.eventContestType == this.selectedContestType?.contestType) {
                        return true;
                    }
                });
            } else {
                contestTypeEventsFilter = [...this.events].filter((event) => {
                    if (event.eventContestType == this.selectedContestType?.contestType) {
                        return true;
                    }
                });
            }
            renderEvents = [...contestTypeEventsFilter];
        }
        if (typeof this.fromDate == 'object' && typeof this.toDate == 'object') {
            returnData.isDateRange = true;
            isDateFiltered = true;
            let dateEventsFilter = [];
            isFilterOn = true;
            if (isCategoryFiltered || isSubCatFiltered || isGenreFiltered || isContestTypeFiltered) {

                dateEventsFilter = [...renderEvents].filter((event) => {
                    let eventStardDate = new Date(event.eventDate);
                    let eventEndDate = new Date(event.eventDateEnd);
                    if (eventStardDate >= this.fromDate || eventEndDate <= this.toDate) {
                        return true;
                    }
                });
            } else {
                dateEventsFilter = [...this.events].filter((event) => {
                    let eventStardDate = new Date(event.eventDate);
                    let eventEndDate = new Date(event.eventDateEnd);
                    if (eventStardDate >= this.fromDate && eventEndDate <= this.toDate) {
                        return true;
                    }
                });
            }
            renderEvents = [...dateEventsFilter];

        }


        if (isFilterOn) {
            returnData.events = [...renderEvents]
        } else {
            returnData.events = [...this.events];
        }

        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setMinutes(0, 0, 0);
        currentDate.setSeconds(0, 0);
        returnData.events.map(event => {
            let eventStartDate = new Date(event.eventDate);
            let eventEndDate = new Date(event.eventDateEnd); 
            if (
                (eventStartDate.getDate() == currentDate.getDate()) &&
                (eventStartDate.getMonth() == currentDate.getMonth()) &&
                (eventStartDate.getFullYear() == currentDate.getFullYear())
            ) {
                returnData.liveEvents.push({ ...event });
            }
            else if (eventStartDate > currentDate) {
                returnData.upcommingEvents.push({ ...event });
            }
            else if (eventEndDate < currentDate) {
                returnData.pastEvents.push({ ...event });
            } else if (eventEndDate > currentDate) {
                returnData.liveEvents.push({ ...event });
            } else {

            }
        });
        return returnData;
    }

    addPrivateEvent = (id, event) => {
        let newEvents = [...this.events];

        newEvents.push({
            event,
            id,
            value: event['eventName'],
            isSelected: false
        });

        this.events = newEvents;
        return this.createClone();
    }
};

export default ViewEventModel;


/*

console.log("DATE_TO_TEST - ", this.fromDate);
console.log("DATE_END_TEST - ", this.toDate);
console.log("TYPE_DATE_TO_TEST - ", typeof this.fromDate);
console.log("TYPE_DATE_END_TEST - ", typeof this.toDate);

*/