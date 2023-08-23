const REGEX_10_DIGIT = /^\d{10}$/;
class ProfileModel {
  userName = "";
  userNickname = "";
  userCellPhone = "";
  userAvatar = "";

  userNameError = "";
  userNicknameError = "";
  userCellPhoneError = "";

  saveToFirebase = () => {
    return {
      userName: this.userName,
      userNickname: this.userNickname,
      userCellPhone: this.userCellPhone,
      userAvatar: this.userAvatar,
    };
  };
  isDisabled = () => {
    return (
      this.userName.length > 0 &&
      this.userNickname.length > 0 && 
      this.userCellPhone.length > 9 &&
      this.userCellPhone.length < 11 &&
      this.userAvatar.length > 0
    );
  };
  reset = () => {
    this.userName = "";
    this.userNickname = "";
    this.userCellPhone = "";
    this.userAvatar = "";

    this.userNameError = "";
    this.userNicknameError = "";
    this.userCellPhoneError = "";
    return this.createClone();
  };
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
  validateForm = () => {
    let result = { isValidate: true, message: '' };
    if (this.userName.length == 0) {
      result.isValidate = false;
      result.message = 'Enter Your Name';
    }
    else if (this.userNickname.length == 0) {
      result.isValidate = false;
      result.message = 'Enter Your Nick Name';
    } else if (this.userCellPhone.length == 0) {
      result.isValidate = false;
      result.message = 'Enter Your Cell Phone Number';
    } else if (!REGEX_10_DIGIT.test(this.userCellPhone)) {
      result.isValidate = false;
      result.message = 'Enter Valid Cell Phone Number';
    } else if (this.userAvatar.length == 0) {
      result.isValidate = false;
      result.message = 'Select Avatar';
    }
    return result;

  }
}
export default new ProfileModel();
