import React, { Fragment, useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

//Import Custom Components
import HeaderSection from "../ContestInfoDetail/HeaderSection";
import ContestDesc from "../ContestInfoDetail/ContestDesc";
import ContestDescSection from "../ContestInfoDetail/ContestDescSection";
import ContestRule from "../ContestInfoDetail/ContestRule";
import ContestScoring from "../ContestInfoDetail/ContestScoring";
import ContestEquipment from "../ContestInfoDetail/ContestEquipment";
import ContestGallery from "../ContestInfoDetail/ContestGallery";
import ContestInfoModel from './contestInfo.model';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Root } from '@component';
import EditContestScreen from './indexEdit';
import {
    contestsCollection,
    contestScoringTypesCollection
} from '../../firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector, useDispatch, connect } from 'react-redux';

const ContestInfo = (props) => {
    const {
        shouldEdit = false
    } = props.route.params;
    const [contestIModel, setContestIModel] = useState(() => ContestInfoModel);
    var { firebaseAllCollectionData, auth } = useSelector(s => s);
    useEffect(() => {
        (async () => {
            let contestDetails = props.route.params.ContestDetails;
            let eventDetails = props.route.params.EventDetails;
            // console.log('----------------ContestInfoScreen------------------');
            // console.log('CONTEST_DETAILS_1 - ', JSON.stringify(contestDetails));
            // console.log('EVENT_DETAILS_1 - ', JSON.stringify(eventDetails));
            // console.log('----------------ContestInfoScreen------------------');
            let allBracketTypeData = [ ...firebaseAllCollectionData.firebaseCollectionData.contestBracketTypesData];
            let contestDet = await contestsCollection.doc(contestDetails.id).get();
            const contestScoringTypes = await contestScoringTypesCollection.get();
            let transContest = { ...contestDet.data(), id: contestDet.id };
            setContestIModel(contestIModel.init(
                transContest, 
                eventDetails,
                allBracketTypeData,
                contestScoringTypes));
        })();
    }, [props.route.params]);
    return (
        <Root>
            <KeyboardAwareScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps={"always"}
                style={styles.scrollView}
            >
                <Spinner visible={contestIModel.loading} />
                {
                    contestIModel.mode == 0 ?
                        !contestIModel.loading ?
                            <Fragment>
                                <HeaderSection
                                    shouldEdit={shouldEdit}
                                    onContestEdit={() => {
                                        setContestIModel(contestIModel.update('mode', 1));
                                    }}
                                    navigation={props.navigation} />
                                <ContestDesc Contest={contestIModel.ContestDetails} Event={contestIModel.EventDetails} />
                                <ContestDescSection     
                                    contestBracketTypes={contestIModel.allBracketTypeData}
                                    Contest={contestIModel.ContestDetails} 
                                    Event={contestIModel.EventDetails} />
                                <ContestRule Contest={contestIModel.ContestDetails} Event={contestIModel.EventDetails} />
                                <ContestScoring Contest={contestIModel.ContestDetails} Event={contestIModel.EventDetails} />
                                <ContestEquipment Contest={contestIModel.ContestDetails} Event={contestIModel.EventDetails} />
                                <ContestGallery Contest={contestIModel.ContestDetails} />
                            </Fragment> : null :
                        <EditContestScreen
                            contestIModel={contestIModel}
                            setContestIModel={setContestIModel}
                        />
                }
                <View style={styles.spacingView} />
            </KeyboardAwareScrollView>
        </Root>
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

export default connect()(ContestInfo);