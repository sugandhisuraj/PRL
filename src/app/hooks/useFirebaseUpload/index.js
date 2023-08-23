import {
    firebase,
    firebaseStorageRef
} from '../../../firebase';
//'@PRLFirebase';


const useFirebaseUpload = () => {

    var convertToBlob = async (uri, basePath = "") => {
        try {
            const response = await fetch(uri);
            const blob = await response.blob();
            let getExtArr = [...uri.split('.')];
            const fileName = `file_${new Date().getTime()}.${getExtArr[getExtArr.length - 1]}`;
            return Promise.resolve({
                blob,
                path: `${basePath}${fileName}`
            });
        } catch (error) {
            console.log("ERROR_WHILE_CONVERTING_BLOB - ", error);
            return Promise.reject(error);
        }
    }
    var uploadBlobToFirebase = async ({blob, path}) => {
        return new Promise((resolve, reject) => {
            var imageUploadRef = firebaseStorageRef.child(path);
            var uploadTask = imageUploadRef.put(blob);
            uploadTask.on('state_changed', function (snapshot) {
                //console.log("SNAPSHOT - ", snapshot);
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            }, function (error) {
                return reject(error);
            }, function () {
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log(`${path} avialable at - `, downloadURL);
                    return resolve(downloadURL);
                });
            });
        });
    }

    return {
        convertToBlob,
        uploadBlobToFirebase
    }
}


export default useFirebaseUpload;