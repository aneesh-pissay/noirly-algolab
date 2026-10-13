'use client';

import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import ProgressSync from './components/ProgressSync';
import SettingsSync from './components/SettingsSync';
import { MobileNavProvider } from './contexts/MobileNavContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
      <AuthProvider>
        <SettingsProvider>
          <MobileNavProvider>
            <SettingsSync />
            <ProgressSync />
            {children}
          </MobileNavProvider>
        </SettingsProvider>
      </AuthProvider>
  );
}
