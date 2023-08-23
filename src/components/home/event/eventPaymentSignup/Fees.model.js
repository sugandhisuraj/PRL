import { transformFirebaseValues, sortArrayAlphabatically } from "@utils";

class FeesModel {
  loading = true;
  eventPropData = {};

  allContestTypeFees = [];
  allEventTypeFees = [];
  allFeesData = [];
  allCharityData = [];
  selectedCharityData = {};
  isSpectatorMode = {
    mode: false,
    index: -1,
    action: false,
  };
  resetScreen = () => {
    this.loading = true;
    this.eventPropData = {};
    this.allContestTypeFees = [];
    this.allEventTypeFees = [];
    this.allFeesData = [];
    this.allCharityData = [];
    this.selectedCharityData = {};
    this.isSpectatorMode = {
      mode: false,
      index: -1,
      action: false,
    };
    return this.createClone();
  };
  onInit = (
    allFees,
    eventPropData,
    preSignupData = [],
    allCharityDataShift = []
  ) => {
    this.eventPropData = eventPropData;
    let allContestTypeFees = [];
    let allEventTypeFees = [];
    allCharityDataShift.shift();
    this.allCharityData = allCharityDataShift;
    console.log(
      "ALL_CHARITY_RECIEVE_HERE - ",
      JSON.stringify(this.allCharityData)
    );
    let allFeesData = transformFirebaseValues(allFees, "contestName", [
      {
        isSelected: false,
        isAlreadyPaid: false,
      },
    ]);
    let isSpectatorMode = {
      mode: false,
      index: -1,
      action: false,
    };
    allFeesData.map((data, i) => {
      // if (eventPropData.eventID == data.eventID) {
      let isAlreadyPaid = false;
      preSignupData.map((psD) => {
        if (
          psD.contestID == data.contestID &&
          psD.contestName == data.contestName
        ) {
          isAlreadyPaid = true;
        }
      });
      if (data.contestID) {
        allContestTypeFees.push({ ...data, isAlreadyPaid });
      } else {
        allEventTypeFees.push({ ...data, isAlreadyPaid });
      }
      // }
    });
    // allEventTypeFees.map((i,j) => {
    //     if (i.contestName == 'Spectator') {
    //         isSpectatorMode.mode = true;
    //         isSpectatorMode.index = j
    //     }
    // })
    this.allContestTypeFees = sortArrayAlphabatically(
      allContestTypeFees,
      "sortOrder"
    );
    this.allEventTypeFees = sortArrayAlphabatically(
      allEventTypeFees,
      "sortOrder"
    );
    this.allEventTypeFees.map((i, j) => {
      if (i.contestName.includes("Spectator")) {
        // == 'Spectator'
        isSpectatorMode.mode = true;
        isSpectatorMode.index = j;
      }
    });
    console.log("INDEX_FINILIZE_AT - ", isSpectatorMode.index);
    this.allFeesData = allFeesData;
    this.loading = false;
    this.isSpectatorMode = isSpectatorMode;
    return this.createClone();
  };
  update = (key, value) => {
    this[key] = value;
    return this.createClone();
  };
  updates = (data) => {
    for (let key in data) {
      for (let objKey in data[key]) {
        this[objKey] = data[key][objKey];
      }
    }
    return this.createClone();
  };
  pressBtns = (cFees, index, type) => {
    if (type == "allContestTypeFees") {
      let newContestType = [...this.allContestTypeFees];
      newContestType[index].isSelected = !newContestType[index].isSelected;
      this.allContestTypeFees = newContestType;
      let count = this.getNumOfContestSelected(newContestType);
      console.log("COUNT_All_Contest_Type_HERE - ", count);
      if (
        count > 0 &&
        this.isSpectatorMode.mode &&
        this.isSpectatorMode.index > -1
      ) {
        let newSpecT = [...this.allEventTypeFees];
        newSpecT[this.isSpectatorMode.index].isSelected = true;
        let newSpectD = { ...this.isSpectatorMode };
        newSpectD.action = true;
        this.isSpectatorMode = newSpectD;
        this.allEventTypeFees = newSpecT;
      } else {
          console.log("is spectator mode --> ", this.isSpectatorMode.mode, index, this.isSpectatorMode.index)
        if (
            this.isSpectatorMode.mode == true
          ) {
            console.log("action true");
            let newEventTypeFees = [...this.allEventTypeFees];
            newEventTypeFees[this.isSpectatorMode.index].isSelected = false;
            this.allEventTypeFees = newEventTypeFees;
          }
        let newSpectData = { ...this.isSpectatorMode };
        newSpectData.action = false;
        this.isSpectatorMode = newSpectData;
        // let newSpecT = [...this.allEventTypeFees];
        // newSpecT[this.isSpectatorMode.index].isSelected = false;
        // this.allEventTypeFees = newSpecT;
      }
    } else if (type == "allEventTypeFees") {
      let newEventTypeFee = [...this.allEventTypeFees];
      newEventTypeFee[index].isSelected = !newEventTypeFee[index].isSelected;
      this.allEventTypeFees = newEventTypeFee;
      let countE = this.getNumOfContestSelected(
        newEventTypeFee,
        "sponserCheck"
      );
      if (
        countE > 0 &&
        this.isSpectatorMode.mode &&
        this.isSpectatorMode.index > -1
      ) {
        let newAllEventTypeFees = [...this.allEventTypeFees];
        newAllEventTypeFees[this.isSpectatorMode.index].isSelected = true;
        this.allEventTypeFees = newAllEventTypeFees;

        let spectModeSwitch222 = { ...this.isSpectatorMode };
        spectModeSwitch222.action = true;
        this.isSpectatorMode = spectModeSwitch222;
      } else {
        if (
          this.isSpectatorMode.mode == true &&
          this.isSpectatorMode.index != index
        ) {
          console.log("action true");
          let newEventTypeFees = [...this.allEventTypeFees];
          newEventTypeFees[this.isSpectatorMode.index].isSelected = false;
          this.allEventTypeFees = newEventTypeFees;
        }
        let spectModeSwitch2 = { ...this.isSpectatorMode };
        spectModeSwitch2.action = false;
        this.isSpectatorMode = spectModeSwitch2;
      }
    }
    return this.createClone();
  };
  getNumOfContestSelected = (data, type = "") => {
    let count = 0;
    data.map((i) => {
      if (
        type == "sponserCheck" &&
        i.contestName.includes("Sponsor") &&
        i.isSelected
      ) {
        count++;
      } else if (type == "") {
        if (i.isSelected) {
          count++;
        }
      }
    });
    return count;
  };
  createClone = () => {
    return { ...this };
  };
  getTotal = (infoMode = false) => {
    let total = 0;
    let actualFees = 0;
    this.allContestTypeFees.map((cFees) => {
      let parseIntD = cFees.eventContestFeeCents / 100;
      if (cFees.isSelected) {
        total += parseIntD;
      }
      actualFees += parseIntD;
    });
    this.allEventTypeFees.map((eFees) => {
      let parseIntD = eFees.eventContestFeeCents / 100;
      if (eFees.isSelected) {
        total += parseIntD;
      }
      actualFees += parseIntD;
    });
    if (this.isSpectatorMode.mode && this.conditionCheck()) {
      if (this.allEventTypeFees[this.isSpectatorMode.index]?.isSelected) {
        let spectFee =
          this.allEventTypeFees[this.isSpectatorMode.index]
            .eventContestFeeCents / 100;
        total = total - spectFee;
      }
    }
    if (infoMode) {
      return {
        selectedTotalFees: total.toFixed(2),
        actualFees: actualFees.toFixed(2),
      };
    }
    if (total == 0) {
      return "$00.00";
    } else if (total > 0) {
      return `$${total.toFixed(2)}`;
    }
    return `$${total}`;
  };

  getFirebaseData = (userID, userEnteredContestID) => {
    let savedTuples = [];
    let saveModel = {
      contestID: 0,
      eventID: this.eventPropData.eventID,
      userContestPaidAmount: 0,
      userContestPaidStatus: "PAID",
      userContestParticipationType: "Player",
      userContestSignupDate: {},
      userEnteredContestID,
      userID,
      contestName: "",
      charityID:
        this.eventPropData.charityID == 0
          ? this.selectedCharityData.charityID
          : this.eventPropData.charityID,
    };
    this.allContestTypeFees.map((cFees) => {
      if (!cFees.isSelected) {
        return;
      }
      let modal = { ...saveModel };
      modal.contestName = cFees.contestName;
      modal.contestID = cFees.contestID;
      modal.userContestPaidAmount = cFees.eventContestFeeCents;
      modal.userContestSignupDate = new Date();
      savedTuples.push(modal);
    });
    this.allEventTypeFees.map((eFees) => {
      if (!eFees.isSelected) {
        return;
      }
      let modal = { ...saveModel };
      modal.contestName = eFees.contestName;
      modal.userContestParticipationType = eFees.contestName;
      modal.userContestPaidAmount = eFees.eventContestFeeCents;
      modal.userContestSignupDate = new Date();
      savedTuples.push(modal);
    });

    return savedTuples;
  };

  shouldRenderPayButton = () => {
    let isallContestTypeFees = this.allContestTypeFees.every(
      (i) => !i.isSelected
    );
    let isallEventTypeFees = this.allEventTypeFees.every((i) => !i.isSelected);
    if (isallContestTypeFees && isallEventTypeFees) {
      return false;
    }
    return true;
  };
  getPayButtonText = () => {
    let getTotal = this.getTotal(true).selectedTotalFees;
    if (getTotal == 0) {
      return "Sign Up";
    }
    return "Pay with Credit Card";
  };
  checkAtLeastOneSponserCheck = () => {
    let count = 0;
    this.allEventTypeFees.map((i) => {
      if (i.contestName.includes("Sponsor") && i.isSelected == true) {
        count++;
      }
    });
    console.log("SPONSOR_COUNT_CHECK_1 - ", count);
    return count;
  };
  conditionCheck = () => {
    if (this.getNumOfContestSelected(this.allContestTypeFees) > 0) {
      return true;
    } else {
      if (this.checkAtLeastOneSponserCheck() > 0) {
        return true;
      } else {
        return false;
      }
    }
  };
}

export default new FeesModel();
