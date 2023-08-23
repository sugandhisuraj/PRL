import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Union(props) {
  return (
    <Svg
      width={8}
      height={11}
      viewBox="0 0 8 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.155 3.645c.187-.13.479.131.512.433.047.435.281.828.594 1.132C1.962 3.105 2.616.832 4.687.023c.346-.135.69.35.484.664-.511.78.052 1.825.44 2.535.283.517.663.952 1.043 1.388.232.266.464.532.675.817.477.647.743 1.346.654 2.177a4.215 4.215 0 01-.922 2.19c-.934 1.147-2.62 1.402-3.956 1.073C1.734 10.531.428 9.425.139 7.922c-.132-.683-.21-1.385-.05-2.068.178-.761.556-1.817 1.066-2.209z"
        fill="#000"
      />
    </Svg>
  )
}

export default Union
