// engine/world.ts
import { EntityRepository } from "./entities/entity_repository";
import type { Entity, EntityId } from "./entities/entity";
import { connect_rooms, move_entity_to_room } from "./map/room_service";
import { RoomRepository } from "./map/room_repository";
import type { Room, RoomId } from "./map/room";
import type { GameState } from "./types";
import { Opt, none, some } from "./utils/option";
import { Result, err, ok } from "./utils/result";

export class World {
    private _state: GameState = { mode: "explore" };
    private _player_id: Opt<EntityId> = none;
    private readonly _entity_repo: EntityRepository = new EntityRepository();
    private readonly _room_repo: RoomRepository = new RoomRepository();

    constructor() { }

    get state() { return this._state; }
    get player_id() { return this._player_id }
    get player(): Opt<Entity> {
        return this._player_id.is_some()
            ? this._entity_repo.get(this._player_id.value)
            : none;
    }
    get current_room(): Opt<Room> {
        let player_opt = this.player;
        if (player_opt.is_none()) return none;
        let player = player_opt.unwrap();

        if (!player.room_id.is_some()) return none;
        let room_id = player.room_id.value;
        return this.get_room(room_id);
    }

    // spawners
    // ========
    /** spawn entity AND move it to the room but fail if assignated room doesn't exist */
    spawn_entity(name: string, room_id: RoomId): Result<EntityId, string> {
        let room_res = this._room_repo.get_or_err(room_id);
        if (room_res.is_err()) return err(room_res.error);

        let entity_id_res = this._entity_repo.spawn(name, room_id);
        if (entity_id_res.is_err()) return err(entity_id_res.error);
        let entity_id = entity_id_res.unwrap();

        let res = move_entity_to_room(entity_id, room_id, this._room_repo, this._entity_repo);
        if (res.is_err()) return err(res.error);
        return ok(entity_id);
    }

    /** spawn the player and set the world player as new player */
    spawn_player(name: string, room_id: RoomId): Result<EntityId, string> {
        let id_res = this.spawn_entity(name, room_id);
        if (id_res.is_err()) return err(id_res.error);
        let id = id_res.unwrap();
        this.set_player(id);
        return ok(id);
    }

    spawn_room(name: string): RoomId {
        return this._room_repo.spawn(name);
    }

    // setters
    // =======
    /** change current player and returns the id of the previous player if it exists */
    set_player(entity_id: EntityId): Opt<EntityId> {
        let previous_player_id_opt = this._player_id;
        if (previous_player_id_opt.is_some()) {
            console.log(`Player changed : ${previous_player_id_opt.value} => ${entity_id}`);
        }
        this._player_id = some(entity_id);
        return previous_player_id_opt;
    }

    // deleters
    // ========

    // getters
    // ======= 
    get_entity(id: EntityId): Opt<Entity> {
        return this._entity_repo.get(id);
    }
    get_entities(): Entity[] {
        return this._entity_repo.all();
    }
    get_room(id: RoomId): Opt<Room> {
        return this._room_repo.get(id);
    }
    get_rooms(): Room[] {
        return this._room_repo.all();
    }

    // other
    // ======
    move_entity_to_room(entity_id: EntityId, room_id: RoomId): Result<void, string> {
        return move_entity_to_room(entity_id, room_id, this._room_repo, this._entity_repo);
    }

    connect_rooms(room_a_id: RoomId, room_b_id: RoomId) {
        return connect_rooms(room_a_id, room_b_id, this._room_repo);
    }
}
