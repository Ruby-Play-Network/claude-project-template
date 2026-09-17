import { createPinia } from 'pinia';
import { flushPromises, mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WelcomeView from '@/views/WelcomeView.vue';
import { fetchAppInfo } from '@/api/client';

vi.mock('@/api/client', () => ({ fetchAppInfo: vi.fn() }));

const fetchAppInfoMock = vi.mocked(fetchAppInfo);

const mountWelcomeView = () => mount(WelcomeView, { global: { plugins: [createPinia()] } });

describe('WelcomeView', () => {
  beforeEach(() => {
    fetchAppInfoMock.mockReset();
  });

  it('greets the user with the name returned by the API', async () => {
    fetchAppInfoMock.mockResolvedValue({ name: 'Acrux' });

    const wrapper = mountWelcomeView();
    await flushPromises();

    expect(wrapper.get('.welcome-panel__greeting').text()).toBe('Welcome to Acrux');
  });

  it('shows an error when the API call fails', async () => {
    fetchAppInfoMock.mockRejectedValue(new Error('Request failed with status 500'));

    const wrapper = mountWelcomeView();
    await flushPromises();

    expect(wrapper.get('.welcome-panel__error').text()).toContain('Request failed with status 500');
  });
});
