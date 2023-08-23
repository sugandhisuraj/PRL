import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

//Import Custom Components
import ContestDesc from "../ContestInfoDetail/ContestDesc";
import ContestDescSection from "../ContestInfoDetail/ContestDescSection";
import ContestEquipment from "../ContestInfoDetail/ContestEquipment";
import ContestGallery from "../ContestInfoDetail/ContestGallery";
import ContestRule from "../ContestInfoDetail/ContestRule";
import ContestScoring from "../ContestInfoDetail/ContestScoring";
import HeaderSection from "../ContestInfoDetail/HeaderSection";


const ContestInfo = (props) => {
  const [ContestDetails, setContestDetails] = useState([]);
  const [EventDetails, setEventDetails] = useState([]);
  useEffect(() => {
    setContestDetails(props.route.params.Detail);
    setEventDetails(props.route.params.EventDetail);
  }, [props.route.params]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps={"always"}
      style={styles.scrollView}
    >
      <HeaderSection navigation={props.navigation} />
      <ContestDesc Contest={ContestDetails} Event={EventDetails} />
      <ContestDescSection Contest={ContestDetails} Event={EventDetails} />
      <ContestRule Contest={ContestDetails} Event={EventDetails} />
      <ContestScoring Contest={ContestDetails} Event={EventDetails} />
      <ContestEquipment Contest={ContestDetails} Event={EventDetails} />
      <ContestGallery Contest={ContestDetails}/>
      <View style={styles.spacingView}/>
    </ScrollView>
  );
  
}
// export default class ContestInfo extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       ContestDetails: props.route.params.Detail,
//       EventDetails: props.route.params.EventDetail,
//     };
//   }

//   render() {
//     const { ContestDetails, EventDetails } = this.state;
//     return (
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentInsetAdjustmentBehavior="automatic"
//         style={styles.scrollView}
//       >
//         <HeaderSection navigation={this.props.navigation} />
//         <ContestDesc Contest={ContestDetails} Event={EventDetails} />
//         <ContestDescSection Contest={ContestDetails} Event={EventDetails} />
//         <ContestRule Contest={ContestDetails} Event={EventDetails} />
//         <ContestScoring Contest={ContestDetails} Event={EventDetails} />
//         <ContestEquipment Contest={ContestDetails} Event={EventDetails} />
//         <ContestGallery />
//       </ScrollView>
//     );
//   }
// }

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "#FFF",
  },
  spacingView: {
    marginVertical: 20
  }
});

export default ContestInfo;