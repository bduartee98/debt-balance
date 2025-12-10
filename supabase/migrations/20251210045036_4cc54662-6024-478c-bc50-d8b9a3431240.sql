-- Insert debts from Page 10 of spreadsheet for user bruna_duarte14@hotmail.com
-- Using category IDs with UPPERCASE names and person IDs

-- LUZ R$ 317.07 - Kaik R$ 105.69, Mãe R$ 105.69
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', '70aa25b9-52e2-4cf8-aa42-dcd2671b3e41', 105.69, 'LUZ', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '86f762a4-9d9c-47a2-bd43-e88bfcae4411', '70aa25b9-52e2-4cf8-aa42-dcd2671b3e41', 105.69, 'LUZ', 'pending', CURRENT_DATE);

-- POTE DIV R$ 158.00 - Mãe R$ 52.66
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '86f762a4-9d9c-47a2-bd43-e88bfcae4411', '1cd085ce-8b36-4a69-875e-94c51f6deed3', 52.66, 'POTE DIV', 'pending', CURRENT_DATE);

-- ITAU - Pai R$ 195.30
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'd8abeb1f-9865-435c-8091-90a04bed16f4', '74dabdca-6c62-4b39-ba09-41fedee0b897', 195.30, 'ITAÚ', 'pending', CURRENT_DATE);

-- ITAU - Andressa R$ 500.80
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '7cae614e-e13e-489e-9909-27a6dc932c8e', '74dabdca-6c62-4b39-ba09-41fedee0b897', 500.80, 'ITAÚ', 'pending', CURRENT_DATE);

-- ITAU - Bruna R$ 9.60
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '74dabdca-6c62-4b39-ba09-41fedee0b897', 9.60, 'ITAÚ', 'pending', CURRENT_DATE);

-- MERCADO PAGO - Kaik R$ 250.00
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 250.00, 'MERCADO PAGO', 'pending', CURRENT_DATE);

-- MERCADO PAGO R$ 87.76 - Bruna R$ 43.88, Kaik R$ 43.88
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 43.88, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 43.88, 'MERCADO PAGO', 'pending', CURRENT_DATE);

-- MERCADO PAGO - Bruna individual amounts
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 11.98, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 40.18, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 33.07, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 37.55, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 24.00, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 40.90, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 21.37, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 130.81, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 26.55, 'MERCADO PAGO', 'pending', CURRENT_DATE);

-- MERCADO PAGO R$ 175.70 - Bruna R$ 43.92, Kaik R$ 43.92, Mãe R$ 43.92, Pai R$ 43.92
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 43.92, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 43.92, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '86f762a4-9d9c-47a2-bd43-e88bfcae4411', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 43.92, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'd8abeb1f-9865-435c-8091-90a04bed16f4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 43.92, 'MERCADO PAGO', 'pending', CURRENT_DATE);

-- MERCADO PAGO R$ 153.16 - Bruna R$ 38.29, Kaik R$ 38.29, Mãe R$ 38.29, Pai R$ 38.29
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 38.29, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 38.29, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '86f762a4-9d9c-47a2-bd43-e88bfcae4411', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 38.29, 'MERCADO PAGO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'd8abeb1f-9865-435c-8091-90a04bed16f4', 'c4d3fb23-bcc7-442f-8f06-3f69abefc050', 38.29, 'MERCADO PAGO', 'pending', CURRENT_DATE);

-- NUBANK - Bruna individual amounts
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '86335735-6cdc-4a28-a89e-cc868f47ec25', 217.10, 'NUBANK', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '86335735-6cdc-4a28-a89e-cc868f47ec25', 18.30, 'NUBANK', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '86335735-6cdc-4a28-a89e-cc868f47ec25', 17.95, 'NUBANK', 'pending', CURRENT_DATE);

-- NUBANK - Kaik R$ 304.68
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', '86335735-6cdc-4a28-a89e-cc868f47ec25', 304.68, 'NUBANK', 'pending', CURRENT_DATE);

-- NUBANK - Kaik R$ 1,430.22
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', '86335735-6cdc-4a28-a89e-cc868f47ec25', 1430.22, 'NUBANK', 'pending', CURRENT_DATE);

-- NUBANK - Mãe R$ 21.94
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '86f762a4-9d9c-47a2-bd43-e88bfcae4411', '86335735-6cdc-4a28-a89e-cc868f47ec25', 21.94, 'NUBANK', 'pending', CURRENT_DATE);

-- PLANEJADO R$ 625.00 - Bruna R$ 312.50, Kaik R$ 312.50
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', 'f7ca009f-5d7d-4c8a-86a0-df06fbccaa6b', 312.50, 'PLANEJADO', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', 'f7ca009f-5d7d-4c8a-86a0-df06fbccaa6b', 312.50, 'PLANEJADO', 'pending', CURRENT_DATE);

-- CURY R$ 1,444.94 - Bruna R$ 722.47, Kaik R$ 722.47
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '325fda46-f2e5-4302-8d23-6847c7c3de72', 722.47, 'CURY', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', '325fda46-f2e5-4302-8d23-6847c7c3de72', 722.47, 'CURY', 'pending', CURRENT_DATE);

-- OBRA R$ 738.34 - Bruna R$ 369.17, Kaik R$ 369.17
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '5aa817bb-0076-48fb-a0ef-f801a13b5866', 369.17, 'OBRA', 'pending', CURRENT_DATE),
  ('1345dc7c-3884-44ba-9e50-9634d9741854', '9cf2d595-caf4-4be8-904f-9876909bd52c', '5aa817bb-0076-48fb-a0ef-f801a13b5866', 369.17, 'OBRA', 'pending', CURRENT_DATE);

-- CONVÊNIO - Bruna R$ 216.76
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '6efca39d-acbf-4191-afa5-522776f11fe6', 216.76, 'CONVÊNIO', 'pending', CURRENT_DATE);

-- CLARO - Bruna R$ 65.00
INSERT INTO public.debts (user_id, person_id, category_id, amount, description, status, due_date) VALUES
  ('1345dc7c-3884-44ba-9e50-9634d9741854', 'ed7e5f45-7202-42a1-83f0-d9da313153b4', '01b99edf-d0d8-44d0-a20e-696af6ea666c', 65.00, 'CLARO', 'pending', CURRENT_DATE);