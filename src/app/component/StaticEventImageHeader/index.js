import React from "react";
import { View, Text } from "react-native";

import { ImageView } from "@component";
import Styles from "./indexCss";

//Test https://miro.medium.com/max/2400/0*xMaFF2hSXpf_kIfG.jpg
const StaticEventImageHeader = (props) => {
  const {
    eventName = "Add Event Name",
    eventImageURI = "",
    date = "Add Date",
    charity = "Add Charity",
    containerStyle = {},
    renderCharityDropDown = false,
    CharityDropDownComponent,
  } = props;
  let renderDate = date;
  if (renderDate?.includes("Invalid")) {
    renderDate = null;
  }
  return (
    <View style={[Styles.rootContainer, containerStyle]}>
      <ImageView uri={eventImageURI} />
      <View style={Styles.rightContainer}>
        <Text style={Styles.eventNameStyle}>{eventName}</Text>
        <Text style={Styles.dateStyle}>{renderDate}</Text>
        {renderCharityDropDown == false ? (
          <Text style={Styles.charityTextStyle}>{`Charity: ${charity}`}</Text>
        ) : (
          <CharityDropDownComponent />
        )}
      </View>
    </View>
  );
};

export default StaticEventImageHeader;
