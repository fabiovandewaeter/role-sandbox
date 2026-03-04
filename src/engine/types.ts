// engine/types.ts
import type { Combat, CombatId } from "./combat_types";

export type Coord = { x: number; y: number }
export type UnitId = number
export type StructureId = number
export type LevelId = number

export type UnitStats = {
    hp: number,
    mp: number // mouvement points
}

export type Unit = {
    id: UnitId
    name: string
    pos: Coord,
    max_stats: UnitStats,
    scale: number,
    shape: "sprite"
}

export type Structure = {
    id: StructureId,
    name: string,
    pos: Coord,
    shape: string, // "cube", "wedge-nw", etc.
    height: number,
    walkable: boolean
}

export type Tile = {
    x: number,
    y: number,
    terrain?: string,
}

export type Board = {
    width: number,
    height: number,
    tiles: Tile[],
}

// can be in the open world or a combat room
export type Level = {
    id: LevelId,
    board: Board,
    units: UnitId[],
    structures: Record<StructureId, Structure>,
    next_structure_id: number,
}

export type ExploreState = { mode: "explore", level_id: LevelId }
export type CombatState = { mode: "combat", combat_id: CombatId, level_id: LevelId, origin_level_id: LevelId }
export type GameState =
    | ExploreState
    | CombatState

export type World = {
    levels: Record<LevelId, Level>,
    units: Record<UnitId, Unit>,
    combats: Record<CombatId, Combat>,
    // non_combat_current_level: LevelId, // used outside battle when free roam, DOES NOT contains the current combat level
    // active_combat?: CombatId, // if present, contains the LevelId of the combat level
    state: GameState,
    next_unit_id: number,
    next_level_id: LevelId
    next_combat_id: CombatId
}
