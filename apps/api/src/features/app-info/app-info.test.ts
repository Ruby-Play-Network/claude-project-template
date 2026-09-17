import { describe, expect, it } from 'vitest';
import { appInfoResponseSchema } from '@app/shared';
import { buildAppInfo } from './app-info.logic.js';

describe('buildAppInfo', () => {
  it('returns the app name in the shared response shape', () => {
    const result = buildAppInfo('Acrux');

    expect(result).toEqual({ name: 'Acrux' });
    expect(appInfoResponseSchema.parse(result)).toEqual(result);
  });
});
