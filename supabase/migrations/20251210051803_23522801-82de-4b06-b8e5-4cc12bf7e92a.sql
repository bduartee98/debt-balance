-- Remove duplicate categories (keeping only the UPPERCASE ones that are linked to debts)
DELETE FROM public.categories 
WHERE user_id = '1345dc7c-3884-44ba-9e50-9634d9741854' 
AND id IN (
  'fb0d138c-b1a6-4365-9ab2-577c59d5990a', -- Mercado Pago (lowercase variant)
  'e77c71e4-6f40-44e3-bb13-be3381478012', -- Itaú (lowercase variant)
  'aae904b6-b456-4566-81c6-94045f94de2b', -- Nubank (lowercase variant)
  '1fa796b9-6627-45e9-917d-42672118c17b', -- Planejado (lowercase variant)
  '9e20c0e7-88c0-44c3-b0f2-c3ec0102a21b', -- Claro (lowercase variant)
  '85819cfb-8666-482f-9f1e-c74af69fc479', -- Obra (lowercase variant)
  'fca8f995-7add-4389-be4e-06a77e830da2', -- Cury (lowercase variant)
  '642c64ee-e835-4ab5-89c0-0658600480c3'  -- Convênio (lowercase variant)
);