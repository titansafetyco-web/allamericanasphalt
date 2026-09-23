alter table public.crm_messages add column if not exists status text not null default 'open';

alter table public.crm_messages drop constraint if exists crm_messages_status_check;
alter table public.crm_messages add constraint crm_messages_status_check
  check (status in ('open', 'accepted', 'denied', 'draft'));
