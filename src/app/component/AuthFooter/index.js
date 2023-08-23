import React, { memo, useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";

import { connect, useSelector } from "react-redux";
import { WebViewModal } from "@component";
import AboutUsScreen from "../../../screens/AboutUs";
import Styles from "./indexCss";

const FooterModal = [
  {
    title: "About Us",
    visible: false,
    PropKey: AboutUsScreen,
    renderComponent: true,
  },
  {
    title: "Privacy Policy",
    visible: false,
    propKey: "htmlPrivacyPolicy",
    renderComponent: false,
  },
  {
    title: "Terms and Condition",
    visible: false,
    propKey: "htmlTermsOfUse",
    renderComponent: false,
  },
];
const AuthFooter = (props) => {
  const appInfoState = useSelector((state) => state.appInfoData.appInfoData);

  let { containerStyle = {} } = props;
  const [footerModal, setFooterModal] = useState(FooterModal);
  //console.log('TEST_DEMO_5 - ', appInfoState['htmlPrivacyPolicy']);

  const switchWebViewModal = (index) => {
    let newFooterModal = [...footerModal];
    newFooterModal[index].visible = !newFooterModal[index].visible;
    setFooterModal(newFooterModal);
  };
  const SingleContent = (Content, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => switchWebViewModal(index)}
        style={Styles.contentTouchContainer}
      >
        <Text style={Styles.titleTextStyle}>{Content.title}</Text>
        {Object.keys(appInfoState || {}).length > 0 && (
          <WebViewModal
            renderComponent={Content.renderComponent}
            modalVisible={Content.visible}
            onClose={() => switchWebViewModal(index)}
            html={
              Content.renderComponent ? (
                <Content.PropKey hideTray={true} showFeedback={false} />
              ) : (
                appInfoState[Content.propKey] || ""
              )
            }
          />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={[Styles.footerContainer, containerStyle]}>
      {footerModal.map(SingleContent)}
    </View>
  );
};

export default connect()(AuthFooter);
