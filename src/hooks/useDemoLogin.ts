import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useDemoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginAsDemo = async (accountType: string) => {
    setIsLoading(true);
    
    try {
      // Call server-side Edge Function for secure demo authentication
      const { data, error } = await supabase.functions.invoke('demo-login', {
        body: { accountType },
      });

      if (error) {
        throw new Error('Échec de la connexion démo');
      }

      if (!data?.session) {
        throw new Error('Session invalide');
      }

      // Set the session from the Edge Function response
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      if (sessionError) {
        throw new Error('Impossible de définir la session');
      }

      toast.success(`Connecté en tant que ${data.full_name}`);
      navigate('/dashboard');
    } catch (error: any) {
      // Generic error message to user, no sensitive details
      toast.error('Erreur lors de la connexion démo');
      // Server-side logging only - no console.error with sensitive data
    } finally {
      setIsLoading(false);
    }
  };

  return { loginAsDemo, isLoading };
};
