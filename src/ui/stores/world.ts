// engine/world.ts
import { writable } from "svelte/store"
import type { World } from "../../engine/types"
import { create_default_world, spawn_entity, spawn_player, spawn_room } from "../../engine/world";
import { add_entity_to_room, connect_rooms } from "../../engine/map/room";

const initial_world = create_default_world();

// rooms
const room_a_id = spawn_room(initial_world, {
    name: "Room A",
    entities: [],
    neighbors: []
});
const room_b_id = spawn_room(initial_world, {
    name: "Room B",
    entities: [],
    neighbors: []
});
connect_rooms(initial_world, room_a_id, room_b_id);

// entities
const player_id = spawn_player(initial_world, {
    name: "Player",
    room: room_a_id,
});
const unit_2_id = spawn_entity(initial_world, {
    name: "Summon",
    room: room_a_id,
});
add_entity_to_room(initial_world, player_id, room_a_id);
add_entity_to_room(initial_world, unit_2_id, room_a_id);

export const world_store = writable<World>(initial_world)
