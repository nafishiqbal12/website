import { supabase } from '../supabase/client';
import type {
  Organization,
  OrganizationInvitation,
  OrganizationInvitationRole,
  OrganizationMembership,
  OrganizationRole,
  OrganizationMembershipStatus,
  CatalogPillar,
  CatalogPillarCode,
  CatalogService,
  ProjectService,
  ServiceOffering,
  ServiceOfferingBillingMode,
  Project,
  ProjectMembership,
  ProjectMembershipStatus,
  ProjectRole,
  Proposal,
  ProposalItem,
  ProposalStatus,
  ProposalVersion,
  Agreement,
  AgreementAcceptance,
  AgreementStatus,
  AgreementVersion,
} from './types';

const configurationError = () => new Error('Supabase is not configured in this environment.');

type OrganizationRow = {
  id: string;
  name: string;
  status: Organization['status'];
  owner_id: string;
  created_at: string;
  updated_at: string;
};

type MembershipRow = {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrganizationMembership['role'];
  status: OrganizationMembership['status'];
  invited_by: string | null;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
};

type InvitationRow = {
  id: string;
  organization_id: string;
  inviter_user_id: string;
  invitee_email: string;
  role: OrganizationInvitation['role'];
  status: OrganizationInvitation['status'];
  expires_at: string;
  accepted_by: string | null;
  accepted_at: string | null;
  revoked_by: string | null;
  revoked_at: string | null;
  created_at: string;
  updated_at: string;
};

type ProjectRow = {
  id: string;
  organization_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: Project['status'];
  delivery_stage: Project['deliveryStage'];
  created_by: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

type ProjectMembershipRow = {
  id: string;
  project_id: string;
  user_id: string;
  role: ProjectMembership['role'];
  status: ProjectMembership['status'];
  created_at: string;
  updated_at: string;
};

type CatalogPillarRow = {
  id: string;
  code: CatalogPillarCode;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type CatalogServiceRow = {
  id: string;
  pillar_id: string;
  code: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

type ServiceOfferingRow = {
  id: string;
  service_id: string;
  version: number;
  name: string;
  description: string;
  scope_template: Record<string, unknown>;
  billing_mode: ServiceOfferingBillingMode;
  is_active: boolean;
  display_order: number;
  effective_from: string;
  effective_until: string | null;
  created_at: string;
  updated_at: string;
};

type ProjectServiceRow = {
  id: string;
  project_id: string;
  offering_id: string;
  status: ProjectService['status'];
  requested_scope: Record<string, unknown>;
  scope_snapshot: Record<string, unknown>;
  created_by: string;
  created_at: string;
  updated_at: string;
};

type ProposalRow = {
  id: string;
  organization_id: string;
  project_id: string | null;
  status: ProposalStatus;
  created_by: string;
  issued_at: string | null;
  valid_until: string | null;
  current_version_id: string | null;
  created_at: string;
  updated_at: string;
};

type ProposalVersionRow = {
  id: string;
  proposal_id: string;
  version_number: number;
  supersedes_version_id: string | null;
  status: ProposalStatus;
  scope_snapshot: Record<string, unknown>;
  commercial_snapshot: Record<string, unknown>;
  currency: 'USD';
  content_checksum: string;
  issued_at: string | null;
  valid_until: string | null;
  created_by: string;
  created_at: string;
};

type ProposalItemRow = {
  id: string;
  proposal_version_id: string;
  project_id: string | null;
  project_service_id: string | null;
  offering_id: string | null;
  pillar_code: CatalogPillarCode;
  service_code: string;
  service_name: string;
  offering_name: string;
  scope_snapshot: Record<string, unknown>;
  commercial_snapshot: Record<string, unknown>;
  quantity: number | null;
  unit: string | null;
  sort_order: number;
  created_at: string;
};

type AgreementRow = {
  id: string;
  organization_id: string;
  project_id: string | null;
  proposal_id: string | null;
  source_proposal_version_id: string | null;
  status: AgreementStatus;
  created_by: string;
  effective_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
};

type AgreementVersionRow = {
  id: string;
  agreement_id: string;
  version_number: number;
  supersedes_version_id: string | null;
  status: AgreementStatus;
  terms_snapshot: Record<string, unknown>;
  content_checksum: string;
  effective_at: string | null;
  expires_at: string | null;
  created_by: string;
  created_at: string;
};

type AgreementAcceptanceRow = {
  id: string;
  agreement_id: string;
  agreement_version_id: string;
  organization_id: string;
  accepting_user_id: string;
  accepted_at: string;
  accepted_version_number: number;
  content_checksum: string;
  idempotency_key: string;
  created_at: string;
};

function mapOrganization(row: OrganizationRow): Organization {
  return {
    id: row.id,
    name: row.name,
    status: row.status,
    ownerId: row.owner_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMembership(row: MembershipRow): OrganizationMembership {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role,
    status: row.status,
    invitedBy: row.invited_by,
    acceptedAt: row.accepted_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapInvitation(row: InvitationRow): OrganizationInvitation {
  return {
    id: row.id,
    organizationId: row.organization_id,
    inviterUserId: row.inviter_user_id,
    inviteeEmail: row.invitee_email,
    role: row.role,
    status: row.status,
    expiresAt: row.expires_at,
    acceptedBy: row.accepted_by,
    acceptedAt: row.accepted_at,
    revokedBy: row.revoked_by,
    revokedAt: row.revoked_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    organizationId: row.organization_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    status: row.status,
    deliveryStage: row.delivery_stage,
    createdBy: row.created_by,
    metadata: row.metadata,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapProjectMembership(row: ProjectMembershipRow): ProjectMembership {
  return {
    id: row.id,
    projectId: row.project_id,
    userId: row.user_id,
    role: row.role,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapCatalogPillar(row: CatalogPillarRow): CatalogPillar {
  return { id: row.id, code: row.code, name: row.name, description: row.description, isActive: row.is_active, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapCatalogService(row: CatalogServiceRow): CatalogService {
  return { id: row.id, pillarId: row.pillar_id, code: row.code, name: row.name, description: row.description, isActive: row.is_active, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapServiceOffering(row: ServiceOfferingRow): ServiceOffering {
  return { id: row.id, serviceId: row.service_id, version: row.version, name: row.name, description: row.description, scopeTemplate: row.scope_template, billingMode: row.billing_mode, isActive: row.is_active, displayOrder: row.display_order, effectiveFrom: row.effective_from, effectiveUntil: row.effective_until, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapProjectService(row: ProjectServiceRow): ProjectService {
  return { id: row.id, projectId: row.project_id, offeringId: row.offering_id, status: row.status, requestedScope: row.requested_scope, scopeSnapshot: row.scope_snapshot, createdBy: row.created_by, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapProposal(row: ProposalRow): Proposal {
  return { id: row.id, organizationId: row.organization_id, projectId: row.project_id, status: row.status, createdBy: row.created_by, issuedAt: row.issued_at, validUntil: row.valid_until, currentVersionId: row.current_version_id, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapProposalVersion(row: ProposalVersionRow): ProposalVersion {
  return { id: row.id, proposalId: row.proposal_id, versionNumber: row.version_number, supersedesVersionId: row.supersedes_version_id, status: row.status, scopeSnapshot: row.scope_snapshot, commercialSnapshot: row.commercial_snapshot, currency: row.currency, contentChecksum: row.content_checksum, issuedAt: row.issued_at, validUntil: row.valid_until, createdBy: row.created_by, createdAt: row.created_at };
}

function mapProposalItem(row: ProposalItemRow): ProposalItem {
  return { id: row.id, proposalVersionId: row.proposal_version_id, projectId: row.project_id, projectServiceId: row.project_service_id, offeringId: row.offering_id, pillarCode: row.pillar_code, serviceCode: row.service_code, serviceName: row.service_name, offeringName: row.offering_name, scopeSnapshot: row.scope_snapshot, commercialSnapshot: row.commercial_snapshot, quantity: row.quantity, unit: row.unit, sortOrder: row.sort_order, createdAt: row.created_at };
}

function mapAgreement(row: AgreementRow): Agreement {
  return { id: row.id, organizationId: row.organization_id, projectId: row.project_id, proposalId: row.proposal_id, sourceProposalVersionId: row.source_proposal_version_id, status: row.status, createdBy: row.created_by, effectiveAt: row.effective_at, expiresAt: row.expires_at, createdAt: row.created_at, updatedAt: row.updated_at };
}

function mapAgreementVersion(row: AgreementVersionRow): AgreementVersion {
  return { id: row.id, agreementId: row.agreement_id, versionNumber: row.version_number, supersedesVersionId: row.supersedes_version_id, status: row.status, termsSnapshot: row.terms_snapshot, contentChecksum: row.content_checksum, effectiveAt: row.effective_at, expiresAt: row.expires_at, createdBy: row.created_by, createdAt: row.created_at };
}

function mapAgreementAcceptance(row: AgreementAcceptanceRow): AgreementAcceptance {
  return { id: row.id, agreementId: row.agreement_id, agreementVersionId: row.agreement_version_id, organizationId: row.organization_id, acceptingUserId: row.accepting_user_id, acceptedAt: row.accepted_at, acceptedVersionNumber: row.accepted_version_number, contentChecksum: row.content_checksum, idempotencyKey: row.idempotency_key, createdAt: row.created_at };
}

export async function listOrganizations(): Promise<{ organizations: Organization[]; error: Error | null }> {
  if (!supabase) return { organizations: [], error: configurationError() };
  const { data, error } = await supabase.from('organizations').select('*').order('created_at', { ascending: false });
  return { organizations: ((data ?? []) as OrganizationRow[]).map(mapOrganization), error };
}

export async function createOrganization(name: string): Promise<{ organization: Organization | null; error: Error | null }> {
  if (!supabase) return { organization: null, error: configurationError() };
  const { data, error } = await supabase.rpc('create_organization', { p_name: name });
  return { organization: data ? mapOrganization(data as OrganizationRow) : null, error };
}

export async function listOrganizationMembers(organizationId: string): Promise<{ memberships: OrganizationMembership[]; error: Error | null }> {
  if (!supabase) return { memberships: [], error: configurationError() };
  const { data, error } = await supabase
    .from('organization_members')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: true });
  return { memberships: ((data ?? []) as MembershipRow[]).map(mapMembership), error };
}

export async function listOrganizationInvitations(organizationId: string): Promise<{ invitations: OrganizationInvitation[]; error: Error | null }> {
  if (!supabase) return { invitations: [], error: configurationError() };
  const { data, error } = await supabase
    .from('organization_invitations')
    .select('id, organization_id, inviter_user_id, invitee_email, role, status, expires_at, accepted_by, accepted_at, revoked_by, revoked_at, created_at, updated_at')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });
  return { invitations: ((data ?? []) as InvitationRow[]).map(mapInvitation), error };
}

export async function acceptOrganizationInvitation(tokenHash: string): Promise<{ membership: OrganizationMembership | null; error: Error | null }> {
  if (!supabase) return { membership: null, error: configurationError() };
  const { data, error } = await supabase.rpc('accept_organization_invitation', { p_token_hash: tokenHash });
  return { membership: data ? mapMembership(data as MembershipRow) : null, error };
}

async function createInvitationTokenHash() {
  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const digest = await crypto.subtle.digest('SHA-256', tokenBytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, '0')).join('');
}

export async function createOrganizationInvitation(input: {
  organizationId: string;
  email: string;
  role: OrganizationInvitationRole;
  expiresAt: string;
}): Promise<{ invitation: OrganizationInvitation | null; error: Error | null }> {
  if (!supabase) return { invitation: null, error: configurationError() };
  const tokenHash = await createInvitationTokenHash();
  const { data, error } = await supabase.rpc('create_organization_invitation', {
    p_organization_id: input.organizationId,
    p_invitee_email: input.email.trim().toLowerCase(),
    p_role: input.role,
    p_token_hash: tokenHash,
    p_expires_at: input.expiresAt,
  });
  return { invitation: data ? mapInvitation(data as InvitationRow) : null, error };
}

export async function revokeOrganizationInvitation(invitationId: string): Promise<{ invitation: OrganizationInvitation | null; error: Error | null }> {
  if (!supabase) return { invitation: null, error: configurationError() };
  const { data, error } = await supabase.rpc('revoke_organization_invitation', { p_invitation_id: invitationId });
  return { invitation: data ? mapInvitation(data as InvitationRow) : null, error };
}

export async function updateOrganizationMembership(input: {
  membershipId: string;
  role: OrganizationRole;
  status: OrganizationMembershipStatus;
}): Promise<{ membership: OrganizationMembership | null; error: Error | null }> {
  if (!supabase) return { membership: null, error: configurationError() };
  const { data, error } = await supabase.rpc('update_organization_membership', {
    p_membership_id: input.membershipId,
    p_role: input.role,
    p_status: input.status,
  });
  return { membership: data ? mapMembership(data as MembershipRow) : null, error };
}

export async function listProjects(organizationId: string): Promise<{ projects: Project[]; error: Error | null }> {
  if (!supabase) return { projects: [], error: configurationError() };
  const { data, error } = await supabase.from('projects').select('*').eq('organization_id', organizationId).order('created_at', { ascending: false });
  return { projects: ((data ?? []) as ProjectRow[]).map(mapProject), error };
}

export async function createProject(input: {
  organizationId: string;
  name: string;
  slug: string;
  description?: string | null;
  metadata?: Record<string, unknown>;
}): Promise<{ project: Project | null; error: Error | null }> {
  if (!supabase) return { project: null, error: configurationError() };
  const { data, error } = await supabase.rpc('create_project', {
    p_organization_id: input.organizationId,
    p_name: input.name,
    p_slug: input.slug,
    p_description: input.description ?? null,
    p_metadata: input.metadata ?? {},
  });
  return { project: data ? mapProject(data as ProjectRow) : null, error };
}

export async function getProject(projectId: string): Promise<{ project: Project | null; error: Error | null }> {
  if (!supabase) return { project: null, error: configurationError() };
  const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).maybeSingle();
  return { project: data ? mapProject(data as ProjectRow) : null, error };
}

export async function addProjectMember(input: {
  projectId: string;
  userId: string;
  role: ProjectRole;
}): Promise<{ membership: ProjectMembership | null; error: Error | null }> {
  if (!supabase) return { membership: null, error: configurationError() };
  const { data, error } = await supabase.rpc('add_project_member', {
    p_project_id: input.projectId,
    p_user_id: input.userId,
    p_role: input.role,
  });
  return { membership: data ? mapProjectMembership(data as ProjectMembershipRow) : null, error };
}

export async function updateProjectMembership(input: {
  membershipId: string;
  role: ProjectRole;
  status: ProjectMembershipStatus;
}): Promise<{ membership: ProjectMembership | null; error: Error | null }> {
  if (!supabase) return { membership: null, error: configurationError() };
  const { data, error } = await supabase.rpc('update_project_membership', {
    p_membership_id: input.membershipId,
    p_role: input.role,
    p_status: input.status,
  });
  return { membership: data ? mapProjectMembership(data as ProjectMembershipRow) : null, error };
}

export async function removeProjectMember(membershipId: string): Promise<{ membership: ProjectMembership | null; error: Error | null }> {
  if (!supabase) return { membership: null, error: configurationError() };
  const { data, error } = await supabase.rpc('remove_project_member', { p_membership_id: membershipId });
  return { membership: data ? mapProjectMembership(data as ProjectMembershipRow) : null, error };
}

export async function listProjectMembers(projectId: string): Promise<{ memberships: ProjectMembership[]; error: Error | null }> {
  if (!supabase) return { memberships: [], error: configurationError() };
  const { data, error } = await supabase.from('project_members').select('*').eq('project_id', projectId).order('created_at', { ascending: true });
  return { memberships: ((data ?? []) as ProjectMembershipRow[]).map(mapProjectMembership), error };
}

export async function listCatalogPillars(): Promise<{ pillars: CatalogPillar[]; error: Error | null }> {
  if (!supabase) return { pillars: [], error: configurationError() };
  const { data, error } = await supabase.from('catalog_pillars').select('*').order('code');
  return { pillars: ((data ?? []) as CatalogPillarRow[]).map(mapCatalogPillar), error };
}

export async function listCatalogServices(): Promise<{ services: CatalogService[]; error: Error | null }> {
  if (!supabase) return { services: [], error: configurationError() };
  const { data, error } = await supabase.from('catalog_services').select('*').order('name');
  return { services: ((data ?? []) as CatalogServiceRow[]).map(mapCatalogService), error };
}

export async function listServiceOfferings(): Promise<{ offerings: ServiceOffering[]; error: Error | null }> {
  if (!supabase) return { offerings: [], error: configurationError() };
  const { data, error } = await supabase.from('service_offerings').select('*').order('display_order').order('name');
  return { offerings: ((data ?? []) as ServiceOfferingRow[]).map(mapServiceOffering), error };
}

export async function listProjectServices(projectId: string): Promise<{ services: ProjectService[]; error: Error | null }> {
  if (!supabase) return { services: [], error: configurationError() };
  const { data, error } = await supabase.from('project_services').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
  return { services: ((data ?? []) as ProjectServiceRow[]).map(mapProjectService), error };
}

export async function selectProjectService(input: { projectId: string; offeringId: string; requestedScope?: Record<string, unknown> }): Promise<{ service: ProjectService | null; error: Error | null }> {
  if (!supabase) return { service: null, error: configurationError() };
  const { data, error } = await supabase.rpc('select_project_service', {
    p_project_id: input.projectId,
    p_offering_id: input.offeringId,
    p_requested_scope: input.requestedScope ?? {},
  });
  return { service: data ? mapProjectService(data as ProjectServiceRow) : null, error };
}

export async function listProposals(organizationId: string, projectId?: string): Promise<{ proposals: Proposal[]; error: Error | null }> {
  if (!supabase) return { proposals: [], error: configurationError() };
  let query = supabase.from('proposals').select('*').eq('organization_id', organizationId).order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  return { proposals: ((data ?? []) as ProposalRow[]).map(mapProposal), error };
}

export async function listProposalVersions(proposalId: string): Promise<{ versions: ProposalVersion[]; error: Error | null }> {
  if (!supabase) return { versions: [], error: configurationError() };
  const { data, error } = await supabase.from('proposal_versions').select('*').eq('proposal_id', proposalId).order('version_number', { ascending: false });
  return { versions: ((data ?? []) as ProposalVersionRow[]).map(mapProposalVersion), error };
}

export async function listProposalItems(versionId: string): Promise<{ items: ProposalItem[]; error: Error | null }> {
  if (!supabase) return { items: [], error: configurationError() };
  const { data, error } = await supabase.from('proposal_items').select('*').eq('proposal_version_id', versionId).order('sort_order');
  return { items: ((data ?? []) as ProposalItemRow[]).map(mapProposalItem), error };
}

export async function createProposal(input: { organizationId: string; projectId?: string | null; validUntil?: string | null }): Promise<{ proposal: Proposal | null; error: Error | null }> {
  if (!supabase) return { proposal: null, error: configurationError() };
  const { data, error } = await supabase.rpc('create_proposal', { p_organization_id: input.organizationId, p_project_id: input.projectId ?? null, p_valid_until: input.validUntil ?? null });
  return { proposal: data ? mapProposal(data as ProposalRow) : null, error };
}

export async function createProposalVersion(input: { proposalId: string; scopeSnapshot?: Record<string, unknown>; commercialSnapshot?: Record<string, unknown>; contentChecksum: string; items?: Record<string, unknown>[]; validUntil?: string | null }): Promise<{ version: ProposalVersion | null; error: Error | null }> {
  if (!supabase) return { version: null, error: configurationError() };
  const { data, error } = await supabase.rpc('create_proposal_version', { p_proposal_id: input.proposalId, p_scope_snapshot: input.scopeSnapshot ?? {}, p_commercial_snapshot: input.commercialSnapshot ?? {}, p_content_checksum: input.contentChecksum, p_items: input.items ?? [], p_valid_until: input.validUntil ?? null });
  return { version: data ? mapProposalVersion(data as ProposalVersionRow) : null, error };
}

export async function issueProposal(proposalId: string, expectedVersion: number): Promise<{ proposal: Proposal | null; error: Error | null }> {
  if (!supabase) return { proposal: null, error: configurationError() };
  const { data, error } = await supabase.rpc('issue_proposal', { p_proposal_id: proposalId, p_expected_version: expectedVersion });
  return { proposal: data ? mapProposal(data as ProposalRow) : null, error };
}

export async function acceptProposal(proposalId: string, expectedVersion: number): Promise<{ proposal: Proposal | null; error: Error | null }> {
  if (!supabase) return { proposal: null, error: configurationError() };
  const { data, error } = await supabase.rpc('accept_proposal', { p_proposal_id: proposalId, p_expected_version: expectedVersion });
  return { proposal: data ? mapProposal(data as ProposalRow) : null, error };
}

export async function listAgreements(organizationId: string, projectId?: string): Promise<{ agreements: Agreement[]; error: Error | null }> {
  if (!supabase) return { agreements: [], error: configurationError() };
  let query = supabase.from('agreements').select('*').eq('organization_id', organizationId).order('created_at', { ascending: false });
  if (projectId) query = query.eq('project_id', projectId);
  const { data, error } = await query;
  return { agreements: ((data ?? []) as AgreementRow[]).map(mapAgreement), error };
}

export async function listAgreementVersions(agreementId: string): Promise<{ versions: AgreementVersion[]; error: Error | null }> {
  if (!supabase) return { versions: [], error: configurationError() };
  const { data, error } = await supabase.from('agreement_versions').select('*').eq('agreement_id', agreementId).order('version_number', { ascending: false });
  return { versions: ((data ?? []) as AgreementVersionRow[]).map(mapAgreementVersion), error };
}

export async function createAgreement(input: { organizationId: string; projectId?: string | null; proposalId?: string | null; sourceProposalVersionId?: string | null; termsSnapshot?: Record<string, unknown>; contentChecksum?: string }): Promise<{ agreement: Agreement | null; error: Error | null }> {
  if (!supabase) return { agreement: null, error: configurationError() };
  const { data, error } = await supabase.rpc('create_agreement', { p_organization_id: input.organizationId, p_project_id: input.projectId ?? null, p_proposal_id: input.proposalId ?? null, p_source_proposal_version_id: input.sourceProposalVersionId ?? null, p_terms_snapshot: input.termsSnapshot ?? {}, p_content_checksum: input.contentChecksum ?? 'pending-terms-review' });
  return { agreement: data ? mapAgreement(data as AgreementRow) : null, error };
}

export async function createAgreementVersion(input: { agreementId: string; termsSnapshot?: Record<string, unknown>; contentChecksum: string; effectiveAt?: string | null; expiresAt?: string | null }): Promise<{ version: AgreementVersion | null; error: Error | null }> {
  if (!supabase) return { version: null, error: configurationError() };
  const { data, error } = await supabase.rpc('create_agreement_version', { p_agreement_id: input.agreementId, p_terms_snapshot: input.termsSnapshot ?? {}, p_content_checksum: input.contentChecksum, p_effective_at: input.effectiveAt ?? null, p_expires_at: input.expiresAt ?? null });
  return { version: data ? mapAgreementVersion(data as AgreementVersionRow) : null, error };
}

export async function acceptAgreement(input: { agreementId: string; agreementVersionId: string; idempotencyKey: string }): Promise<{ acceptance: AgreementAcceptance | null; error: Error | null }> {
  if (!supabase) return { acceptance: null, error: configurationError() };
  const { data, error } = await supabase.rpc('accept_agreement', { p_agreement_id: input.agreementId, p_agreement_version_id: input.agreementVersionId, p_idempotency_key: input.idempotencyKey });
  return { acceptance: data ? mapAgreementAcceptance(data as AgreementAcceptanceRow) : null, error };
}
