// engine/map/room.ts
import type { EntityId } from "../entities/entity";
import type { EntityRepository } from "../entities/entity_repository";
import { none, some } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import type { RoomId } from "./room";
import type { RoomRepository } from "./room_repository";

export function move_entity_to_room(entity_id: EntityId, room_id: RoomId, room_repo: RoomRepository, entity_repo: EntityRepository): Result<void, string> {
    let room_res = room_repo.get_or_err(room_id);
    if (room_res.is_err()) return err(room_res.error);
    let room = room_res.unwrap();

    let entity_res = entity_repo.get_or_err(entity_id);
    if (entity_res.is_err()) return err(entity_res.error);
    let entity = entity_res.unwrap();

    room.remove_entity(entity_id);
    entity.room_id = some(room_id);
    return ok(undefined);
}

export function connect_rooms(room_a_id: RoomId, room_b_id: RoomId, room_repo: RoomRepository): Result<void, string> {
    let room_a_res = room_repo.get_or_err(room_a_id);
    if (room_a_res.is_err()) return err(room_a_res.error);
    let room_a = room_a_res.unwrap();

    let room_b_res = room_repo.get_or_err(room_b_id);
    if (room_b_res.is_err()) return err(room_b_res.error);
    let room_b = room_b_res.unwrap();

    room_a.add_neighbor(room_b_id);
    room_b.add_neighbor(room_a_id);
    return ok(undefined);
}

export function remove_entity_from_room(entity_id: EntityId, room_id: RoomId, entity_repo: EntityRepository, room_repo: RoomRepository): Result<void, string> {
    let entity_res = entity_repo.get_or_err(entity_id);
    if (entity_res.is_err()) return err(entity_res.error);
    let entity = entity_res.unwrap();

    let room_res = room_repo.get_or_err(room_id);
    if (room_res.is_err()) return err(room_res.error);
    let room = room_res.unwrap();

    let res = room.remove_entity(entity_id);
    if (res.is_err()) return res;

    entity.room_id = none;
    return ok(undefined);
}
