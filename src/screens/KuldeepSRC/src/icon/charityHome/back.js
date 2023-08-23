import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Back(props) {
  return (
    <Svg
      width={12}
      height={18}
      viewBox="0 0 12 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12 15.885L4.583 9 12 2.115 9.717 0 0 9l9.717 9L12 15.885z"
        fill="#000"
      />
    </Svg>
  )
}

export default Back
