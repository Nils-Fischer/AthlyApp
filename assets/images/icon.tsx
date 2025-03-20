import * as React from "react";
import Svg, { SvgProps, Path } from "react-native-svg";

const Icon = (props: SvgProps) => (
  <Svg width={725} height={750} fill="none" {...props}>
    <Path
      fill="#749B0C"
      d="M549.579 685 362.5 298 175.421 685H31.428L0 750h217l145-300 145 300h218l-31.428-65H549.579Z"
    />
    <Path
      fill="#749B0C"
      d="M662.65 621 362.5 0 104.4 534h.016l-31.422 65h-.01L62.35 621h71.071l120.61-249.499-.028-.058L362.5 147l76.045 157.31-.27.558L591.095 621h71.555Zm31.417 65h-.011L725 750l-30.933-64ZM0 750l30.944-64h-.01L0 750Z"
    />
    <Path fill="#749B0C" d="m362 299 .008.017-5.039 10.425-.008-.017L362 299Z" />
  </Svg>
);
export default Icon;
