import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchAppInfo } from '@/api/client';

export const useAppInfoStore = defineStore('app-info', () => {
  const name = ref<string | null>(null);
  const error = ref<string | null>(null);

  const load = async (): Promise<void> => {
    error.value = null;
    try {
      const appInfo = await fetchAppInfo();
      name.value = appInfo.name;
    } catch (loadError) {
      error.value = loadError instanceof Error ? loadError.message : 'Unknown error';
    }
  };

  return { name, error, load };
});
