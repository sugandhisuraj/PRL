import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Search(props) {
  return (
    <Svg
      width={19}
      height={19}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        d="M12.435 11.063h-.723l-.256-.247a5.92 5.92 0 001.437-3.87 5.946 5.946 0 10-5.947 5.947 5.92 5.92 0 003.87-1.437l.247.256v.723L15.637 17 17 15.637l-4.565-4.574z"
        stroke="#949AB1"
        strokeWidth={1.5}
      />
    </Svg>
  )
}

export default Search
