import * as React from "react"
import Svg, { Path } from "react-native-svg"

function Upload(props) {
  return (
    <Svg
      width={25}
      height={25}
      viewBox="0 0 25 25"
      fill={props.fill?props.fill:"white"}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.429 0v3.571H25v2.381h-3.571v3.56s-2.37.012-2.381 0v-3.56h-3.572s.012-2.369 0-2.38h3.572V0h2.38zm-2.381 22.619H2.38V5.952h10.714v-2.38H2.381A2.388 2.388 0 000 5.951V22.62A2.388 2.388 0 002.381 25h16.667a2.388 2.388 0 002.38-2.381V11.905h-2.38v10.714zm-9.274-3.774l-2.334-2.81-3.273 4.203h13.095l-4.214-5.607-3.274 4.214z"
        fill={props.fill?props.fill:"white"}
      />
    </Svg>
  )
}

export default Upload
