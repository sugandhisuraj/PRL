import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Phone(props) {
  return (
    <Svg
      width={14}
      height={14}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M13.222 9.73a8.872 8.872 0 01-2.776-.443.797.797 0 00-.793.187l-1.712 1.71A11.782 11.782 0 012.816 6.06l1.71-1.711a.78.78 0 00.195-.794A8.836 8.836 0 014.278.778.78.78 0 003.5 0H.778A.78.78 0 000 .778C0 8.08 5.919 14 13.222 14a.78.78 0 00.778-.778v-2.714a.78.78 0 00-.778-.778z"
        fill="#000"
      />
    </Svg>
  )
}

export default Phone
