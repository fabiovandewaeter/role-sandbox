<script lang="ts">
    import type { EntityId } from "../../engine/entities/types";
    import type { RoomId } from "../../engine/map/types";
    import { get_entities, get_rooms, move_entity } from "../../engine/world";
    import { world_store } from "../stores/world";

    $: world = $world_store;
    $: entities = get_entities(world);
    $: player = world.player != null ? world.entities[world.player] : undefined;
    $: current_room =
        player && player.room != null ? world.rooms[player.room] : undefined;

    function go_to_room(entity_id: EntityId, room_id: RoomId) {
        world_store.update((w) => {
            move_entity(w, entity_id, room_id);
            return w;
        });
    }
</script>

<div class="main-content">
    <h2>Main Content</h2>
    {#if player}
        <h3>Entities here:</h3>
        <ul>
            {#each current_room?.entities as e_id}
                {@const entity = world.entities[e_id]}
                <li>{entity.name}</li>
            {/each}
        </ul>

        <h3>Available exists:</h3>
        <ul>
            {#each current_room?.neighbors ?? [] as n_id}
                {@const room = world.rooms[n_id]}
                <li>
                    <button
                        title="go_to_room {room}"
                        on:click={() => go_to_room(player.id, n_id)}
                    >
                        {room.name}
                    </button>
                </li>
            {/each}
        </ul>
    {:else}
        <p>The player is not set</p>
    {/if}

    <h3>TODO</h3>
    <ul>
        <li>remplacer les undefined par Opt</li>
        <li>ajouter fichier avec text fr / en</li>
        <li>
            voir UI main content avec: description room + entites présentes dans
            une liste déroulante + options MAIS pas juste texte, faire avec
            boutons - utiliser "player.room != null ?" au lieu de juste
            "player.room ?" car quand c'est index 0 ça retourne faux
        </li>
    </ul>
</div>

<style>
    .main-content {
        background-color: #888;
        padding: 20px;
    }
</style>
