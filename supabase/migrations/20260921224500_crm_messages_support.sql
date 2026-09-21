alter table public.crm_messages drop constraint if exists crm_messages_kind_check;
alter table public.crm_messages add constraint crm_messages_kind_check
  check (kind in ('estimate', 'contact', 'feedback', 'support'));
