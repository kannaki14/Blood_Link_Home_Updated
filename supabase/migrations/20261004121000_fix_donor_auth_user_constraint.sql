do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.donors'::regclass
      and contype = 'u'
      and conkey = array[
        (
          select attnum
          from pg_attribute
          where attrelid = 'public.donors'::regclass
            and attname = 'auth_user_id'
        )
      ]::smallint[]
  ) then
    drop index if exists public.donors_auth_user_id_key;
    alter table public.donors
      add constraint donors_auth_user_id_key unique (auth_user_id);
  end if;
end
$$;
