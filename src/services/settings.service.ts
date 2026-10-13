import type { ClientSettings, ClientSettingsPatch } from '@/lib/settings.types';
import { apiJson } from '@/src/lib/api-client';

interface SettingsApiResponse {
  settings: ClientSettings;
}

export async function getUserSettings(): Promise<ClientSettings> {
  const data = await apiJson<SettingsApiResponse>('/api/user/settings', {}, 'Failed to load settings');
  return data.settings;
}

export async function updateUserSettings(patch: ClientSettingsPatch): Promise<ClientSettings> {
  const data = await apiJson<SettingsApiResponse>(
    '/api/user/settings',
    { method: 'PATCH', body: JSON.stringify(patch) },
    'Failed to update settings',
  );
  return data.settings;
}
