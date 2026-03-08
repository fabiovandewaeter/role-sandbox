<!-- ui/components/description_description.svelte -->
<script lang="ts">
    import type { Combat } from "../../engine/combats/combat.svelte";
    import { Entity } from "../../engine/entities/entity.svelte";
    import { none, type Opt } from "../../engine/utils/option";
    import { world } from "../lib/world_controller";
    import { ui_state } from "../states/ui_state.svelte";
    import Stats from "./stats.svelte";

    type PropsTypes = {
        combat: Combat;
    };

    let { combat }: PropsTypes = $props();

    let player_opt = $derived(world.player);

    let entity_opt: Opt<Entity> = $derived(
        ui_state.selected_entity_id.is_some()
            ? world.get_entity(ui_state.selected_entity_id.value)
            : none,
    );
</script>

<div class="description-description">
    <h3>Selected entity:</h3>
    {#if entity_opt.is_some() && player_opt.is_some()}
        {@const combatant = combat.get_combatant(entity_opt.value.id).unwrap()}
        {@const entity = world.get_entity(entity_opt.value.id).unwrap()}

        <h4>Combatant description:</h4>
        <ul>
            <li>{combatant.entity_id}</li>
        </ul>
        <h4>Current stats:</h4>
        <Stats stats={combatant.current_stats} />
        <h4>Max stats:</h4>
        <Stats stats={entity.max_stats} />
    {:else}
        <p>No combatant selected or player spawned</p>
    {/if}
</div>
