<!-- ui/components/right_panel.svelte -->
<script lang="ts">
    import { ui_state } from "../states/ui_state.svelte";
    import EntityDescription from "./entity_description.svelte";
</script>

<div class="right-panel">
    <EntityDescription selected_entity_id={ui_state.selected_entity_id} />
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
