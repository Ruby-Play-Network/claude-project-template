import type { AppInfoResponse } from '@app/shared';

/** Business logic only: no Express types, no Drizzle types. */
export const buildAppInfo = (appName: string): AppInfoResponse => ({ name: appName });
