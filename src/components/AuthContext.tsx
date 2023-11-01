import React, { createContext, useContext, useState, ReactNode } from 'react';

const AuthContext = createContext<AuthContext | undefined>(undefined);

// Crie um componente de contexto de autenticacao para fornecer o contexto aos componentes filhos
type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [community, setCommunity] = useState<string | null>(null);
  const [currentUser, setcurrentUser] = useState<string | null>(null);
  const [currentEmail, setcurrentEmail] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ community, setCommunity, currentUser, setcurrentUser, currentEmail, setcurrentEmail}}>
      {children}
    </AuthContext.Provider>
  );
};

// Crie um hook para facilitar o acesso ao contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
