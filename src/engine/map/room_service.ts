// engine/map/room.ts
import type { EntityId } from "../entities/entity.svelte";
import type { EntityRepository } from "../entities/entity_repository.svelte";
import { none, some } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import type { RoomId } from "./room.svelte";
import type { RoomRepository } from "./room_repository.svelte";

export function move_entity_to_room(entity_id: EntityId, new_room_id: RoomId, room_repo: RoomRepository, entity_repo: EntityRepository): Result<void, string> {
    let new_room_res = room_repo.get_or_err(new_room_id);
    if (new_room_res.is_err()) return err(new_room_res.error);
    let new_room = new_room_res.unwrap();

    let entity_res = entity_repo.get_or_err(entity_id);
    if (entity_res.is_err()) return err(entity_res.error);
    let entity = entity_res.unwrap();

    // remove entity from previous room
    if (entity.room_id.is_some()) {
        let previous_room_res = room_repo.get_or_err(entity.room_id.value);
        if (previous_room_res.is_err()) return err(previous_room_res.error);
        let previous_room = previous_room_res.unwrap();

        // to avoid error if the entity is not in the room of his room_id
        if (previous_room.contains_entity(entity_id)) {
            let res = remove_entity_from_room(entity_id, entity.room_id.value, room_repo, entity_repo);
            if (res.is_err()) return res;
        }
    }

    new_room.add_entity(entity_id);
    entity.room_id = some(new_room_id);
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

export function remove_entity_from_room(entity_id: EntityId, room_id: RoomId, room_repo: RoomRepository, entity_repo: EntityRepository): Result<void, string> {
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
