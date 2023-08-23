

class EditCharityModel {

    editCharityEdit = {};
    editCharity = {};
    
    createClone = () => ({ ...this });
    init = (charityToBeEdit) => {
        this.editCharityEdit = { ...charityToBeEdit };
        this.editCharity = { ...charityToBeEdit }; 
        return this.createClone();
    }

    updateKey = (key, value ) => {
        let newEdit = { ...this.editCharityEdit };
        newEdit[key] = value;
        this.editCharityEdit = newEdit;
        return this.createClone();
    }
    saveFirebase = () => {
        let currentEditData = {...this.editCharityEdit};
        return {
            id: currentEditData.id,
            data: {
                ...this.editCharity,
                charityName: currentEditData.charityName,
                charityURL: currentEditData.charityURL,
                charityContactEmail: currentEditData.charityContactEmail,
                charityContactNumber: currentEditData.charityContactNumber,
                charityMission: currentEditData.charityMission,
                charityDescription: currentEditData.charityDescription,
                charityLogo: currentEditData.charityLogo,
                charityPicture: currentEditData.charityPicture,
                charityVideo: currentEditData.charityVideo,
                charityTaxDocument: currentEditData.charityTaxDocument
            }
        }
    }
}
export default new EditCharityModel();


//charityID = '';
    //charityApproved = '';
    // charityName = '';
    // charityURL = '';
    // charityContactEmail = '';
    // charityContactNumber = '';
    // charityMission = '';
    // charityDescription = '';
    // charityContactName = '';
    // charityLogo = '';
    // charityPicture = '';
    // charityTaxDocument = '';
    // charityVideo = ''; 