<!-- ui/components/right_panel.svelte -->
<script lang="ts">
    import { none } from "../../engine/utils/option";
    import { ui_state } from "../states/ui_state.svelte";
    import { world } from "../states/world_state.svelte";
    import EntityDescription from "./entity_description.svelte";

    let entity = $derived(
        ui_state.selected_entity_id.is_some()
            ? world.get_entity(ui_state.selected_entity_id.value)
            : none,
    );
</script>

<div class="right-panel">
    <div class="entity-description">
        <EntityDescription selected_entity={entity} />
    </div>
    <div class="logs">
        <h2>Logs</h2>
        <ul></ul>
    </div>
</div>

<style>
    .right-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 10px;
    }

    .logs {
        background-color: #a66;
        flex: 1; /* prend le reste */
        padding: 10px;
    }
</style>
