import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Trophy(props) {
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
        d="M14.222 1.778h-1.778V0H3.556v1.778H1.778C.8 1.778 0 2.578 0 3.556v.888C0 6.711 1.707 8.56 3.902 8.836a4.453 4.453 0 003.21 2.63v2.756H3.555V16h8.888v-1.778H8.89v-2.755a4.453 4.453 0 003.209-2.631C14.293 8.56 16 6.71 16 4.444v-.888c0-.978-.8-1.778-1.778-1.778zM1.778 4.444v-.888h1.778V6.95C2.524 6.578 1.778 5.6 1.778 4.444zm12.444 0c0 1.156-.746 2.134-1.778 2.507V3.556h1.778v.888z"
        fill={props.fill?props.fill:"#949AB1"}
      />
    </Svg>
  )
}

export default Trophy