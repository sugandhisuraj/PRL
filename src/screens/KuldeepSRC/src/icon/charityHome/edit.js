import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Edit(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.287 0c-.278 0-.567.111-.778.322l-2.033 2.033 4.166 4.166 2.033-2.033a1.106 1.106 0 000-1.566l-2.6-2.6A1.091 1.091 0 0016.287 0zm-4 6.688L13.31 7.71 3.244 17.775H2.222v-1.022L12.287 6.688zM0 15.831L12.287 3.544l4.166 4.166L4.166 19.997H0v-4.166z"
        fill="#000"
      />
    </Svg>
  )
}

export default Edit
