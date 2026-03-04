<script lang="ts">
  import MainContent from "./components/main_content.svelte";
  import Navbar from "./components/navbar.svelte";
  import RightPanel from "./components/right_panel.svelte";
</script>

<main>
  <div class="app-container">
    <Navbar />
    <MainContent />
    <RightPanel />
  </div>
</main>

<style>
  body {
    margin: 0px;
  }

  .app-container {
    display: grid;
    grid-template-columns: 200px 1fr 300px; /* nav | contenu | droite */
    height: 100vh;
    gap: 10px; /* un petit espace entre les colonnes */
    padding: 10px;
    box-sizing: border-box;
  }
</style>
