// engine/room_repository.ts
import { none, some, type Opt } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import { type RoomId, Room } from "./room";

export class RoomRepository {
    private next_id: any;
    private readonly rooms: Record<RoomId, Room> = {};

    constructor() {
        this.next_id = 0;
    }

    get(id: RoomId): Opt<Room> {
        const res = this.rooms[id];
        return res != null && res != undefined ? some(res) : none;
    }

    /** spawn entity without room */
    spawn(name: string): RoomId {
        const id: RoomId = this.next_id++;
        const room: Room = new Room(id, name);
        this.rooms[id] = room;
        return id;
    }

    delete(id: RoomId): Result<RoomId, string> {
        if (delete this.rooms[id]) {
            return ok(id);
        }
        return err(`Couldn't delete room: ${id}`);
    }

    all_ids(): RoomId[] {
        return Object.keys(this.rooms).map(Number) as RoomId[];
    }
    all(): Room[] {
        return Object.values(this.rooms);
    }
}
