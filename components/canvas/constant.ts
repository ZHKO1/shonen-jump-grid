import type { CanvasGridConfig } from './types'
import { GridLineWidth, Height, PageMargin, Width } from '../comic/core/config'

export const CANVAS_WIDTH = Width
export const CANVAS_HEIGHT = Height

export const BORDER_WIDTH = GridLineWidth

export const LOGO_PAGE_HEIGHT = CANVAS_HEIGHT

export const LOGO_PAGE_GRIDS_CONFIG: CanvasGridConfig[] = [
  {
    type: 'rect',
    lt_x: 18,
    lt_y: 18,
    rb_x: 702,
    rb_y: 1062,
    id: 0,
    splitLine: [
      {
        x: 18,
        y: 150.46081239450646,
      },
      {
        x: 702,
        y: 150.46081239450646,
      },
    ],
    splitResult: [
      {
        type: 'rect',
        lt_x: 18,
        lt_y: 18,
        rb_x: 702,
        rb_y: 144.46081239450646,
        id: '0_0',
        splitLine: [
          {
            x: 257.440366505926,
            y: 18,
          },
          {
            x: 257.440366505926,
            y: 144.46081239450646,
          },
        ],
        splitResult: [
          {
            type: 'rect',
            lt_x: 18,
            lt_y: 18,
            rb_x: 251.44036650592602,
            rb_y: 144.46081239450646,
            id: '0_0_0',
          },
          {
            type: 'rect',
            lt_x: 263.440366505926,
            lt_y: 18,
            rb_x: 702,
            rb_y: 144.46081239450646,
            id: '0_0_1',
            splitLine: [
              {
                x: 546.328121015352,
                y: 18,
              },
              {
                x: 546.328121015352,
                y: 144.46081239450646,
              },
            ],
            splitResult: [
              {
                type: 'rect',
                lt_x: 263.440366505926,
                lt_y: 18,
                rb_x: 540.328121015352,
                rb_y: 144.46081239450646,
                id: '0_0_1_0',
              },
              {
                type: 'rect',
                lt_x: 552.328121015352,
                lt_y: 18,
                rb_x: 702,
                rb_y: 144.46081239450646,
                id: '0_0_1_1',
              },
            ],
            splitSpaceWidth: 12,
          },
        ],
        splitSpaceWidth: 12,
      },
      {
        type: 'rect',
        lt_x: 18,
        lt_y: 156.46081239450646,
        rb_x: 702,
        rb_y: 1062,
        id: '0_1',
        splitLine: [
          {
            x: 18,
            y: 390.17723296931587,
          },
          {
            x: 702,
            y: 390.17723296931587,
          },
        ],
        splitResult: [
          {
            type: 'rect',
            lt_x: 18,
            lt_y: 156.46081239450646,
            rb_x: 702,
            rb_y: 384.17723296931587,
            id: '0_1_0',
          },
          {
            type: 'rect',
            lt_x: 18,
            lt_y: 396.17723296931587,
            rb_x: 702,
            rb_y: 1062,
            id: '0_1_1',
            splitLine: [
              {
                x: 18,
                y: 538.9687019476362,
              },
              {
                x: 702,
                y: 538.9687019476362,
              },
            ],
            splitResult: [
              {
                type: 'rect',
                lt_x: 18,
                lt_y: 396.17723296931587,
                rb_x: 702,
                rb_y: 525.9687019476362,
                id: '0_1_1_0',
                splitLine: [
                  {
                    x: 199.3390178819046,
                    y: 396.17723296931587,
                  },
                  {
                    x: 199.3390178819046,
                    y: 525.9687019476362,
                  },
                ],
                splitResult: [
                  {
                    type: 'rect',
                    lt_x: 18,
                    lt_y: 396.17723296931587,
                    rb_x: 193.3390178819046,
                    rb_y: 525.9687019476362,
                    id: '0_1_1_0_0',
                  },
                  {
                    type: 'rect',
                    lt_x: 205.3390178819046,
                    lt_y: 396.17723296931587,
                    rb_x: 702,
                    rb_y: 525.9687019476362,
                    id: '0_1_1_0_1',
                    splitLine: [
                      {
                        x: 447.2859370336481,
                        y: 396.17723296931587,
                      },
                      {
                        x: 491.42190603864105,
                        y: 525.9687019476362,
                      },
                    ],
                    splitResult: [
                      {
                        type: 'poly',
                        path: [
                          {
                            x: 205.3390178819046,
                            y: 396.17723296931587,
                          },
                          {
                            x: 440.94851675653524,
                            y: 396.17723296931587,
                          },
                          {
                            x: 485.0844857615282,
                            y: 525.9687019476362,
                          },
                          {
                            x: 205.3390178819046,
                            y: 525.9687019476362,
                          },
                        ],
                        id: '0_1_1_0_1_0',
                      },
                      {
                        type: 'poly',
                        path: [
                          {
                            x: 453.62335731076104,
                            y: 396.17723296931587,
                          },
                          {
                            x: 702,
                            y: 396.17723296931587,
                          },
                          {
                            x: 702,
                            y: 525.9687019476362,
                          },
                          {
                            x: 497.7593263157539,
                            y: 525.9687019476362,
                          },
                        ],
                        id: '0_1_1_0_1_1',
                      },
                    ],
                    splitSpaceWidth: 12,
                  },
                ],
                splitSpaceWidth: 12,
              },
              {
                type: 'rect',
                lt_x: 18,
                lt_y: 551.9687019476362,
                rb_x: 702,
                rb_y: 1062,
                id: '0_1_1_1',
                splitLine: [
                  {
                    x: 529.0280559560127,
                    y: 551.9687019476362,
                  },
                  {
                    x: 529.0280559560127,
                    y: 1062,
                  },
                ],
                splitResult: [
                  {
                    type: 'rect',
                    lt_x: 18,
                    lt_y: 551.9687019476362,
                    rb_x: 523.0280559560127,
                    rb_y: 1062,
                    id: '0_1_1_1_0',
                    splitLine: [
                      {
                        x: 18,
                        y: 864.5097247450025,
                      },
                      {
                        x: 523.0280559560127,
                        y: 864.5097247450025,
                      },
                    ],
                    splitResult: [
                      {
                        type: 'rect',
                        lt_x: 18,
                        lt_y: 551.9687019476362,
                        rb_x: 523.0280559560127,
                        rb_y: 858.5097247450025,
                        id: '0_1_1_1_0_0',
                        splitLine: [
                          {
                            x: 191.98229641192802,
                            y: 551.9687019476362,
                          },
                          {
                            x: 317.14325441677335,
                            y: 858.5097247450025,
                          },
                        ],
                        splitResult: [
                          {
                            type: 'poly',
                            path: [
                              {
                                x: 18,
                                y: 551.9687019476362,
                              },
                              {
                                x: 185.50143652912436,
                                y: 551.9687019476362,
                              },
                              {
                                x: 310.6623945339697,
                                y: 858.5097247450025,
                              },
                              {
                                x: 18,
                                y: 858.5097247450025,
                              },
                            ],
                            id: '0_1_1_1_0_0_0',
                          },
                          {
                            type: 'poly',
                            path: [
                              {
                                x: 198.46315629473165,
                                y: 551.9687019476362,
                              },
                              {
                                x: 523.0280559560127,
                                y: 551.9687019476362,
                              },
                              {
                                x: 523.0280559560127,
                                y: 858.5097247450025,
                              },
                              {
                                x: 323.624114299577,
                                y: 858.5097247450025,
                              },
                            ],
                            id: '0_1_1_1_0_0_1',
                          },
                        ],
                        splitSpaceWidth: 12,
                      },
                      {
                        type: 'rect',
                        lt_x: 18,
                        lt_y: 870.5097247450025,
                        rb_x: 523.0280559560127,
                        rb_y: 1062,
                        id: '0_1_1_1_0_1',
                      },
                    ],
                    splitSpaceWidth: 12,
                  },
                  {
                    type: 'rect',
                    lt_x: 535.0280559560127,
                    lt_y: 551.9687019476362,
                    rb_x: 702,
                    rb_y: 1062,
                    id: '0_1_1_1_1',
                  },
                ],
                splitSpaceWidth: 12,
              },
            ],
            splitSpaceWidth: 26,
          },
        ],
        splitSpaceWidth: 12,
      },
    ],
    splitSpaceWidth: 12,
  },
]

export const BLANK_GRID_MARGIN: number = PageMargin

export const NEW_PAGE_GRID_CONFIG: CanvasGridConfig = {
  type: 'rect',
  lt_x: BLANK_GRID_MARGIN,
  lt_y: BLANK_GRID_MARGIN,
  rb_x: CANVAS_WIDTH - BLANK_GRID_MARGIN,
  rb_y: CANVAS_HEIGHT - BLANK_GRID_MARGIN,
  id: 0,
}
