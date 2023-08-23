

const SETTING_EDIT_FIELDS = {
    userName: '',
    userNickname: '',
    userCellPhone: '',
    userAvatar: '',
}
class SettingModal {

    editField = {};
    loading = false;
    userCol = {};
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

    init = (userCol) => {
        let editedFields = { ...SETTING_EDIT_FIELDS };
        editedFields.userName = userCol.userName;
        editedFields.userNickname = userCol.userNickname;
        editedFields.userCellPhone = userCol.userCellPhone;
        editedFields.userAvatar = userCol?.userAvatar;
        this.editField = { ...editedFields };
        this.userCol = {...userCol};
        return this.createClone();
    }
    updateEditFields = (key, value = '') => {
        let newEditFields = { ...this.editField };
        newEditFields[key] = value;
        this.editField = { ...newEditFields };
        return this.createClone();
    }
    saveToFirebase = () => {
        return {
            id: this.userCol.uid,
            data: {
                ...this.editField
            }
        }
    }
    shouldDisableUpdate = () => { 
        if(
            this.editField.userName != this.userCol.userName ||
            this.editField.userNickname != this.userCol.userNickname ||
            this.editField.userCellPhone != this.userCol.userCellPhone ||
            this.editField.userAvatar != this.userCol?.userAvatar 
        ) {
            return false;
        }else {
            return true;
        }
    }
}

export default new SettingModal();