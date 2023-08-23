import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Heart(props) {
  return (
    <Svg
      width={16}
      height={14}
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M8 14l-1.16-1.007C2.72 9.43 0 7.08 0 4.196 0 1.846 1.936 0 4.4 0 5.792 0 7.128.618 8 1.595 8.872.618 10.208 0 11.6 0 14.064 0 16 1.846 16 4.196c0 2.884-2.72 5.234-6.84 8.805L8 14z"
        fill="#949AB1"
      />
    </Svg>
  )
}

export default Heart
