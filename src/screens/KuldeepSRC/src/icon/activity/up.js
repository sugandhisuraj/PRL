import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Up(props) {
  return (
    <Svg
      width={12}
      height={7}
      viewBox="0 0 12 7"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M6 0L0 5.668 1.41 7 6 2.673 10.59 7 12 5.668 6 0z"
        fill={props.fill?props.fill:"#949AB1"}
      />
    </Svg>
  )
}

export default Up