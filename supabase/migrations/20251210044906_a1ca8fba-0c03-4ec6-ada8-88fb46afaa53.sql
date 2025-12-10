-- Insert people for user bruna_duarte14@hotmail.com (user_id: 1345dc7c-3884-44ba-9e50-9634d9741854)
INSERT INTO public.people (user_id, name) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'Bruna'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'Kaik'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'Mãe'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'Pai'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'Guilherme'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'Andressa')
ON CONFLICT DO NOTHING;

-- Insert categories for user bruna_duarte14@hotmail.com
INSERT INTO public.categories (user_id, name, color) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'LUZ', '#FBBF24'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'POTE DIV', '#10B981'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ITAÚ', '#F97316'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'MERCADO PAGO', '#3B82F6'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'NUBANK', '#8B5CF6'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'PLANEJADO', '#06B6D4'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'CURY', '#6B7280'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'OBRA', '#84CC16'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'CONVÊNIO', '#C084FC'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'CLARO', '#EF4444'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'BRADESCO', '#DC2626'),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'C&A', '#EC4899')
ON CONFLICT DO NOTHING;