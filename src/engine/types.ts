// engine/types.ts
export type Coord = { x: number; y: number }

export type GameState =
    | ExploreState
export type ExploreState = { mode: "explore" }
