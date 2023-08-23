import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Music(props) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.333 9.378V0h5.334v3.556H7.11v8.888A3.555 3.555 0 013.556 16 3.555 3.555 0 010 12.444 3.555 3.555 0 013.556 8.89c.648 0 1.253.187 1.777.489zm-3.555 3.066c0 .978.8 1.778 1.778 1.778.977 0 1.777-.8 1.777-1.778 0-.977-.8-1.777-1.777-1.777-.978 0-1.778.8-1.778 1.777z"
        fill="#949AB1"
      />
    </Svg>
  )
}

export default Music
