<script setup lang="ts">
import { onMounted } from 'vue';
import { useAppInfoStore } from '@/stores/app-info';

const appInfo = useAppInfoStore();

onMounted(() => {
  void appInfo.load();
});
</script>

<template>
  <section class="welcome-panel">
    <p v-if="appInfo.error" class="welcome-panel__error">
      Could not load the app name: {{ appInfo.error }}
    </p>
    <h1 v-else-if="appInfo.name" class="welcome-panel__greeting">Welcome to {{ appInfo.name }}</h1>
    <p v-else class="welcome-panel__status">Loading…</p>
  </section>
</template>

<style scoped>
.welcome-panel {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: var(--space-8);
  background: var(--color-background);
}

.welcome-panel__greeting {
  font-size: var(--font-size-heading);
  color: var(--color-accent);
}

.welcome-panel__status {
  color: var(--color-text-muted);
}

.welcome-panel__error {
  color: var(--color-danger);
}
</style>
