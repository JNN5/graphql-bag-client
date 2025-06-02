import { createContext, useContext, useState, useEffect } from 'react';

interface APISetupContextType {
  apiUrl: string;
  apiKey: string;
  isConfigured: boolean;
  setApiConfig: (url: string, key: string) => void;
  clearApiConfig: () => void;
}

const APISetupContext = createContext<APISetupContextType>({
  apiUrl: '',
  apiKey: '',
  isConfigured: false,
  setApiConfig: () => {},
  clearApiConfig: () => {},
});

export const useApiSetup = () => useContext(APISetupContext);

export const APISetupProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  // Load from localStorage on initial render
  useEffect(() => {
    const savedUrl = localStorage.getItem('graphql-api-url');
    const savedKey = localStorage.getItem('graphql-api-key');
    
    if (savedUrl && savedKey) {
      setApiUrl(savedUrl);
      setApiKey(savedKey);
      setIsConfigured(true);
    }
  }, []);

  const setApiConfig = (url: string, key: string) => {
    setApiUrl(url);
    setApiKey(key);
    setIsConfigured(true);
    
    // Save to localStorage
    localStorage.setItem('graphql-api-url', url);
    localStorage.setItem('graphql-api-key', key);
  };

  const clearApiConfig = () => {
    setApiUrl('');
    setApiKey('');
    setIsConfigured(false);
    
    // Clear from localStorage
    localStorage.removeItem('graphql-api-url');
    localStorage.removeItem('graphql-api-key');
  };

  return (
    <APISetupContext.Provider 
      value={{ 
        apiUrl, 
        apiKey, 
        isConfigured, 
        setApiConfig, 
        clearApiConfig 
      }}
    >
      {children}
    </APISetupContext.Provider>
  );
};