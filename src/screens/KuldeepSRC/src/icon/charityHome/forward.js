import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Forward(props) {
  return (
    <Svg
    width={12}
    height={18}
      viewBox="0 0 13 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M0 2.585L8.035 11 0 19.415 2.474 22 13 11 2.474 0 0 2.585z"
        fill="#000"
      />
    </Svg>
  )
}

export default Forward
