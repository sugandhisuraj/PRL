class PaymentHostInformation {
  resData = {};

  currentProcessing = 0;
  activePaymentProcess = [];
  activePaymentHosts = [];
  activePaymentHostsKey = {};
  constructor(resData) {
    this.resData = resData;
  }

  initPaymentInfoProcess = () => {
    this.resData?.paymentConfiguration.map((paymentPre) => {
      const paymentDetailsMapper =
        PaymentHostInformation.PaymentOptions[paymentPre];
      const responsePaymentConfigData =
        this.resData[paymentDetailsMapper.configKey];
      if (paymentDetailsMapper && responsePaymentConfigData?.processingEnabled) {
        this.activePaymentHosts.push(paymentPre);
        this.activePaymentHostsKey = {
          ...this.activePaymentHostsKey,
          ...paymentDetailsMapper,
        };
        this.activePaymentProcess.push(
          Object.assign({}, paymentDetailsMapper, responsePaymentConfigData)
        );
      }
    });
  };
  getActivePaymentHosts = () => {
    return this.activePaymentHosts;
  };
  getActivePaymentHostsKey = () => {
    return this.activePaymentHostsKey;
  };
  getCurrentPaymentInfo = () => {
    return this.activePaymentProcess[this.currentProcessing];
  };
  nextPaymentProcessing = () => {
    if (this.activePaymentProcess.length - 1 == this.currentProcessing) {
      return;
    }
    this.currentProcessing++;
  };
  previousPaymentProcessing = () => {
    if (this.currentProcessing == 0) {
      return;
    }
    this.currentProcessing--;
  };
  static PaymentOptions = {
    Stripe: {
      configKey: "stripePaymentCredentials",
      isStripe: true,
    },
    Square: {
      configKey: "squarePaymentCredentials",
      isSquare: true,
    },
    Paypal: {
      configKey: "paypalPaymentCredentials",
      isPaypal: true,
    },
  };
}

export default PaymentHostInformation;
