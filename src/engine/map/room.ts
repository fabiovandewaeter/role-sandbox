// engine/map/room.ts
import type { EntityId } from "../entities/types";
import type { World } from "../types";
import { get_entity } from "../world";
import type { Room, RoomId } from "./types";

export function add_neighbor(room: Room, neighbor_id: RoomId) {
    if (!room.neighbors.includes(neighbor_id)) {
        room.neighbors.push(neighbor_id);
    }
}

export function remove_neighbor(room: Room, neighbor_id: RoomId): boolean {
    const index = room.neighbors.indexOf(neighbor_id);

    if (index !== -1) {
        room.neighbors.splice(index, 1);
        return true;
    }
    return false;
}

export function connect_rooms(world: World, room_a_id: RoomId, room_b_id: RoomId) {
    let room_a = world.rooms[room_a_id];
    add_neighbor(room_a, room_b_id);
    let room_b = world.rooms[room_b_id];
    add_neighbor(room_b, room_a_id);
}

/** throws error if room doesn't exist */
export function add_entity_to_room(world: World, entity_id: EntityId, room_id: RoomId) {
    let room = world.rooms[room_id];
    if (room == null) throw new Error(`Cannot spawn Entity in non existing room: ${room_id}`);

    room.entities.push(entity_id);
}

export function remove_entity_from_room(world: World, entity_id: EntityId) {
    let entity = get_entity(world, entity_id);

    let room_id = entity.room;
    if (room_id == null) throw new Error(`Entity doesn't have room: ${entity.id}`);

    let room = world.rooms[room_id];
    if (room == null) throw new Error(`Room doesn't exist: ${room_id}`);

    const index = room.entities.indexOf(entity_id);
    if (index !== -1) throw new Error(`Entity ${entity_id} not found in room ${room_id}`);

    room.entities.splice(index, 1);
    entity.room = undefined;
}
