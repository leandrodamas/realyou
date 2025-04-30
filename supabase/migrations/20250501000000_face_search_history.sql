
-- Criar tabela para armazenar histórico de buscas faciais
CREATE TABLE IF NOT EXISTS public.face_search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  matched BOOLEAN NOT NULL DEFAULT false,
  matched_person_id TEXT,
  image_url TEXT NOT NULL,
  search_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_face_search_history_user_id ON public.face_search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_face_search_history_matched ON public.face_search_history(matched);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE public.face_search_history ENABLE ROW LEVEL SECURITY;

-- Permitir usuários ver apenas suas próprias pesquisas
CREATE POLICY "Usuários podem ver apenas suas próprias pesquisas"
ON public.face_search_history
FOR SELECT
USING (auth.uid() = user_id);

-- Permitir usuários criar registros apenas para si mesmos
CREATE POLICY "Usuários podem registrar apenas suas próprias pesquisas"
ON public.face_search_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Políticas delete/update não são necessárias pois histórico não deve ser alterado
