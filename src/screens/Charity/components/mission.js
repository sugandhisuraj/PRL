import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextField } from "../../KuldeepSRC/src/components";
import { Heading } from "./heading";
import { COLOR } from "../../KuldeepSRC/src/utils";
import { transformFirebaseValues } from "@utils";
import { charitiesCollection } from "../../../firebase";
const Mission = ({ edit, text, value, onChangeText }) => {
  const [charityArray, setCharityArray] = useState(null);
  const loadProfileData = async () => {
    const charitiesData = await charitiesCollection.get();
    let charityData = transformFirebaseValues(charitiesData, "charityID");
    setCharityArray(charityData);
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  return (
    <View>
      <Heading backgroundColor={COLOR.LIGHT_YELLOW} text={"Mission"} />
      <View style={styles.metaContainer}>
        {!edit ? (
          <Text style={styles.name}>{text}</Text>
        ) : (
          <TextField
            placeholder={value == null ? text : value}
            onChangeText={onChangeText}
            value={value}
          />
        )}
      </View>
    </View>
  );
};
export default Mission;

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    lineHeight: 22,
    color: COLOR.BLACK,
  },
  container: {
    height: 35,
    width: "100%",
    backgroundColor: COLOR.LIGHT_YELLOW,
    marginTop: 20,
    justifyContent: "center",
    paddingLeft: 20,
  },
  header: { fontWeight: "bold", fontSize: 16, lineHeight: 19 },
  metaContainer: { minHeight: 66, backgroundColor: COLOR.WHITE, padding: 10, },
  text: { fontSize: 16, lineHeight: 19 },
});
