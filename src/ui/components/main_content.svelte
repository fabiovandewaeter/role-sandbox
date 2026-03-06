<!-- ui/components/main_content.svelte -->
<script lang="ts">
    import type { EntityId } from "../../engine/entities/entity.svelte";
    import type { RoomId } from "../../engine/map/room.svelte";
    import { some } from "../../engine/utils/option";
    import { ui_state } from "../states/ui_state.svelte";
    import { world } from "../states/world_state.svelte";

    // let world = $derived(world_state.world);
    let player_opt = $derived(world.player);
    let current_room_opt = $derived(world.current_room);

    function go_to_room(entity_id: EntityId, room_id: RoomId) {
        world.move_entity_to_room(entity_id, room_id);
    }
</script>

<div class="main-content">
    <h2>Main content</h2>
    {#if player_opt.is_some() && current_room_opt.is_some()}
        {@const player = player_opt.value}
        {@const current_room = current_room_opt.value}

        <button
            title="TODO-delete-this-button"
            onclick={() => world.spawn_entity("Summon", 0).unwrap()}
            >spawn entity</button
        >

        <ul>
            {#each world.get_entities() as e}
                <li>{e.name}</li>
            {/each}
        </ul>

        <h3>Current room:</h3>
        <div>{current_room.name}</div>

        <h3>Entities here:</h3>
        <ul>
            {#each current_room.entities as e_id}
                {@const entity = world.get_entity(e_id).unwrap()}
                <li>
                    <button
                        title="select_entity_id"
                        onclick={() =>
                            (ui_state.selected_entity_id = some(entity.id))}
                    >
                        {entity.name}
                    </button>
                </li>
            {/each}
        </ul>

        <h3>Available exists:</h3>
        <ul>
            {#each current_room?.neighbors ?? [] as n_id}
                {@const room = world.get_room(n_id).unwrap()}

                <li>
                    <button
                        title="go_to_room {room}"
                        onclick={() => go_to_room(player.id, n_id)}
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
        <li>ajouter fichier avec text fr / en</li>
        <li>
            voir UI du main_content avec: description room + entites présentes
            dans une liste déroulante + options MAIS pas juste texte, faire avec
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
