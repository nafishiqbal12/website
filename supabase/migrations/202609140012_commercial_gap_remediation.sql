create or replace function public.create_agreement(
  p_organization_id uuid,
  p_project_id uuid default null,
  p_proposal_id uuid default null,
  p_source_proposal_version_id uuid default null,
  p_terms_snapshot jsonb default '{}'::jsonb,
  p_content_checksum text default 'pending-terms-review'
)
returns public.agreements
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  created_agreement public.agreements;
  target_proposal public.proposals;
  target_version public.proposal_versions;
  effective_project_id uuid;
begin
  if not private.commercial_owner(p_organization_id) then
    raise exception using errcode = '42501', message = 'Only the organization owner can create agreements.';
  end if;

  if p_project_id is not null and not exists (
    select 1
    from public.projects
    where id = p_project_id
      and organization_id = p_organization_id
      and status <> 'ARCHIVED'
  ) then
    raise exception using errcode = 'P0002', message = 'Project was not found in this organization.';
  end if;

  if (p_proposal_id is null) <> (p_source_proposal_version_id is null) then
    raise exception using errcode = '22023', message = 'Proposal and proposal version must be supplied together.';
  end if;

  if p_proposal_id is not null then
    select *
      into target_proposal
    from public.proposals
    where id = p_proposal_id
      and organization_id = p_organization_id
    for update;

    if not found then
      raise exception using errcode = 'P0002', message = 'Proposal was not found in this organization.';
    end if;

    if target_proposal.status <> 'ACCEPTED' then
      raise exception using errcode = '22023', message = 'Agreement source proposal is not accepted.';
    end if;

    if target_proposal.project_id is distinct from p_project_id then
      raise exception using errcode = '42501', message = 'Proposal project does not match the agreement project.';
    end if;

    select *
      into target_version
    from public.proposal_versions
    where id = p_source_proposal_version_id
      and proposal_id = target_proposal.id
      and status = 'ACCEPTED'
      and target_proposal.current_version_id = id
    for update;

    if not found then
      raise exception using errcode = '22023', message = 'Agreement source must be the accepted current proposal version.';
    end if;

    effective_project_id := target_proposal.project_id;
  else
    effective_project_id := p_project_id;
  end if;

  insert into public.agreements (
    organization_id,
    project_id,
    proposal_id,
    source_proposal_version_id,
    created_by
  )
  values (
    p_organization_id,
    effective_project_id,
    p_proposal_id,
    p_source_proposal_version_id,
    (select auth.uid())
  )
  returning * into created_agreement;

  perform private.record_commercial_audit(
    'agreement_created',
    p_organization_id,
    effective_project_id,
    null,
    null,
    created_agreement.id
  );

  return created_agreement;
end;
$$;

revoke all on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) from public;
revoke execute on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) from anon;
grant execute on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) to authenticated;

comment on function public.create_agreement(uuid, uuid, uuid, uuid, jsonb, text) is
  'Creates an agreement only when supplied organization, project, proposal, and accepted current proposal version relationships resolve within one tenant.';
