import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const DEMO_MODE_KEY = "proga.demoMode";

const defaultDemoState = {
  enabled: true,
  accountType: "individual",
};

export const useDemoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginAsDemo = async (accountType: string) => {
    setIsLoading(true);

    try {
      localStorage.setItem(DEMO_MODE_KEY, JSON.stringify({ ...defaultDemoState, accountType }));
      toast.success("Connexion démo réussie");
      navigate("/dashboard");
    } catch {
      toast.error("Impossible d'ouvrir la démo");
    } finally {
      setIsLoading(false);
    }
  };

  return { loginAsDemo, isLoading };
};
