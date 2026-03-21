import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export type UserRole = 'learner' | 'creator';
export type AppLanguage = 'vi' | 'en';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  activeWorkflowId: string | null;
  setActiveWorkflowId: (id: string | null) => void;
  isCreatorMode: boolean;
  toggleCreatorMode: () => void;
}

const AppContext = createContext<AppContextType>({
  role: 'learner',
  setRole: () => {},
  language: 'vi',
  setLanguage: () => {},
  activeWorkflowId: null,
  setActiveWorkflowId: () => {},
  isCreatorMode: false,
  toggleCreatorMode: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();

  const [role, setRoleState] = useState<UserRole>(() =>
    (localStorage.getItem('skillbridge-role') as UserRole) || 'learner'
  );

  const [language, setLanguageState] = useState<AppLanguage>(() =>
    (localStorage.getItem('skillbridge-lang') as AppLanguage) || 'vi'
  );

  const [activeWorkflowId, setActiveWorkflowId] = useState<string | null>(() =>
    localStorage.getItem('skillbridge-active-workflow') || null
  );

  const setRole = (newRole: UserRole) => {
    localStorage.setItem('skillbridge-role', newRole);
    setRoleState(newRole);
  };

  const setLanguage = (lang: AppLanguage) => {
    localStorage.setItem('skillbridge-lang', lang);
    setLanguageState(lang);
    i18n.changeLanguage(lang);
  };

  const isCreatorMode = role === 'creator';

  const toggleCreatorMode = () => {
    const newRole: UserRole = role === 'creator' ? 'learner' : 'creator';
    setRole(newRole);
  };

  const handleSetActiveWorkflow = (id: string | null) => {
    if (id) localStorage.setItem('skillbridge-active-workflow', id);
    else localStorage.removeItem('skillbridge-active-workflow');
    setActiveWorkflowId(id);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AppContext.Provider value={{
      role, setRole,
      language, setLanguage,
      activeWorkflowId,
      setActiveWorkflowId: handleSetActiveWorkflow,
      isCreatorMode,
      toggleCreatorMode,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
