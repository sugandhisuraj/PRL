import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Filter(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M.213 1.61C2.243 4.2 5.994 9 5.994 9v6c0 .55.453 1 1.006 1h2.01c.553 0 1.006-.45 1.006-1V9s3.74-4.8 5.771-7.39C16.3.95 15.827 0 14.993 0H1.007C.173 0-.3.95.213 1.61z"
        fill="#000"
      />
    </Svg>
  )
}

export default Filter
