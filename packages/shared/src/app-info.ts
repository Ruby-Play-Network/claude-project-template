import * as zod from 'zod';

/** Response shape for `GET /api/app-info`. */
export const appInfoResponseSchema = zod.object({
  name: zod.string().min(1),
});

export type AppInfoResponse = zod.infer<typeof appInfoResponseSchema>;
