import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Menu(props) {
  return (
    <Svg
      width={30}
      height={20}
      viewBox="0 0 30 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 3.333V0h30v3.333H0zm0 8.334h30V8.333H0v3.334zM0 20h30v-3.333H0V20z"
        fill="#000"
      />
    </Svg>
  )
}

export default Menu
