// ui/states/world_state.svelte.ts
import { World } from "../../engine/world.svelte";

const world = new World();

// rooms
const room_a_id = world.spawn_room("Room A");
const room_b_id = world.spawn_room("Room B");
world.connect_rooms(room_a_id, room_b_id);

// entities
world.spawn_player("Player", room_a_id).unwrap();
world.spawn_entity("Summon", room_a_id).unwrap();

export { world };
