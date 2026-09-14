create or replace function public.select_project_service(
  p_project_id uuid,
  p_offering_id uuid,
  p_requested_scope jsonb default '{}'::jsonb
)
returns public.project_services
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  selected_service public.project_services;
  existing_service public.project_services;
  project_organization_id uuid;
  offering_is_active boolean;
  service_is_active boolean;
  pillar_is_active boolean;
  actor_organization_role text;
  actor_project_role text;
begin
  select project.organization_id into project_organization_id
  from public.projects as project
  where project.id = p_project_id
    and project.status = 'ACTIVE';

  if project_organization_id is null then
    raise exception using errcode = 'P0002', message = 'Project was not found or is not active.';
  end if;

  actor_organization_role := private.current_active_organization_role(project_organization_id);
  actor_project_role := private.current_active_project_role(p_project_id);
  if actor_organization_role not in ('OWNER', 'ADMIN') and actor_project_role <> 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can select project services.';
  end if;

  select offering.is_active,
         service.is_active,
         pillar.is_active
    into offering_is_active, service_is_active, pillar_is_active
  from public.service_offerings as offering
  join public.catalog_services as service on service.id = offering.service_id
  join public.catalog_pillars as pillar on pillar.id = service.pillar_id
  where offering.id = p_offering_id
    and offering.effective_from <= timezone('utc', now())
    and (offering.effective_until is null or offering.effective_until > timezone('utc', now()));

  if not found or not offering_is_active or not service_is_active or not pillar_is_active then
    raise exception using errcode = '22023', message = 'The selected service offering is not active.';
  end if;

  select * into existing_service
  from public.project_services
  where project_id = p_project_id
    and offering_id = p_offering_id;

  if found then
    return existing_service;
  end if;

  insert into public.project_services (
    project_id,
    offering_id,
    status,
    requested_scope,
    scope_snapshot,
    created_by
  )
  values (
    p_project_id,
    p_offering_id,
    'REQUESTED',
    coalesce(p_requested_scope, '{}'::jsonb),
    '{}'::jsonb,
    (select auth.uid())
  )
  returning * into selected_service;

  return selected_service;
end;
$$;

revoke all on function public.select_project_service(uuid, uuid, jsonb) from public;
revoke execute on function public.select_project_service(uuid, uuid, jsonb) from anon;
grant execute on function public.select_project_service(uuid, uuid, jsonb) to authenticated;
