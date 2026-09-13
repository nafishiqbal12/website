create or replace function public.remove_project_member(p_membership_id uuid)
returns public.project_members
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  target_member public.project_members;
  removed_member public.project_members;
  project_organization_id uuid;
  actor_organization_role text;
  actor_project_role text;
begin
  select * into target_member from public.project_members where id = p_membership_id for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'Project membership was not found.';
  end if;

  select organization_id into project_organization_id from public.projects where id = target_member.project_id;
  actor_organization_role := private.current_active_organization_role(project_organization_id);
  actor_project_role := private.current_active_project_role(target_member.project_id);

  if actor_organization_role not in ('OWNER', 'ADMIN') and actor_project_role <> 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Only organization admins or project managers can remove project members.';
  end if;

  if actor_organization_role not in ('OWNER', 'ADMIN') and target_member.role = 'PROJECT_MANAGER' then
    raise exception using errcode = '42501', message = 'Project managers cannot remove project manager assignments.';
  end if;

  update public.project_members
  set status = 'REMOVED'
  where id = p_membership_id
  returning * into removed_member;

  return removed_member;
end;
$$;

revoke all on function public.expire_organization_invitation(uuid) from public;
revoke execute on function public.expire_organization_invitation(uuid) from anon;
revoke execute on function public.expire_organization_invitation(uuid) from authenticated;

revoke all on function public.set_organization_updated_at() from public;
revoke execute on function public.set_organization_updated_at() from anon;
revoke execute on function public.set_organization_updated_at() from authenticated;
revoke all on function public.set_organization_member_updated_at() from public;
revoke execute on function public.set_organization_member_updated_at() from anon;
revoke execute on function public.set_organization_member_updated_at() from authenticated;
revoke all on function public.set_project_updated_at() from public;
revoke execute on function public.set_project_updated_at() from anon;
revoke execute on function public.set_project_updated_at() from authenticated;
revoke all on function public.set_project_member_updated_at() from public;
revoke execute on function public.set_project_member_updated_at() from anon;
revoke execute on function public.set_project_member_updated_at() from authenticated;
