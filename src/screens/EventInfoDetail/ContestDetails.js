import React, { Fragment } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

//Import Vector Icons
import Antdesign from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import Entypo from "react-native-vector-icons/Entypo";

//Load Vector Icons
Antdesign.loadFont();
Feather.loadFont();
Entypo.loadFont();

class ContestDetails extends React.Component {
  render() {
    return (
      <Fragment>
        <View
          style={{
            backgroundColor: "#0B214D",
            height: 32,
            justifyContent: "space-between",
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20
          }}
        >
          <Text
            style={{
              color: "#FFF",
              fontSize: 16,
              lineHeight: 19,
              fontWeight: "bold",

            }}
          >
            Contests
          </Text>
          <View style={{ flexDirection: 'row' }}>
            {
              this.props.shouldEdit && <Entypo
                name={'plus'}
                color="#FFF"
                size={28}
                onPress={this.props.onAddContest}
              />
            }

            <Feather
              name={this.props.icon == true ? "chevron-down" : "chevron-up"}
              color="#FFF"
              size={28}
              onPress={this.props.onClose}
              style={{ marginLeft: 10 }}
            />
          </View>
        </View>
        { !this.props.icon ? <View >
          {this.props.ContestData.map((SingleContest, Contestindex, arrLength) => {
            return (
              <>
                <TouchableOpacity
                  key={Contestindex}
                  onPress={() => {
                    this.props.navigation.navigate("ContestInfoScreen",
                      {
                        ContestDetails: SingleContest,
                        EventDetails: this.props.data,
                        shouldEdit: this.props.shouldEdit
                      }
                    );
                  }}
                >
                  <View style={{ flexDirection: "row", margin: 15 }}>
                    <Text
                      style={{ fontSize: 16, lineHeight: 19, paddingRight: 15, color: "#000" }}
                    >
                      {SingleContest.contestName}
                    </Text>
                    <Antdesign name="right" size={20} />
                  </View>
                </TouchableOpacity>
                {
                  arrLength.length - 1 > Contestindex && <View
                    style={{
                      borderBottomWidth: 1,
                      backgroundColor: "#000",
                      marginVertical: 1,
                    }}
                  />
                }
              </>
            );
          })}
        </View> : null}
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  eventDetailBoldText: {
    fontSize: 18,
    lineHeight: 22,
    fontWeight: "bold",
  },
});

export default ContestDetails;
