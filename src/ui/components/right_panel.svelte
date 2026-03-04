<div class="right-panel">
    <div class="inventory">Inventory</div>
    <div class="logs">Logs</div>
</div>

<style>
    .right-panel {
        display: flex;
        flex-direction: column;
        height: 100%;
        gap: 10px;
    }

    .inventory {
        background-color: #6a6;
        flex: 1; /* prend l'espace restant au dessus des logs */
        padding: 10px;
    }

    .logs {
        background-color: #a66;
        flex: 1; /* prend le reste */
        padding: 10px;
    }
</style>
