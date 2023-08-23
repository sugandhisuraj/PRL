import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Calendar(props) {
  return (
    <Svg
      width={16}
      height={18}
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.4 1.587h-.8V0H12v1.587H4V0H2.4v1.587h-.8C.72 1.587 0 2.3 0 3.174v12.694c0 .873.72 1.586 1.6 1.586h12.8c.88 0 1.6-.713 1.6-1.586V3.174c0-.873-.72-1.587-1.6-1.587zm0 14.28H1.6V7.14h12.8v8.728zM1.6 5.555h12.8v-2.38H1.6v2.38z"
        fill="#fff"
      />
    </Svg>
  )
}

export default Calendar
