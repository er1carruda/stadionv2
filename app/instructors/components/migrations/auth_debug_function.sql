-- Função para obter o auth.uid() atual - útil para debugging de RLS
CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.uid()
$$; 