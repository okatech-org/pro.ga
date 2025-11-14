import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface DemoAccount {
  email: string;
  password: string;
  full_name: string;
  account_type: string;
  workspace_name: string | null;
  business_name: string | null;
  demo_data: any;
}

export const useDemoLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const loginAsDemo = async (accountType: string) => {
    setIsLoading(true);
    
    try {
      // Fetch demo account info
      const { data: demoAccount, error: fetchError } = await supabase
        .from('demo_accounts')
        .select('*')
        .eq('account_type', accountType)
        .single();

      if (fetchError || !demoAccount) {
        throw new Error('Compte démo introuvable');
      }

      const { email, password, full_name } = demoAccount as DemoAccount;

      // Try to sign in first
      let { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If user doesn't exist, create account
      if (signInError?.message?.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name,
              account_type: accountType,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });

        if (signUpError) throw signUpError;

        // Sign in after signup
        const { error: signInAfterSignUpError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInAfterSignUpError) throw signInAfterSignUpError;
      } else if (signInError) {
        throw signInError;
      }

      toast.success(`Connecté en tant que ${full_name}`);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast.error(error.message || 'Erreur lors de la connexion démo');
    } finally {
      setIsLoading(false);
    }
  };

  return { loginAsDemo, isLoading };
};
