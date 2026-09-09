revoke execute on function private.record_membership_audit() from public;
revoke execute on function private.record_membership_audit() from anon;

revoke execute on function private.prevent_membership_mutation() from public;
revoke execute on function private.prevent_membership_mutation() from anon;

revoke execute on function private.prevent_active_owner_removal() from public;
revoke execute on function private.prevent_active_owner_removal() from anon;

revoke execute on function public.create_organization(text) from public;
revoke execute on function public.create_organization(text) from anon;
grant execute on function public.create_organization(text) to authenticated;

revoke execute on function public.update_organization_membership(uuid, text, text) from public;
revoke execute on function public.update_organization_membership(uuid, text, text) from anon;
grant execute on function public.update_organization_membership(uuid, text, text) to authenticated;
