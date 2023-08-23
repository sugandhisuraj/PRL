import { useState } from 'react';
import DocumentPicker from 'react-native-document-picker';
const UsePickDocument = () => {
  const [pickedDocument, setPickedDocument] = useState(null);
  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.plainText, DocumentPicker.types.pdf],
      });
      setPickedDocument(() => res);
      console.log("zzzzzz",
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );
      return res;
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        console.log("USER_CANCEL_IMAGE_PICKER")
      } else {
        throw err;
      }
    }
  }
  return {
    pickedDocument,
    pickDocument,
  }
}

export default UsePickDocument;