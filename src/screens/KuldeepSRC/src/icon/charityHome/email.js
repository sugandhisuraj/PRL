import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Email(props) {
  return (
    <Svg
      width={16}
      height={12}
      viewBox="0 0 16 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M14.4 0H1.6C.72 0 .008.675.008 1.5L0 10.5c0 .825.72 1.5 1.6 1.5h12.8c.88 0 1.6-.675 1.6-1.5v-9c0-.825-.72-1.5-1.6-1.5zm0 3L8 6.75 1.6 3V1.5L8 5.25l6.4-3.75V3z"
        fill="#000"
      />
    </Svg>
  )
}

export default Email
