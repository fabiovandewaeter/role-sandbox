// engine/world.ts
import { writable } from "svelte/store"
import type { World } from "../../engine/types"
import { create_default_world, spawn_unit } from "../../engine/world";
import { add_unit_to_level, spawn_structure } from "../../engine/map/level";

const initial_world = create_default_world();
const initial_level = initial_world.levels[1];

const UNIT_HEIGHT_REF = 40;

// Les personnages
const unit_id_1 = spawn_unit(initial_world, {
    name: "Rogue", pos: { x: 1, y: 1 }, max_stats: { hp: 30, mp: 9 }, scale: 1.0, shape: "sprite"
})
const unit_id_2 = spawn_unit(initial_world, {
    name: "Summon", pos: { x: 3, y: 2 }, max_stats: { hp: 20, mp: 3 }, scale: 1.0, shape: "sprite"
})

add_unit_to_level(initial_level, unit_id_1);
add_unit_to_level(initial_level, unit_id_2);

// Les structures (Anciennement Slimes)
spawn_structure(initial_level, {
    name: "Sommet",
    pos: { x: 5, y: 5 },
    shape: "cube",
    height: UNIT_HEIGHT_REF,
    walkable: false
})

spawn_structure(initial_level, {
    name: "Marche",
    pos: { x: 5, y: 6 },
    shape: "step",
    height: UNIT_HEIGHT_REF,
    walkable: false
})
spawn_structure(initial_level, {
    name: "Marche",
    pos: { x: 6, y: 5 },
    shape: "step",
    height: UNIT_HEIGHT_REF,
    walkable: false
})
spawn_structure(initial_level, {
    name: "Marche",
    pos: { x: 4, y: 5 },
    shape: "step",
    height: UNIT_HEIGHT_REF,
    walkable: false
})
spawn_structure(initial_level, {
    name: "Marche",
    pos: { x: 5, y: 4 },
    shape: "step",
    height: UNIT_HEIGHT_REF,
    walkable: false
})

export const world_store = writable<World>(initial_world)
