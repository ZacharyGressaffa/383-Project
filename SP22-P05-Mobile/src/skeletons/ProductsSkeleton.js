import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#808080"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="0" y="-7" rx="3" ry="3" width="410" height="188" />
  </ContentLoader>
)

export default MyLoader

