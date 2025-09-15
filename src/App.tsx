import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { APISetupProvider } from '@/contexts/api-setup-context';
import SetupScreen from '@/components/setup/setup-screen';
import MainApp from '@/components/main-app';

import './App.css';

function App() {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  return (
    <ThemeProvider defaultTheme="light">
      <APISetupProvider>
        <div className="min-h-screen text-foreground">
          {!isConfigured ? (
            <SetupScreen onSetupComplete={() => setIsConfigured(true)} />
          ) : (
            <MainApp />
          )}
        </div>
      </APISetupProvider>
    </ThemeProvider>
  );
}

export default App;