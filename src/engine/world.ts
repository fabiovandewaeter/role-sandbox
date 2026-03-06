// engine/world.ts
import { EntityRepository } from "./entities/entity_repository";
import type { Entity, EntityId } from "./entities/entity";
import { add_entity_to_room, remove_entity_from_room } from "./map/room_service";
import { RoomRepository } from "./map/room_repository";
import type { Room, RoomId } from "./map/room";
import { err, is_err, ok, type Result } from "./utils/result";
import type { GameState } from "./types";
import { is_none, is_some, none, some, type Opt } from "./utils/option";

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
        // check if room exists
        let room_id_opt = partial.room;
        if (is_none(room_id_opt)) return err("Entity need a room to spawn");
        let room_id = room_id_opt.value;
        let room_opt = this.room_repo.get(room_id);
        if (is_none(room_opt)) return err(`Entity need an existing Room to spawn but room doesn't exist: ${opt_room_id.value}`);
        // let room = room_opt.value;

        let entity_id_res = this.entity_repo.spawn(partial);
        if (is_err(entity_id_res)) return err(entity_id_res.error);
        let entity_id = entity_id_res.value;

        add_entity_to_room(entity_id, this.room_repo, room_id);
        return ok(entity_id);
    }

    /** spawn entity but fail if assignated room doesn't exist */
    spawn_player(entity_partial: Omit<Entity, "id">): Result<EntityId, string> {
        let id_res = this.spawn_entity(entity_partial);
        if (is_err(id_res)) return err(id_res.error);
        this.set_player(id_res.value);
        return id_res;
    }

    spawn_room(name: string): RoomId {
        return this.room_repo.spawn(name);
    }

    /** setters */
    /** ======= */
    /** change current player and returns the id of the previous player if it exists */
    set_player(entity_id: EntityId): Opt<EntityId> {
        let previous_player_id_opt = this.player;
        if (is_some(previous_player_id_opt)) {
            console.log(`Player changed : ${previous_player_id_opt.value} => ${entity_id}`);
        }
        this.player = some(entity_id);
        return previous_player_id_opt;
    }

    /** deleters */
    /** ======== */

    /** getters */
    /** ======= */
    get_entity(id: EntityId): Opt<Entity> {
        return this.entity_repo.get(id);
    }
    get_entities(): Entity[] {
        return this.entity_repo.all();
    }
    get_room(id: RoomId): Opt<Room> {
        return this.room_repo.get(id);
    }
    get_rooms(): Room[] {
        return this.room_repo.all();
    }

    /** other */
    /** ====== */
    move_entity(world: World, entity_id: EntityId, destination: RoomId): boolean {
        if (world.rooms[destination] == null) return false;
        let entity = world.entities[entity_id];
        if (entity == null) return false;

        remove_entity_from_room(world, entity_id);
        entity.room = destination;
        return true;
    }
}
