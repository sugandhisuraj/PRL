import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Map(props) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.502 7.273a6.541 6.541 0 00-5.775-5.775V0H7.273v1.498a6.541 6.541 0 00-5.775 5.775H0v1.454h1.498a6.541 6.541 0 005.775 5.775V16h1.454v-1.498a6.541 6.541 0 005.775-5.775H16V7.273h-1.498zM8 5.09a2.908 2.908 0 100 5.818 2.908 2.908 0 100-5.818zM2.91 8a5.087 5.087 0 005.09 5.09A5.087 5.087 0 0013.092 8 5.087 5.087 0 008 2.91 5.087 5.087 0 002.909 8z"
        fill="#949AB1"
      />
    </Svg>
  )
}

export default Map