<!-- ui/components/entity_description.svelte -->
<script lang="ts">
    import { Entity, type EntityId } from "../../engine/entities/entity.svelte";
    import { none, type Opt } from "../../engine/utils/option";
    import { world } from "../lib/world_controller";
    import { ui_state } from "../states/ui_state.svelte";

    let player_opt = $derived(world.player);

    let entity_opt: Opt<Entity> = $derived(
        ui_state.selected_entity_id.is_some()
            ? world.get_entity(ui_state.selected_entity_id.value)
            : none,
    );
</script>

<div class="entity-description">
    <h3>Selected entity:</h3>
    {#if entity_opt.is_some() && player_opt.is_some()}
        {@const entity = entity_opt.value}
        {@const player = player_opt.value}
        <h4>Entity description:</h4>
        <ul>
            <li>{entity.id}</li>
            <li>{entity.name}</li>
            <li>{entity.room_id}</li>
        </ul>
        <h4>Available interactions:</h4>
        <ul>
            {#each entity.interactions as int}
                <button
                    title={int.id}
                    onclick={() =>
                        int.execute({
                            world,
                            source_id: player.id,
                            target_id: entity.id,
                        })}>{int.id}</button
                >
            {/each}
        </ul>
    {:else}
        <p>No entity selected or player spawned</p>
    {/if}
</div>

<style>
</style>
