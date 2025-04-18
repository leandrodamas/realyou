
import React, { forwardRef } from "react";

const CaptureCanvas = forwardRef<HTMLCanvasElement>((props, ref) => {
  return <canvas ref={ref} className="hidden" width="640" height="480" />;
});

CaptureCanvas.displayName = "CaptureCanvas";

export default CaptureCanvas;
