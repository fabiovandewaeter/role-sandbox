// engine/map/room.ts
import type { EntityId } from "../entities/entity";
import { err, ok, type Result } from "../utils/result";
import type { World } from "../world";
import type { Room, RoomId } from "./room";
import type { RoomRepository } from "./room_repository";

export function move_entity(room_repo: RoomRepository, entity_id: EntityId, dest_id: RoomId): Result<void, string> {
    let room_opt = room_repo.get(dest_id);
    if (is_)
        if (world.rooms[destination] == null) return err(``);
    let entity = world.entities[entity_id];
    if (entity == null) return false;

    remove_entity_from_room(world, entity_id);
    entity.room = destination;
    return ok(undefined);
}

export function connect_rooms(room_repo: RoomRepository, room_a_id: RoomId, room_b_id: RoomId) {
    let room_a = room_repo.get[room_a_id];
    room_a.add_neighbor(room_b_id);
    let room_b = room_repo.get[room_b_id];
    room_b.add_neighbor(room_a_id);
}

/** throws error if room doesn't exist */
export function add_entity_to_room(entity_id: EntityId, room_repo: RoomRepository, room_id: RoomId) {
    let room = world.rooms[room_id];
    if (room == null) throw new Error(`Cannot spawn Entity in non existing room: ${room_id}`);

    room.entities.push(entity_id);
}

export function remove_entity_from_room(world: World, entity_id: EntityId): Result<void, string> {
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
