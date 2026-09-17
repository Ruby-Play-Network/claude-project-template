import { appInfoResponseSchema, type AppInfoResponse } from '@app/shared';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

/** Fetches the app's display name. Response is validated against the shared schema. */
export const fetchAppInfo = async (): Promise<AppInfoResponse> => {
  const response = await fetch(`${baseUrl}/app-info`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return appInfoResponseSchema.parse(await response.json());
};
