import React from 'react';

export default function Flow({ flow: { x0, y0, x1, y1, f } }) {
  let d = `M ${x0} ${y0}
        C ${x0},${y1 + f} ${x1},${y0 - f} ${x1},${y1}`;
  if (y1 < y0 && x1 > x0) {
    //左右
    d = `M ${x0} ${y0}
        C  ${x1 + 7 * f},${y0 - 2 * f} ${x0 - 7 * f},${y1 + 2 * f} ${x1},${y1}`;
  } else if (y1 < y0 && x1 < x0) {
    d = `M ${x0} ${y0}
        C  ${x1 - 3 * f},${y0 - 2 * f} ${x0 + 3 * f},${y1 + 2 * f} ${x1},${y1}`;
  }

  return (
    <>
      <path strokeWidth="2" stroke="#AAB7C4" fill="none" d={d} style={{ pointerEvents: 'all' }} />
      <path
        className="topology-line-end-triangle"
        fill="#AAB7C4"
        stroke="none"
        data-type="end"
        d={`M ${x1} ${y1} 
        l 4 0
        l -4 8
        l -4 -8
        Z`}
        style={{ pointerEvents: 'all' }}
      />
    </>
  );
}
