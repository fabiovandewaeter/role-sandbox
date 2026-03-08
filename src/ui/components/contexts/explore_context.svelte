<!-- ui/components/contexts/explore_context.svelte -->
<script lang="ts">
    import type { EntityId } from "../../../engine/entities/entity.svelte";
    import type { RoomId } from "../../../engine/map/room.svelte";
    import { none, some } from "../../../engine/utils/option";
    import { world } from "../../lib/world_controller";
    import { ui_state } from "../../states/ui_state.svelte";
    import EntityDescription from "../entity_description.svelte";

    let player_opt = $derived(world.player);
    let current_room_opt = $derived(world.current_room);

    function go_to_room(entity_id: EntityId, room_id: RoomId) {
        world.move_entity_to_room(entity_id, room_id);
        ui_state.selected_entity_id = none;
    }
</script>

<h2>Explore mode</h2>
{#if player_opt.is_some() && current_room_opt.is_some()}
    {@const player = player_opt.value}
    {@const current_room = current_room_opt.value}

    <button
        title="TODO-delete-this-button-that-spawn-an-entity"
        onclick={() =>
            world
                .spawn_entity("Summon", current_room.id, {
                    hp: 10,
                    mana: 100,
                    attack: 10,
                })
                .unwrap()}>spawn entity</button
    >

    <h3>All entities:</h3>
    <ul>
        {#each world.get_entities() as e}
            <li>{e.name}</li>
        {/each}
    </ul>

    <h3>Current room:</h3>
    <div>{current_room.name}</div>

    <h3>Entities here:</h3>
    <ul>
        {#each current_room.get_entities_without_player(player.id) as e_id}
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
    <EntityDescription />
{:else}
    <p>The player is not set</p>
{/if}
