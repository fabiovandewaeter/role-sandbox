<!-- ui/components/contexts/combat_context.svelte -->
<script lang="ts">
    import {
        CombatState,
        type Combat,
        type Combatant,
    } from "../../../engine/combats/combat.svelte";
    import type { EntityId } from "../../../engine/entities/entity.svelte";
    import { none, Opt, some } from "../../../engine/utils/option";
    import { world } from "../../lib/world_controller";
    import { ui_state } from "../../states/ui_state.svelte";
    import CombatantDescription from "../combatant_description.svelte";

    let combat: Combat = $derived(
        world.state.mode === "combat"
            ? world.state.combat
            : (() => {
                  throw new Error("CombatContext mount without state combat");
              })(),
    );

    let player = $derived(world.player.unwrap("Player does not exist"));
    let player_combatant = $derived(
        combat.get_combatant(player.id).unwrap("Player is not in combat"),
    );
    let current_combatant = $derived(
        combat.get_combatant(combat.current_combatant_id).unwrap(),
    );
    let is_player_turn = $derived(current_combatant.entity_id === player.id);
</script>

<h2>Combat mode</h2>
<button
    title="switch-to-explore-mode"
    onclick={() => (world.state = { mode: "explore" })}
>
    switch to explore mode
</button>

{#if combat.combat_state === CombatState.NotFinished}
    <h3>Enemy team:</h3>
    <ul>
        {#each combat.enemy_team as combatant}
            {@const entity = world.get_entity(combatant.entity_id).unwrap()}
            <li>
                <button
                    title={entity.name}
                    onclick={() =>
                        (ui_state.selected_entity_id = some(
                            combatant.entity_id,
                        ))}
                >
                    {entity.name}
                </button>
            </li>
        {/each}
    </ul>

    <h3>Player team:</h3>
    <ul>
        {#each combat.player_team as combatant}
            {@const entity = world.get_entity(combatant.entity_id).unwrap()}
            <li>
                <button
                    title={entity.name}
                    onclick={() =>
                        (ui_state.selected_entity_id = some(
                            combatant.entity_id,
                        ))}
                >
                    {entity.name}
                </button>
            </li>
        {/each}
    </ul>

    {#if is_player_turn}
        <h3>Actions:</h3>
        {#each player_combatant.actions as action}
            <button
                title={action.id}
                onclick={() =>
                    action.execute({
                        world,
                        combat,
                        source_id: current_combatant.entity_id,
                        target_id: ui_state.selected_entity_id.unwrap(),
                    })}
            >
                {action.id}
            </button>
        {/each}
    {:else}
        <p>
            Turn: {world.get_entity(current_combatant.entity_id).unwrap().name}
        </p>
    {/if}

    <CombatantDescription {combat} />
{:else}
    <p>Combat ended: {combat.combat_state}</p>
{/if}
