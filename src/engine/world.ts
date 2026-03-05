// engine/world.ts
import { EntityRepository } from "./entities/entity_repository";
import type { Entity, EntityId } from "./entities/types";
import { add_entity_to_room, remove_entity_from_room } from "./map/room";
import { RoomRepository } from "./map/room_repository";
import type { Room, RoomId } from "./map/types";
import { err, ok, type Result } from "./utils/result";
import type { GameState } from "./types";
import { is_none, none, type Opt } from "./utils/option";

export class World {
    private state: GameState;
    private player: Opt<EntityId> = none;
    private readonly entity_repo: EntityRepository = new EntityRepository();
    private readonly room_repo: RoomRepository = new RoomRepository();

    constructor() { this.state = { mode: "explore" } }

    /** spawners */
    /** ======== */
    /** spawn entity but fail if assignated room doesn't exist */
    spawn_entity(partial: Omit<Entity, "id">): Result<EntityId, string> {
        let opt_room_id = partial.room;
        if (is_none(opt_room_id)) return err("Entity need a Room to spawn");
        let opt_room = this.room_repo.get(opt_room_id.value);
        if (is_none(opt_room)) return err(`Entity need an existing Room to spawn but room doesn't exist: ${opt_room_id.value}`);

        if (this.room_repo)
            if (entity_partial.room == null || world.rooms[entity_partial.room] == null) {
                return err(`Cannot spawn Entity in non existing room`);
            }
        const id: EntityId = world.next_entity_id++;
        const entity: Entity = { id, ...entity_partial };
        world.entities[id] = entity;
        add_entity_to_room(world, id, entity.room);
        return ok(id);
    }

/** spawn entity but fail if assignated room doesn't exist */
export function spawn_player(world: World, entity_partial: Omit<Entity, "id">): EntityId {
    let id = spawn_entity(world, entity_partial);
    set_player(world, id);
    return id;
}

export function spawn_room(world: World, room_partial: Omit<Room, "id">): RoomId {
    const id: RoomId = world.next_room_id++;
    const room: Room = { id, ...room_partial };
    world.rooms[id] = room;
    return id;
}

/** setters */
/** ======= */
/** change current player and returns the id of the previous player if it exists */
export function set_player(world: World, entity_id: EntityId): EntityId | undefined {
    let previous_player_id = world.player;
    if (previous_player_id) {
        console.log(`Player changed : ${previous_player_id} => ${entity_id}`);
    }
    world.player = entity_id;
    return previous_player_id;
}

/** deleters */
/** ======== */

/** getters */
/** ======= */
export function get_entities(world: World): Entity[] {
    return Object.values(world.entities)
}

export function get_rooms(world: World): Room[] {
    return Object.values(world.rooms)
}

/** can throw an error */
export function get_entity(world: World, id: EntityId): Entity {
    let entity = world.entities[id];
    if (entity == null) throw new Error(`Entity doesn't exist: ${id}`);
    return entity;
}
/** can throw an error */
export function get_room(world: World, id: RoomId): Room {
    let room = world.rooms[id];
    if (room == null) throw new Error(`Room doesn't exist: ${id}`);
    return room;
}

/** others */
/** ====== */
export function move_entity(world: World, entity_id: EntityId, destination: RoomId): boolean {
    if (world.rooms[destination] == null) return false;
    let entity = world.entities[entity_id];
    if (entity == null) return false;

    remove_entity_from_room(world, entity_id);
    entity.room = destination;
    return true;
}

}
