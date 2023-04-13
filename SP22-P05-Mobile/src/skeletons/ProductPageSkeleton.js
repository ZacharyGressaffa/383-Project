import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"

const PPSkeleton = (props) => (
  <ContentLoader 
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#808080"
    foregroundColor="#ecebeb"
    {...props}
  >
    <Rect x="80" y="5" rx="3" ry="3" width="240" height="27" /> 
    <Rect x="79" y="42" rx="3" ry="3" width="240" height="19" /> 
    <Rect x="47" y="69" rx="3" ry="3" width="299" height="50" />
  </ContentLoader>
)

export default PPSkeleton

