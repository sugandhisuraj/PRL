import * as React from "react"
import Svg, { Path } from "react-native-svg"

function RightArrow(props) {
  return (
    <Svg
      width={11}
      height={16}
      viewBox="0 0 11 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M0 1.88L6.799 8 0 14.12 2.093 16 11 8 2.093 0 0 1.88z"
        fill="#000"
      />
    </Svg>
  )
}

export default RightArrow
