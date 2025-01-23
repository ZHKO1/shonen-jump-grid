import { Grid, GridConfig } from "./grid";

const grids: GridConfig[] = [
  {
    "type": "poly",
    "path": [
      { x: 18, y: 18 },
      { x: 251, y: 18 },
      { x: 136, y: 521 },
      { x: 18, y: 521 },
    ]
  },
  {
    "type": "poly",
    "path": [
      { x: 261, y: 18 },
      { x: 601, y: 18 },
      { x: 486, y: 521 },
      { x: 146, y: 521 },
    ]
  },
  {
    "type": "poly",
    "path": [
      { x: 611, y: 18 },
      { x: 703, y: 18 },
      { x: 703, y: 248 },
      { x: 559, y: 248 },
    ]
  },
  {
    "type": "poly",
    "path": [
      { x: 554, y: 268 },
      { x: 726, y: 268 },
      { x: 726, y: 521 },
      { x: 498, y: 521 },
    ]
  },
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 556,
    "rb_x": 579,
    "rb_y": 1063
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 556,
    "rb_x": 703,
    "rb_y": 747
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 757,
    "rb_x": 703,
    "rb_y": 895
  },
  {
    "type": "rect",
    "lt_x": 590,
    "lt_y": 905,
    "rb_x": 703,
    "rb_y": 1063
  }
]

/*
const grids: GridConfig[] = [
  {
    "type": "rect",
    "lt_x": 18,
    "lt_y": 9,
    "rb_x": 703,
    "rb_y": 519
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 541 },
      { x: 354, y: 541 },
      { x: 354, y: 779 },
      { x: 18, y: 692 },
    ]
  },
  {
    "type": "poly",
    "path": [
      { x: 18, y: 702 },
      { x: 354, y: 789 },
      { x: 354, y: 884 },
      { x: 18, y: 884 },
    ]
  },
  {
    "type": "rect",
    "lt_x": 365,
    "lt_y": 541,
    "rb_x": 703,
    "rb_y": 884
  }  
]
*/

export default function Canvas() {
  return (
    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-black">
      <div className="canvas-content w-[720px] h-full bg-gray-100 relative overflow-hidden after:absolute after:border-2 after:top-0 after:left-0 after:right-0 after:bottom-0 after:border-gray-400">
        {grids.map((grid, index) => (<Grid grid={grid} key={index} />))}
      </div>
    </div>
  );
}
