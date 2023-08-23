module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      [
        "module:metro-react-native-babel-preset",
        {
          unstable_disableES6Transforms: true,
        },
      ],
    ],
    // presets: [
    //   'babel-preset-expo',
    //   'module:metro-react-native-babel-preset'
    // ],
    plugins: [
      [
        require("@babel/plugin-proposal-decorators").default,
        {
          legacy: true,
        },
      ],
    ],
  };
};

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     [
//       require('@babel/plugin-proposal-decorators').default,
//       {
//         legacy: true,
//       },
//     ],
//   ],
// };
