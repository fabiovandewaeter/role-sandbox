// engine/world.ts
import { create_empty_level } from "./map/level";
import type { World, LevelId, Level, Unit, UnitId } from "./types";

export function create_default_world(): World {
    let world: World = {
        levels: {},
        units: {},
        combats: {},
        state: {
            mode: "explore",
            level_id: 1,
        },
        next_unit_id: 1,
        next_level_id: 1,
        next_combat_id: 1,
    };

    // spawn level
    const id: LevelId = world.next_level_id++;
    const level = create_empty_level(id);
    world.levels[id] = level;

    return world;
}

export function spawn_unit(world: World, unit_partial: Omit<Unit, "id">): UnitId {
    const id: UnitId = world.next_unit_id++;
    const unit: Unit = { id, ...unit_partial };
    world.units[id] = unit;
    return id;
}

export function delete_unit(world: World, unit_id: UnitId) {
    delete world.units[unit_id];
}

export function get_active_level(world: World): Level {
    const level_id = world.state.level_id;
    return world.levels[level_id];
}

export function get_units_array(world: World) {
    return Object.values(world.units)
}
