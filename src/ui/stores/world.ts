// ui/stores/world.ts
import { writable } from "svelte/store"
import { connect_rooms } from "../../engine/map/room_service";
import { World } from "../../engine/world";

const initial_world = new World();

// rooms
const room_a_id = initial_world.spawn_room("Room A");
const room_b_id = initial_world.spawn_room("Room B");
initial_world.connect_rooms(room_a_id, room_b_id);

// entities
const player_id = initial_world.spawn_player("Player", room_a_id).unwrap();
const unit_2_id = initial_world.spawn_entity("Summon", room_a_id).unwrap();
initial_world.move_entity_to_room(player_id, room_a_id);
initial_world.move_entity_to_room(unit_2_id, room_a_id);

export const world_store = writable<World>(initial_world)
