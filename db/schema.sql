-- db/schema.sql
-- Esquema para capturar leads desde la landing

create table if not exists leads (
  id bigserial primary key,
  created_at timestamptz not null default now(),

  -- buy / sell (lo manda tu formulario)
  intent text not null check (intent in ('buy', 'sell')),

  name text not null,
  email text not null,
  phone text not null,

  -- campos opcionales del formulario
  preferred_lang text,
  property_type text,
  zone text,

  -- valores numéricos (presupuesto / precio estimado)
  estimated_price numeric,
  budget numeric,

  usage text,
  message text,

  -- metadatos útiles
  user_agent text,
  ip text
);

-- índices para panel/admin y búsquedas
create index if not exists leads_created_at_idx on leads(created_at desc);
create index if not exists leads_intent_idx on leads(intent);
create index if not exists leads_email_idx on leads(email);
