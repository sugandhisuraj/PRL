class CharityModel {
  charityApproved = "Yes";
  charityName = "";
  charityURL = "";
  charityContactEmail = "";
  charityContactNumber = "";
  charityMission = "";
  charityDescription = "";
  charityContactName = "";
  charityLogo = "";
  charityPicture = "";
  charityTaxDocument = "";
  charityVideo = "";
  charityType = "";

  organizerID = "";
  organizerName = "";
  update = (key, value) => {
    this[key] = value;
    return this.createClone();
  };
  updates = (data) => {
    for (let obj in data) {
      this[obj.key] = obj.value;
    }
    return this.createClone();
  };
  createClone = () => {
    return { ...this };
  };
  saveFirebase = () => {
    // charityID = 1;
    let charityID = Date.now();
    return {
      charityID: charityID,
      charityApproved: this.charityApproved,
      charityName: this.charityName,
      charityType: this.charityType,
      charityURL: this.charityURL,
      charityContactEmail: this.charityContactEmail,
      charityContactNumber: this.charityContactNumber,
      charityMission: this.charityMission,
      charityDescription: this.charityDescription,
      charityContactName: this.charityContactName,
      charityLogo: this.charityLogo,
      charityPicture: this.charityPicture,
      charityTaxDocument: this.charityTaxDocument,
      charityVideo: this.charityVideo,
      organizerID: this.organizerID,
      organizerName: this.organizerName,
      sortOrder: 2,
    };
  };
  resetForm = (refs) => {
    refs.current.logo.current.reset(),
      refs.current.picture.current.reset(),
      refs.current.video.current.reset(),
      refs.current.charityType.current.reset(),
      //refs.current.tax.current.reset(),
      (this.charityApproved = "Yes");
    this.charityName = "";
    this.charityType = "";
    this.charityURL = "";
    this.charityContactEmail = "";
    this.charityContactNumber = "";
    this.charityMission = "";
    this.charityDescription = "";
    this.charityContactName = "";
    this.charityLogo = "";
    this.charityPicture = "";
    this.charityTaxDocument = "";
    this.charityVideo = "";
    // this.charityID = Date.now();
    return this.createClone();
  };
  init = (auth) => {
    this.organizerID = auth.userId;
    this.organizerName = auth.userCol.userName;

    return this.createClone();
  };
}

export default new CharityModel();
