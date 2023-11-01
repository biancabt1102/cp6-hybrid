type AuthContext = {
    community: string | null;
    setCommunity: (community: string | null) => void;
    currentUser: string | null;
    setcurrentUser: (currentUser: string | null) => void;
    currentEmail: string | null;
    setcurrentEmail: (currentUser: string | null) => void;
  };