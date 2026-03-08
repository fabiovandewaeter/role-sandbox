<!-- ui/components/contexts/combat_context.svelte -->
<script lang="ts">
    import type {
        Combat,
        Combatant,
    } from "../../../engine/combats/combat.svelte";
    import type { EntityId } from "../../../engine/entities/entity.svelte";
    import { none, Opt, some } from "../../../engine/utils/option";
    import { world } from "../../lib/world_controller";
    import { ui_state } from "../../states/ui_state.svelte";
    import CombatantDescription from "../combatant_description.svelte";
    import EntityDescription from "../entity_description.svelte";

    let combat_opt: Opt<Combat> = $derived(
        world.state.mode === "combat" ? some(world.state.combat) : none,
    );
    let current_combatant_id_opt: Opt<EntityId> = $derived(
        combat_opt.is_some()
            ? some(combat_opt.value.current_combatant_id)
            : none,
    );
    let current_combatant_opt: Opt<Combatant> = $derived(
        current_combatant_id_opt.is_some() && combat_opt.is_some()
            ? combat_opt.value.get_combatant(current_combatant_id_opt.value)
            : none,
    );
</script>

<h2>Combat mode</h2>
<button
    title="switch-to-explore-mode"
    onclick={() => (world.state = { mode: "explore" })}
>
    switch to explore mode
</button>
{#if combat_opt.is_some()}
    {#if current_combatant_opt.is_some()}
        {@const combat = combat_opt.value}
        {@const current_combatant = current_combatant_opt.value}
        {@const player = world.player.unwrap("player doesn't exist")}
        {@const player_combatant = combat
            .get_combatant(player.id)
            .unwrap("player is not in combat")}
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
        {#if current_combatant.entity_id === player.id}
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
        {/if}
        <CombatantDescription {combat} />
    {:else}
        <p>no current combatant</p>
    {/if}
{:else}
    <p>no combat started</p>
{/if}
