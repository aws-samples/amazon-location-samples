// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
//  SPDX-License-Identifier: MIT-0

import React, { PureComponent } from "react";
import { CanvasOverlay } from "react-map-gl";

// longitude={devicePositionMetadata.Position[0]}
//           latitude={devicePositionMetadata.Position[1]}

export default class PolylineOverlay extends PureComponent {
  _redraw({ width, height, ctx, isDragging, project, unproject }) {
    const {
      points,
      color = "green",
      lineWidth = 3,
      renderWhileDragging = true,
    } = this.props;
    ctx.clearRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    if ((renderWhileDragging || !isDragging) && points) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.beginPath();
      points.forEach((point) => {
        const pixel = project([point.Position[0], point.Position[1]]);
        ctx.lineTo(pixel[0], pixel[1]);
      });
      ctx.stroke();
    }
  }

  render() {
    return <CanvasOverlay redraw={this._redraw.bind(this)} />;
  }
}
