// engine/world.svelte.ts
import { EntityRepository } from "./entities/entity_repository.svelte";
import type { Entity, EntityId } from "./entities/entity.svelte";
import { connect_rooms, move_entity_to_room } from "./map/room_service";
import { RoomRepository } from "./map/room_repository.svelte";
import type { Room, RoomId } from "./map/room.svelte";
import type { GameState } from "./game_state";
import { Opt, none, some } from "./utils/option";
import { Result, err, ok } from "./utils/result";
import { start_combat, start_dialogue, start_trade } from "./entities/entity_interaction";

export class World {
    private _state: GameState = $state({ mode: "explore" });
    private player_id: Opt<EntityId> = $state(none);
    private readonly entity_repo: EntityRepository = new EntityRepository();
    private readonly room_repo: RoomRepository = new RoomRepository();

    constructor() { }

    get state() { return this._state; }
    get player(): Opt<Entity> {
        return this.player_id.is_some()
            ? this.entity_repo.get(this.player_id.value)
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

    set state(state: GameState) { this._state = state; }

    // spawners
    // ========
    /** spawn entity AND move it to the room but fail if assignated room doesn't exist */
    spawn_entity(name: string, room_id: RoomId): Result<EntityId, string> {
        let room_res = this.room_repo.get_or_err(room_id);
        if (room_res.is_err()) return err(room_res.error);

        let entity_id_res = this.entity_repo.spawn(name, room_id);
        if (entity_id_res.is_err()) return err(entity_id_res.error);
        let entity_id = entity_id_res.unwrap();

        let res = move_entity_to_room(entity_id, room_id, this.room_repo, this.entity_repo);
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
        return this.room_repo.spawn(name);
    }

    // setters
    // =======
    /** change current player and returns the id of the previous player if it exists */
    set_player(entity_id: EntityId): Opt<EntityId> {
        let previous_player_id_opt = this.player_id;
        if (previous_player_id_opt.is_some()) {
            console.log(`Player changed : ${previous_player_id_opt.value} => ${entity_id}`);
        }
        this.player_id = some(entity_id);
        return previous_player_id_opt;
    }

    // deleters
    // ========

    // getters
    // ======= 
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

    // other
    // ======
    move_entity_to_room(entity_id: EntityId, room_id: RoomId): Result<void, string> {
        return move_entity_to_room(entity_id, room_id, this.room_repo, this.entity_repo);
    }

    connect_rooms(room_a_id: RoomId, room_b_id: RoomId) {
        return connect_rooms(room_a_id, room_b_id, this.room_repo);
    }

    // interactions
    // ============
    start_combat(player_team_ids: EntityId[], enemy_team_ids: EntityId[]): Result<void, string> { return start_combat(this, player_team_ids, enemy_team_ids); }
    start_dialogue(source_id: EntityId, target_id: EntityId): Result<void, string> { return start_dialogue(this, source_id, target_id); }
    start_trade(source_id: EntityId, target_id: EntityId): Result<void, string> { return start_trade(this, source_id, target_id); }
}
