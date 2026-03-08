<!-- ui/components/right_panel.svelte -->
<script lang="ts">
</script>

<div class="right-panel">
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
