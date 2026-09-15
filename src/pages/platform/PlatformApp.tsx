import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FolderKanban,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ShieldCheck,
  UserCircle,
  Users,
  X,
} from 'lucide-react';
import { Alert, Badge, Button, Card, Container, EmptyState, ErrorState, LoadingState, TextAreaField, TextField } from '../../components/ui';
import { ProfilePage } from '../AuthPages';
import { useAuth } from '../../lib/auth/useAuth';
import {
  addProjectMember,
  createOrganization,
  createOrganizationInvitation,
  createAgreement,
  createAgreementVersion,
  createProject,
  createProposal,
  createProposalVersion,
  getProject,
  acceptAgreement,
  acceptProposal,
  cancelPaymentObligation,
  issueProposal,
  listCatalogPillars,
  listCatalogServices,
  listProjectServices,
  listServiceOfferings,
  listOrganizationInvitations,
  listOrganizationMembers,
  listOrganizations,
  listProjectMembers,
  listAgreementVersions,
  listAgreements,
  listProposalItems,
  listProposalVersions,
  listProposals,
  listPaymentObligations,
  listPaymentAttempts,
  listProjectEntitlements,
  listProjectDeliveryActivations,
  listProjectImplementationRecords,
  listProjectDeploymentRecords,
  listProjectObservationRecords,
  listProjectStabilizationRecords,
  listProjectHandoverRecords,
  listProjectOngoingServiceRecords,
  listProjects,
  removeProjectMember,
  revokeOrganizationInvitation,
  selectProjectService,
  updateOrganizationMembership,
  updateProjectMembership,
} from '../../lib/organizations/data';
import type {
  Organization,
  OrganizationInvitation,
  OrganizationMembership,
  OrganizationRole,
  CatalogPillar,
  CatalogService,
  ProjectService,
  ServiceOffering,
  Project,
  ProjectMembership,
  ProjectRole,
  Agreement,
  AgreementVersion,
  Proposal,
  ProposalItem,
  ProposalVersion,
  PaymentObligation,
  PaymentAttempt,
  Entitlement,
  DeliveryActivation,
  ImplementationRecord,
  DeploymentRecord,
  ObservationRecord,
  StabilizationRecord,
  HandoverRecord,
  OngoingServiceRecord,
} from '../../lib/organizations/types';
import type { RouteState } from '../../routes/routeConfig';

type PlatformAppProps = {
  route: RouteState;
  onNavigate: (target: string) => void;
};

type PlatformData = {
  currentUserId: string;
  organizations: Organization[];
  selectedOrganization: Organization | null;
  memberships: OrganizationMembership[];
  invitations: OrganizationInvitation[];
  projects: Project[];
  refresh: () => Promise<void>;
};

let latestPlatformData: PlatformData | null = null;

const fieldClass = 'w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300';

function roleTone(role: string) {
  return role === 'OWNER' ? 'success' : role === 'ADMIN' || role === 'PROJECT_MANAGER' ? 'info' : 'default';
}

function statusTone(status: string) {
  return status === 'ACTIVE' ? 'success' : status === 'PENDING' ? 'warning' : 'default';
}

function PlatformShell({ children, active, onNavigate }: { children: ReactNode; active: string; onNavigate: (target: string) => void }) {
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigation = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Organizations', path: '/organizations', icon: Building2 },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Profile', path: '/profile', icon: UserCircle },
  ];

  const logout = async () => {
    await signOut();
    onNavigate('/');
  };

  const go = (path: string) => {
    setMobileOpen(false);
    onNavigate(path);
  };

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100">
      <div className="flex min-h-screen">
        <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-800 bg-[#0a1120] p-5 transition-transform lg:static lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between">
            <button className="bw-focus rounded-lg text-left" onClick={() => go('/dashboard')}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">BlockWaveLab</p>
              <p className="mt-1 text-sm text-slate-400">Client platform</p>
            </button>
            <button className="bw-focus rounded-lg p-2 text-slate-400 lg:hidden" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={18} /></button>
          </div>
          <div className="mt-10 space-y-1">
            {navigation.map(({ label, path, icon: Icon }) => (
              <button key={path} onClick={() => go(path)} className={`bw-focus flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${active === path ? 'bg-cyan-400/10 text-cyan-200' : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-100'}`}>
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
          <div className="mt-auto pt-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="truncate text-sm font-medium text-slate-100">{user?.email}</p>
              <p className="mt-1 text-xs text-slate-500">Authenticated workspace</p>
              <button onClick={logout} className="bw-focus mt-4 flex items-center gap-2 rounded-lg text-sm text-slate-400 hover:text-rose-200"><LogOut size={16} /> Sign out</button>
            </div>
          </div>
        </aside>
        {mobileOpen ? <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden" onClick={() => setMobileOpen(false)} /> : null}
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-800/80 bg-[#080d18]/90 px-5 backdrop-blur lg:px-10">
            <button className="bw-focus rounded-lg p-2 text-slate-300 lg:hidden" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <div className="hidden lg:block"><p className="text-sm text-slate-400">Workspace</p><p className="font-medium text-slate-100">Build. Automate. Operate. Grow.</p></div>
            <button onClick={() => go('/profile')} className="bw-focus flex items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-300/50 hover:text-cyan-100"><UserCircle size={17} /> Profile</button>
          </header>
          <main className="p-5 lg:p-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p><h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 lg:text-4xl">{title}</h1><p className="mt-3 max-w-2xl text-slate-400">{description}</p></div>{action}</div>;
}

function OrganizationPicker({ data, onNavigate }: { data: PlatformData; onNavigate: (target: string) => void }) {
  if (!data.organizations.length) return null;
  return <label className="block max-w-sm"><span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current organization</span><select className={fieldClass} value={data.selectedOrganization?.id ?? ''} onChange={(event) => onNavigate(`/organizations/${event.target.value}`)}>{data.organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}</select></label>;
}

function CreateOrganization({ onCreated }: { onCreated: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 160) return setError('Organization name must be between 2 and 160 characters.');
    setError(null); setSaving(true);
    const result = await createOrganization(cleanName);
    setSaving(false);
    if (result.error) return setError(result.error.message);
    setName('');
    await onCreated();
  };
  return <Card className="max-w-xl"><div className="flex items-start gap-4"><div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-200"><Building2 size={22} /></div><div><h2 className="text-xl font-semibold text-slate-50">Create an organization</h2><p className="mt-2 text-sm text-slate-400">Start a secure workspace for your project delivery team.</p></div></div><form onSubmit={submit} className="mt-6 space-y-4"><TextField label="Organization name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Northstar Labs" error={error ?? undefined} /><Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create organization'} <ArrowRight size={16} /></Button></form></Card>;
}

function OrganizationSummary({ organization, membership }: { organization: Organization; membership: OrganizationMembership | undefined }) {
  return <Card><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm text-slate-400">Organization</p><h2 className="mt-1 text-2xl font-semibold text-slate-50">{organization.name}</h2></div><div className="flex gap-2"><Badge tone={statusTone(organization.status)}>{organization.status}</Badge>{membership ? <Badge tone={roleTone(membership.role)}>{membership.role}</Badge> : null}</div></div><div className="mt-6 grid gap-4 border-t border-slate-800 pt-5 sm:grid-cols-3"><div><p className="text-xs uppercase tracking-wide text-slate-500">Access</p><p className="mt-1 text-sm text-slate-200">{membership?.status ?? 'No active membership'}</p></div><div><p className="text-xs uppercase tracking-wide text-slate-500">Created</p><p className="mt-1 text-sm text-slate-200">{new Date(organization.createdAt).toLocaleDateString()}</p></div><div><p className="text-xs uppercase tracking-wide text-slate-500">Lifecycle</p><p className="mt-1 text-sm text-slate-200">Organization foundation</p></div></div></Card>;
}

function Dashboard({ data, onNavigate }: { data: PlatformData; onNavigate: (target: string) => void }) {
  const membership = data.memberships.find((item) => item.userId === data.currentUserId);
  if (!data.selectedOrganization) return <><PageHeader eyebrow="Dashboard" title="Your delivery workspace" description="Create an organization to begin coordinating projects and access." /><CreateOrganization onCreated={data.refresh} /></>;
  return <><PageHeader eyebrow="Dashboard" title={`Good to see you in ${data.selectedOrganization.name}`} description="A focused view of the organizations and delivery projects you can access." action={<OrganizationPicker data={data} onNavigate={onNavigate} />} /><div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]"><OrganizationSummary organization={data.selectedOrganization} membership={membership} /><Card><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Accessible projects</p><p className="mt-2 text-4xl font-semibold text-slate-50">{data.projects.length}</p></div><FolderKanban className="text-cyan-300" size={28} /></div><Button className="mt-6" variant="outline" size="sm" onClick={() => onNavigate('/projects')}>View projects <ArrowRight size={15} /></Button></Card></div><section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-semibold">Recent projects</h2><button className="bw-focus text-sm text-cyan-300" onClick={() => onNavigate('/projects')}>Open all</button></div>{data.projects.length ? <div className="grid gap-4 md:grid-cols-2">{data.projects.slice(0, 4).map((project) => <ProjectCard key={project.id} project={project} onOpen={() => onNavigate(`/projects/${project.id}`)} />)}</div> : <EmptyState title="No projects yet" message="Projects will appear here when your organization starts a delivery engagement." />}</section></>;
}

function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return <Card interactive className="cursor-pointer" onClick={onOpen}><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{project.slug}</p><h3 className="mt-2 text-lg font-semibold text-slate-50">{project.name}</h3></div><Badge tone={statusTone(project.status)}>{project.status}</Badge></div><p className="mt-4 text-sm text-slate-400">{project.description || 'No project description yet.'}</p><div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{project.deliveryStage.replace(/_/g, ' ')}</span><ArrowRight size={15} /></div></Card>;
}

function OrganizationsPage({ data, onNavigate }: { data: PlatformData; onNavigate: (target: string) => void }) {
  return <><PageHeader eyebrow="Organizations" title="Your organizations" description="Manage the workspaces connected to your authenticated identity." />{data.organizations.length ? <div className="grid gap-5 lg:grid-cols-2">{data.organizations.map((organization) => <Card key={organization.id} interactive className="cursor-pointer" onClick={() => onNavigate(`/organizations/${organization.id}`)}><div className="flex items-start justify-between gap-3"><div><h2 className="text-xl font-semibold text-slate-50">{organization.name}</h2><p className="mt-2 text-sm text-slate-400">Organization workspace</p></div><Badge tone={statusTone(organization.status)}>{organization.status}</Badge></div><div className="mt-6 flex items-center justify-between text-sm text-cyan-300">Open organization <ArrowRight size={16} /></div></Card>)}</div> : <CreateOrganization onCreated={data.refresh} />}</>;
}

function OrganizationManagement({ data, onNavigate, section }: { data: PlatformData; onNavigate: (target: string) => void; section?: 'members' | 'invitations' }) {
  const organization = data.selectedOrganization;
  const currentMembership = data.memberships.find((item) => item.userId === data.currentUserId);
  const canManage = currentMembership?.role === 'OWNER' || currentMembership?.role === 'ADMIN';
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER'>('MEMBER');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  if (!organization) return <ErrorState title="Organization access unavailable" message="This organization does not exist in your accessible context, or your membership is not active." />;
  const invite = async (event: FormEvent) => {
    event.preventDefault();
    if (!canManage) return;
    if (!inviteEmail.includes('@')) return setError('Enter a valid invitee email.');
    setError(null); setMessage(null); setSaving(true);
    const result = await createOrganizationInvitation({ organizationId: organization.id, email: inviteEmail, role: inviteRole, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() });
    setSaving(false);
    if (result.error) return setError(result.error.message);
    setInviteEmail(''); setMessage('Invitation created. Delivery is handled outside this client surface; no token is displayed.');
    await data.refresh();
  };
  const changeMember = async (membership: OrganizationMembership, role: OrganizationRole, status: OrganizationMembership['status']) => {
    setError(null);
    const result = await updateOrganizationMembership({ membershipId: membership.id, role, status });
    if (result.error) setError(result.error.message); else await data.refresh();
  };
  const revoke = async (invitation: OrganizationInvitation) => {
    setError(null);
    const result = await revokeOrganizationInvitation(invitation.id);
    if (result.error) setError(result.error.message); else await data.refresh();
  };
  return <><PageHeader eyebrow="Organization" title={organization.name} description="Membership and invitation access are enforced by the deployed authorization boundary." action={<OrganizationPicker data={data} onNavigate={onNavigate} />} /><div className="mb-6 flex flex-wrap gap-2"><Button size="sm" variant={section !== 'members' && section !== 'invitations' ? 'primary' : 'outline'} onClick={() => onNavigate(`/organizations/${organization.id}`)}>Overview</Button><Button size="sm" variant={section === 'members' ? 'primary' : 'outline'} onClick={() => onNavigate(`/organizations/${organization.id}/members`)}><Users size={15} /> Members</Button><Button size="sm" variant={section === 'invitations' ? 'primary' : 'outline'} onClick={() => onNavigate(`/organizations/${organization.id}/invitations`)}>Invitations</Button></div><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Members</h2><p className="mt-1 text-sm text-slate-400">{data.memberships.length} membership records</p></div><ShieldCheck className="text-cyan-300" size={23} /></div><div className="mt-5 space-y-3">{data.memberships.length ? data.memberships.map((membership) => <div key={membership.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-medium text-slate-100">{membership.userId === organization.ownerId ? 'Organization owner' : membership.userId}</p><div className="mt-2 flex gap-2"><Badge tone={roleTone(membership.role)}>{membership.role}</Badge><Badge tone={statusTone(membership.status)}>{membership.status}</Badge></div></div>{canManage && membership.userId !== organization.ownerId ? <div className="flex gap-2"><select className={`${fieldClass} w-auto`} value={membership.role} onChange={(event) => changeMember(membership, event.target.value as OrganizationRole, membership.status)}><option value="ADMIN">ADMIN</option><option value="MEMBER">MEMBER</option></select><select className={`${fieldClass} w-auto`} value={membership.status} onChange={(event) => changeMember(membership, membership.role, event.target.value as OrganizationMembership['status'])}><option value="ACTIVE">ACTIVE</option><option value="SUSPENDED">SUSPENDED</option><option value="REMOVED">REMOVED</option></select></div> : null}</div></div>) : <EmptyState title="No members yet" message="Your owner membership will appear here after organization creation." />}</div></Card><Card><h2 className="text-xl font-semibold">Invitations</h2><p className="mt-1 text-sm text-slate-400">Invitees receive access only after verified acceptance.</p>{canManage ? <form onSubmit={invite} className="mt-5 space-y-4"><TextField label="Invitee email" type="email" value={inviteEmail} onChange={(event) => setInviteEmail(event.target.value)} placeholder="teammate@example.com" /><label className="block"><span className="mb-2 block text-sm font-medium text-slate-200">Organization role</span><select className={fieldClass} value={inviteRole} onChange={(event) => setInviteRole(event.target.value as 'ADMIN' | 'MEMBER')}><option value="MEMBER">MEMBER</option><option value="ADMIN">ADMIN</option></select></label>{error ? <Alert title="Invitation failed" tone="danger">{error}</Alert> : null}{message ? <Alert title="Invitation created" tone="success">{message}</Alert> : null}<Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create invitation'} <Plus size={16} /></Button></form> : <p className="mt-5 text-sm text-slate-400">Only organization owners and admins can create or revoke invitations.</p>}<div className="mt-6 space-y-3">{data.invitations.map((invitation) => <div key={invitation.id} className="rounded-xl border border-slate-800 p-3"><div className="flex items-center justify-between gap-3"><div><p className="text-sm text-slate-100">{invitation.inviteeEmail}</p><p className="mt-1 text-xs text-slate-500">{invitation.role} · expires {new Date(invitation.expiresAt).toLocaleDateString()}</p></div><div className="flex items-center gap-2"><Badge tone={statusTone(invitation.status)}>{invitation.status}</Badge>{canManage && invitation.status === 'PENDING' ? <button className="bw-focus rounded px-2 py-1 text-xs text-rose-300" onClick={() => revoke(invitation)}>Revoke</button> : null}</div></div></div>)}</div></Card></div>{error && !canManage ? <div className="mt-5"><ErrorState title="Request failed" message={error} /></div> : null}</>;
}

function ProjectsPage({ data, onNavigate }: { data: PlatformData; onNavigate: (target: string) => void }) {
  const organization = data.selectedOrganization;
  const membership = data.memberships.find((item) => item.userId === data.currentUserId);
  const canCreate = membership?.role === 'OWNER' || membership?.role === 'ADMIN';
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!organization || !canCreate) return;
    const cleanName = name.trim();
    const cleanSlug = slug.trim().toLowerCase();
    if (cleanName.length < 2 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug)) return setError('Use a project name and a lowercase slug such as northstar-launch.');
    setSaving(true); setError(null);
    const result = await createProject({ organizationId: organization.id, name: cleanName, slug: cleanSlug, description: description.trim() || null });
    setSaving(false);
    if (result.error) return setError(result.error.message);
    setName(''); setSlug(''); setDescription(''); await data.refresh();
  };
  if (!organization) return <><PageHeader eyebrow="Projects" title="Project workspace" description="Select or create an organization before opening projects." /><CreateOrganization onCreated={data.refresh} /></>;
  return <><PageHeader eyebrow="Projects" title="Delivery projects" description="Projects follow the BlockWaveLab delivery lifecycle from implementation through handover." action={<OrganizationPicker data={data} onNavigate={onNavigate} />} /><div className="grid gap-6 xl:grid-cols-[1fr_0.8fr]"><section>{data.projects.length ? <div className="grid gap-4 md:grid-cols-2">{data.projects.map((project) => <ProjectCard key={project.id} project={project} onOpen={() => onNavigate(`/projects/${project.id}`)} />)}</div> : <EmptyState title="No projects in this organization" message="Create a project when your organization is ready to define a delivery workspace." />}</section>{canCreate ? <Card><h2 className="text-xl font-semibold">Create project</h2><p className="mt-1 text-sm text-slate-400">Project access is still enforced by organization and project membership.</p><form onSubmit={submit} className="mt-5 space-y-4"><TextField label="Project name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Northstar launch" /><TextField label="Project slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="northstar-launch" /><TextAreaField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What is this delivery workspace for?" />{error ? <Alert title="Project could not be created" tone="danger">{error}</Alert> : null}<Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create project'} <Plus size={16} /></Button></form></Card> : <EmptyState title="Project creation is restricted" message="Only active organization owners and admins can create projects." />}</div></>;
}

function ProjectServicesPanel({ project, canManage, data }: { project: Project; canManage: boolean; data?: PlatformData }) {
  const commercialData = data ?? latestPlatformData;
  const [pillars, setPillars] = useState<CatalogPillar[]>([]);
  const [services, setServices] = useState<CatalogService[]>([]);
  const [offerings, setOfferings] = useState<ServiceOffering[]>([]);
  const [selectedServices, setSelectedServices] = useState<ProjectService[]>([]);
  const [selectedOfferingId, setSelectedOfferingId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    const [pillarResult, serviceResult, offeringResult, selectionResult] = await Promise.all([
      listCatalogPillars(),
      listCatalogServices(),
      listServiceOfferings(),
      listProjectServices(project.id),
    ]);
    const firstError = pillarResult.error ?? serviceResult.error ?? offeringResult.error ?? selectionResult.error;
    if (firstError) setError(firstError.message);
    setPillars(pillarResult.pillars);
    setServices(serviceResult.services);
    setOfferings(offeringResult.offerings);
    setSelectedServices(selectionResult.services);
    setIsLoading(false);
  }, [project.id]);

  useEffect(() => { void load(); }, [load]);

  const selectedOfferingIds = new Set(selectedServices.map((item) => item.offeringId));
  const selectOffering = async () => {
    if (!selectedOfferingId || !canManage) return;
    setError(null);
    setIsSelecting(true);
    const result = await selectProjectService({ projectId: project.id, offeringId: selectedOfferingId });
    setIsSelecting(false);
    if (result.error) setError(result.error.message);
    else await load();
  };

  return <><Card className="xl:col-span-2">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Service selection</p>
        <h2 className="mt-2 text-xl font-semibold">Project services</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">Request an available service offering for this project. This does not approve a proposal, complete payment, grant entitlement, or activate delivery.</p>
      </div>
      <Badge tone="info">REQUESTED only</Badge>
    </div>
    {isLoading ? <div className="mt-5"><LoadingState label="Loading available services…" /></div> : <>
      {canManage && offerings.length ? <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1"><span className="mb-2 block text-sm font-medium text-slate-200">Available offering</span><select className={fieldClass} value={selectedOfferingId} onChange={(event) => setSelectedOfferingId(event.target.value)}><option value="">Choose an active offering</option>{offerings.filter((offering) => !selectedOfferingIds.has(offering.id)).map((offering) => { const service = services.find((item) => item.id === offering.serviceId); const pillar = pillars.find((item) => item.id === service?.pillarId); return <option key={offering.id} value={offering.id}>{pillar?.code ?? 'PILLAR'} · {service?.name ?? 'Service'} · {offering.name}</option>; })}</select></label>
        <Button disabled={!selectedOfferingId || isSelecting} onClick={selectOffering}>{isSelecting ? 'Requesting…' : 'Request service'} <Plus size={16} /></Button>
      </div> : null}
      {error ? <div className="mt-4"><Alert title="Service selection unavailable" tone="danger">{error}</Alert></div> : null}
      {selectedServices.length ? <div className="mt-6 grid gap-3 md:grid-cols-2">{selectedServices.map((selection) => { const offering = offerings.find((item) => item.id === selection.offeringId); const service = services.find((item) => item.id === offering?.serviceId); const pillar = pillars.find((item) => item.id === service?.pillarId); return <div key={selection.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{pillar?.code ?? 'SERVICE'}</p><h3 className="mt-1 font-semibold text-slate-100">{service?.name ?? 'Selected service'}</h3><p className="mt-1 text-sm text-slate-400">{offering?.name ?? 'Offering'}</p></div><Badge tone={statusTone(selection.status)}>{selection.status}</Badge></div><p className="mt-3 text-xs text-slate-500">Selection only. Commercial approval and delivery activation are separate future steps.</p></div>; })}</div> : <EmptyState title="No services selected" message={canManage ? 'Choose an active offering to request the first service for this project.' : 'No project services have been requested for this project.'} />}
    </>}
  </Card>{commercialData ? <><CommercialPanel project={project} data={commercialData} /><PaymentObligationPanel project={project} data={commercialData} /><EntitlementPanel project={project} /><DeliveryActivationPanel project={project} /><ImplementationPanel project={project} /><DeploymentPanel project={project} /><ObservationPanel project={project} /><StabilizationPanel project={project} /><HandoverPanel project={project} /><OngoingServicePanel project={project} /></> : null}</>;
}

function CommercialPanel({ project, data }: { project: Project; data: PlatformData }) {
  const membership = data.memberships.find((item) => item.userId === data.currentUserId);
  const canManage = membership?.role === 'OWNER';
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [versions, setVersions] = useState<ProposalVersion[]>([]);
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [agreementVersions, setAgreementVersions] = useState<AgreementVersion[]>([]);
  const [selectedProposalId, setSelectedProposalId] = useState('');
  const [selectedAgreementId, setSelectedAgreementId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [proposalResult, agreementResult] = await Promise.all([
      listProposals(project.organizationId, project.id),
      listAgreements(project.organizationId, project.id),
    ]);
    const firstError = proposalResult.error ?? agreementResult.error;
    if (firstError) setError(firstError.message);
    setProposals(proposalResult.proposals);
    setAgreements(agreementResult.agreements);
    setSelectedProposalId((current) => current || proposalResult.proposals[0]?.id || '');
    setSelectedAgreementId((current) => current || agreementResult.agreements[0]?.id || '');
  }, [project.id, project.organizationId]);

  const loadProposal = useCallback(async () => {
    if (!selectedProposalId) { setVersions([]); setItems([]); return; }
    const versionResult = await listProposalVersions(selectedProposalId);
    const currentVersion = versionResult.versions[0];
    const itemResult = currentVersion ? await listProposalItems(currentVersion.id) : { items: [], error: null };
    setVersions(versionResult.versions);
    setItems(itemResult.items);
    if (versionResult.error || itemResult.error) setError(versionResult.error?.message ?? itemResult.error?.message ?? null);
  }, [selectedProposalId]);

  const loadAgreement = useCallback(async () => {
    if (!selectedAgreementId) { setAgreementVersions([]); return; }
    const result = await listAgreementVersions(selectedAgreementId);
    setAgreementVersions(result.versions);
    if (result.error) setError(result.error.message);
  }, [selectedAgreementId]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { void loadProposal(); }, [loadProposal]);
  useEffect(() => { void loadAgreement(); }, [loadAgreement]);

  const createAndIssue = async () => {
    if (!canManage) return;
    setSaving(true); setError(null); setMessage(null);
    const proposalResult = await createProposal({ organizationId: project.organizationId, projectId: project.id });
    if (proposalResult.error || !proposalResult.proposal) { setSaving(false); setError(proposalResult.error?.message ?? 'Proposal could not be created.'); return; }
    const serviceResult = await listProjectServices(project.id);
    if (serviceResult.error) { setSaving(false); setError(serviceResult.error.message); return; }
    const versionResult = await createProposalVersion({
      proposalId: proposalResult.proposal.id,
      contentChecksum: `proposal-${crypto.randomUUID()}`,
      scopeSnapshot: { project_id: project.id, source: 'project_services' },
      commercialSnapshot: { currency: 'USD', pricing_mode: 'PROPOSAL_BASED' },
      items: serviceResult.services.map((service, index) => ({ project_service_id: service.id, scope_snapshot: service.requestedScope, commercial_snapshot: {}, sort_order: index })),
    });
    if (versionResult.error || !versionResult.version) { setSaving(false); setError(versionResult.error?.message ?? 'Proposal version could not be created.'); return; }
    const issueResult = await issueProposal(proposalResult.proposal.id, versionResult.version.versionNumber);
    setSaving(false);
    if (issueResult.error) { setError(issueResult.error.message); return; }
    setSelectedProposalId(proposalResult.proposal.id); setMessage('Issued proposal created from the current requested services. No payment or delivery activation occurred.'); await load();
  };

  const acceptCurrentProposal = async () => {
    const proposal = proposals.find((item) => item.id === selectedProposalId);
    const version = versions[0];
    if (!proposal || !version || !canManage) return;
    setSaving(true); setError(null); setMessage(null);
    const result = await acceptProposal(proposal.id, version.versionNumber);
    setSaving(false);
    if (result.error) setError(result.error.message); else { setMessage('Proposal version accepted. Payment, entitlement, and delivery remain separate.'); await load(); await loadProposal(); }
  };

  const createAgreementRecord = async () => {
    const proposal = proposals.find((item) => item.id === selectedProposalId);
    const version = versions[0];
    if (!proposal || proposal.status !== 'ACCEPTED' || !version || !canManage) return;
    setSaving(true); setError(null); setMessage(null);
    const agreementResult = await createAgreement({ organizationId: project.organizationId, projectId: project.id, proposalId: proposal.id, sourceProposalVersionId: version.id, termsSnapshot: { source: 'accepted_proposal_version', proposal_version_id: version.id }, contentChecksum: `terms-${crypto.randomUUID()}` });
    if (agreementResult.error || !agreementResult.agreement) { setSaving(false); setError(agreementResult.error?.message ?? 'Agreement could not be created.'); return; }
    const versionResult = await createAgreementVersion({ agreementId: agreementResult.agreement.id, termsSnapshot: { source: 'accepted_proposal_version', proposal_version_id: version.id }, contentChecksum: `terms-${crypto.randomUUID()}` });
    setSaving(false);
    if (versionResult.error) { setError(versionResult.error.message); return; }
    setSelectedAgreementId(agreementResult.agreement.id); setMessage('Agreement draft created from the accepted proposal. It is not payment or delivery activation.'); await load();
  };

  const acceptCurrentAgreement = async () => {
    const agreement = agreements.find((item) => item.id === selectedAgreementId);
    const version = agreementVersions[0];
    if (!agreement || !version || !canManage) return;
    setSaving(true); setError(null); setMessage(null);
    const result = await acceptAgreement({ agreementId: agreement.id, agreementVersionId: version.id, idempotencyKey: `accept-${agreement.id}-${version.id}` });
    setSaving(false);
    if (result.error) setError(result.error.message); else { setMessage('Agreement acceptance recorded. Payment, entitlement, and delivery remain separate.'); await load(); await loadAgreement(); }
  };

  const currentProposal = proposals.find((item) => item.id === selectedProposalId);
  const currentAgreement = agreements.find((item) => item.id === selectedAgreementId);
  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Commercial foundation</p><h2 className="mt-2 text-xl font-semibold">Proposals and agreements</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Scope-based proposal snapshots use USD as the approved primary currency context without inventing prices. Acceptance does not create payment, entitlement, or delivery activation.</p></div><FileText className="text-cyan-300" size={24} /></div>{canManage ? <Button className="mt-5" onClick={createAndIssue} disabled={saving}>{saving ? 'Working…' : 'Create and issue proposal'} <Plus size={16} /></Button> : <p className="mt-5 text-sm text-slate-500">Only the organization owner can perform commercial acceptance actions.</p>}{error ? <div className="mt-4"><Alert title="Commercial action unavailable" tone="danger">{error}</Alert></div> : null}{message ? <div className="mt-4"><Alert title="Commercial state updated" tone="success">{message}</Alert></div> : null}<div className="mt-6 grid gap-5 lg:grid-cols-2"><div className="rounded-xl border border-slate-800 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Proposal</h3><Badge tone={statusTone(currentProposal?.status ?? 'DRAFT')}>{currentProposal?.status ?? 'NONE'}</Badge></div>{proposals.length ? <select className={`${fieldClass} mt-4`} value={selectedProposalId} onChange={(event) => setSelectedProposalId(event.target.value)}>{proposals.map((proposal) => <option key={proposal.id} value={proposal.id}>{proposal.id.slice(0, 8)} · {proposal.status}</option>)}</select> : <p className="mt-4 text-sm text-slate-500">No proposals for this project.</p>}{versions[0] ? <><p className="mt-4 text-sm text-slate-300">Version {versions[0].versionNumber} · immutable snapshot · {versions[0].currency}</p><p className="mt-2 text-xs text-slate-500">{items.length} service item(s); prices and taxes are not defined.</p>{canManage && currentProposal?.status === 'SENT' ? <Button className="mt-4" size="sm" variant="outline" onClick={acceptCurrentProposal} disabled={saving}><CheckCircle2 size={15} /> Accept version</Button> : null}</> : null}</div><div className="rounded-xl border border-slate-800 p-4"><div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Agreement</h3><Badge tone={statusTone(currentAgreement?.status ?? 'DRAFT')}>{currentAgreement?.status ?? 'NONE'}</Badge></div>{agreements.length ? <select className={`${fieldClass} mt-4`} value={selectedAgreementId} onChange={(event) => setSelectedAgreementId(event.target.value)}>{agreements.map((agreement) => <option key={agreement.id} value={agreement.id}>{agreement.id.slice(0, 8)} · {agreement.status}</option>)}</select> : <p className="mt-4 text-sm text-slate-500">No agreement records for this project.</p>}{currentProposal?.status === 'ACCEPTED' && !agreements.some((item) => item.sourceProposalVersionId === currentProposal.currentVersionId) && canManage ? <Button className="mt-4" size="sm" variant="outline" onClick={createAgreementRecord} disabled={saving}>Create agreement version</Button> : null}{agreementVersions[0] ? <><p className="mt-4 text-sm text-slate-300">Version {agreementVersions[0].versionNumber} · checksum recorded</p>{canManage && currentAgreement?.status !== 'ACTIVE' ? <Button className="mt-4" size="sm" variant="outline" onClick={acceptCurrentAgreement} disabled={saving}><CheckCircle2 size={15} /> Accept agreement</Button> : null}</> : null}</div></div></Card>;
}

function PaymentObligationPanel({ project, data }: { project: Project; data: PlatformData }) {
  const membership = data.memberships.find((item) => item.userId === data.currentUserId);
  const canManage = membership?.role === 'OWNER';
  const [obligations, setObligations] = useState<PaymentObligation[]>([]);
  const [attempts, setAttempts] = useState<PaymentAttempt[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const result = await listPaymentObligations(project.organizationId, project.id);
    if (result.error) { setError(result.error.message); return; }
    const attemptResults = await Promise.all(result.obligations.map((obligation) => listPaymentAttempts(obligation.id)));
    const attemptError = attemptResults.find((item) => item.error)?.error;
    if (attemptError) setError(attemptError.message);
    else { setError(null); setObligations(result.obligations); setAttempts(attemptResults.flatMap((item) => item.attempts)); }
  }, [project.id, project.organizationId]);

  useEffect(() => { void load(); }, [load]);

  const cancel = async (obligation: PaymentObligation) => {
    if (!canManage || obligation.status !== 'PENDING') return;
    setCancellingId(obligation.id);
    const result = await cancelPaymentObligation(obligation.id);
    setCancellingId(null);
    if (result.error) setError(result.error.message);
    else await load();
  };

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Payment obligations</p><h2 className="mt-2 text-xl font-semibold">Server-authoritative obligations</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">These records preserve approved commercial amounts and sources. They do not process payment, prove settlement, grant entitlement, or activate delivery.</p></div><Badge tone="info">No checkout</Badge></div>{error ? <div className="mt-4"><Alert title="Payment obligations unavailable" tone="danger">{error}</Alert></div> : null}{obligations.length ? <div className="mt-6 space-y-3">{obligations.map((obligation) => <div key={obligation.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{obligation.paymentPurpose.replace('_', ' ')}</p><p className="mt-1 text-sm text-slate-200">{obligation.scheduleType} · USD minor units: {obligation.amountMinor}</p><p className="mt-1 text-xs text-slate-500">Source {obligation.proposalVersionId.slice(0, 8)} · {obligation.agreementVersionId ? `agreement ${obligation.agreementVersionId.slice(0, 8)}` : 'proposal source only'}</p></div><Badge tone={statusTone(obligation.status)}>{obligation.status}</Badge></div>{canManage && obligation.status === 'PENDING' ? <Button className="mt-3" variant="outline" onClick={() => cancel(obligation)} disabled={cancellingId === obligation.id}>{cancellingId === obligation.id ? 'Cancelling…' : 'Cancel obligation'}</Button> : null}<div className="mt-4 border-t border-slate-800 pt-3"><p className="text-xs uppercase tracking-wide text-slate-500">Payment attempts</p>{attempts.filter((attempt) => attempt.paymentObligationId === obligation.id).length ? <div className="mt-2 space-y-2">{attempts.filter((attempt) => attempt.paymentObligationId === obligation.id).map((attempt) => <div key={attempt.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800/80 p-3"><div><p className="text-sm text-slate-200">{attempt.id.slice(0, 8)} · {attempt.currency} minor units: {attempt.amountMinor}</p><p className="mt-1 text-xs text-slate-500">Created {new Date(attempt.createdAt).toLocaleString()}{attempt.statusReason ? ` · ${attempt.statusReason}` : ''}</p></div><Badge tone={statusTone(attempt.status)}>{attempt.status}</Badge></div>)}</div> : <p className="mt-2 text-xs text-slate-500">No payment attempts recorded.</p>}</div></div>)}</div> : <EmptyState title="No payment obligations" message="Payment obligations appear here only after a trusted server-side operation creates them from an accepted commercial source." />}</Card>;
}

function EntitlementPanel({ project }: { project: Project }) {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectEntitlements(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setEntitlements(result.entitlements);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Entitlements</p><h2 className="mt-2 text-xl font-semibold">Authorized service access</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Entitlements represent a future validated right to receive a scoped service. They do not start delivery, implementation, deployment, observation, or ongoing service.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Entitlements unavailable" tone="danger">{error}</Alert></div> : null}{entitlements.length ? <div className="mt-6 space-y-3">{entitlements.map((entitlement) => <div key={entitlement.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{entitlement.id.slice(0, 8)} · service {entitlement.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Source obligation {entitlement.paymentObligationId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">Starts {new Date(entitlement.startsAt).toLocaleString()}{entitlement.endsAt ? ` · Ends ${new Date(entitlement.endsAt).toLocaleString()}` : ' · No end recorded'}</p><p className="mt-1 text-xs text-slate-500">Created {new Date(entitlement.createdAt).toLocaleString()} · {entitlement.activationReference}</p></div><Badge tone={statusTone(entitlement.status)}>{entitlement.status}</Badge></div>{entitlement.statusReason ? <p className="mt-3 text-xs text-slate-400">{entitlement.statusReason}</p> : null}</div>)}</div> : <EmptyState title="No entitlements" message="No validated commercial event has created an entitlement for this project." />}</Card>;
}

function DeliveryActivationPanel({ project }: { project: Project }) {
  const [activations, setActivations] = useState<DeliveryActivation[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectDeliveryActivations(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setActivations(result.activations);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Delivery activation</p><h2 className="mt-2 text-xl font-semibold">Delivery lifecycle admission</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Activation admits an active entitlement into delivery. It does not mean payment settlement, deployment, observation completion, handover, or ongoing service.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Delivery activations unavailable" tone="danger">{error}</Alert></div> : null}{activations.length ? <div className="mt-6 space-y-3">{activations.map((activation) => <div key={activation.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{activation.id.slice(0, 8)} · service {activation.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Entitlement {activation.entitlementId.slice(0, 8)} · {activation.deliveryStage}</p><p className="mt-1 text-xs text-slate-500">Activated {new Date(activation.activatedAt).toLocaleString()}{activation.completedAt ? ` · Completed ${new Date(activation.completedAt).toLocaleString()}` : ''}</p><p className="mt-1 text-xs text-slate-500">{activation.activationReference}{activation.statusReason ? ` · ${activation.statusReason}` : ''}</p></div><Badge tone={statusTone(activation.status)}>{activation.status}</Badge></div></div>)}</div> : <EmptyState title="No delivery activations" message="No active entitlement has been admitted into this project's delivery lifecycle." />}</Card>;
}

function ImplementationPanel({ project }: { project: Project }) {
  const [records, setRecords] = useState<ImplementationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectImplementationRecords(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setRecords(result.records);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Implementation</p><h2 className="mt-2 text-xl font-semibold">Implementation workspace</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Implementation records represent work after delivery activation. This view is read-only and does not start infrastructure work or advance later delivery stages.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Implementation records unavailable" tone="danger">{error}</Alert></div> : null}{records.length ? <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)} · service {record.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Activation {record.deliveryActivationId.slice(0, 8)} · Entitlement {record.entitlementId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{record.implementationReference} · Started {new Date(record.startedAt).toLocaleString()}{record.completedAt ? ` · Completed ${new Date(record.completedAt).toLocaleString()}` : ''}</p></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div>{record.statusReason ? <p className="mt-3 text-xs text-slate-400">{record.statusReason}</p> : null}</div>)}</div> : <EmptyState title="Implementation not initialized" message="No trusted implementation workspace has been initialized for this project." />}</Card>;
}

function DeploymentPanel({ project }: { project: Project }) {
  const [records, setRecords] = useState<DeploymentRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectDeploymentRecords(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setRecords(result.records);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Deployment</p><h2 className="mt-2 text-xl font-semibold">Deployment foundation</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Deployment records represent a future deployment state after implementation. This view is read-only and does not execute infrastructure or provider actions.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Deployment records unavailable" tone="danger">{error}</Alert></div> : null}{records.length ? <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)} · service {record.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Implementation {record.implementationRecordId.slice(0, 8)} · Activation {record.deliveryActivationId.slice(0, 8)} · Entitlement {record.entitlementId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{record.deploymentReference} · Started {new Date(record.startedAt).toLocaleString()}{record.completedAt ? ` · Completed ${new Date(record.completedAt).toLocaleString()}` : ''}</p></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div>{record.statusReason ? <p className="mt-3 text-xs text-slate-400">{record.statusReason}</p> : null}</div>)}</div> : <EmptyState title="No deployment records" message="Deployment has not been initialized for this project." />}</Card>;
}

function ObservationPanel({ project }: { project: Project }) {
  const [records, setRecords] = useState<ObservationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectObservationRecords(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setRecords(result.records);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Observation</p><h2 className="mt-2 text-xl font-semibold">Paid implementation observation</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Observation is a downstream implementation stage after active deployment. This view is read-only and does not create monitoring, timers, or stabilization automation.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Observation records unavailable" tone="danger">{error}</Alert></div> : null}{records.length ? <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)} · service {record.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Deployment {record.deploymentRecordId.slice(0, 8)} · Implementation {record.implementationRecordId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{record.observationReference} · Started {new Date(record.startedAt).toLocaleString()}{record.completedAt ? ` · Completed ${new Date(record.completedAt).toLocaleString()}` : ''}</p></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div>{record.statusReason ? <p className="mt-3 text-xs text-slate-400">{record.statusReason}</p> : null}</div>)}</div> : <EmptyState title="No observation records" message="Observation has not been initialized for this project." />}</Card>;
}

function StabilizationPanel({ project }: { project: Project }) {
  const [records, setRecords] = useState<StabilizationRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectStabilizationRecords(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setRecords(result.records);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Stabilization</p><h2 className="mt-2 text-xl font-semibold">Paid implementation stabilization</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Stabilization is downstream of active observation within the paid implementation lifecycle. This view is read-only and does not add monitoring, remediation, or handover automation.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Stabilization records unavailable" tone="danger">{error}</Alert></div> : null}{records.length ? <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)} · service {record.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Observation {record.observationRecordId.slice(0, 8)} · Deployment {record.deploymentRecordId.slice(0, 8)} · Implementation {record.implementationRecordId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{record.stabilizationReference} · Started {new Date(record.startedAt).toLocaleString()}{record.completedAt ? ` · Completed ${new Date(record.completedAt).toLocaleString()}` : ''}</p></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div>{record.statusReason ? <p className="mt-3 text-xs text-slate-400">{record.statusReason}</p> : null}</div>)}</div> : <EmptyState title="No stabilization records" message="Stabilization has not been initialized for this project." />}</Card>;
}

function HandoverPanel({ project }: { project: Project }) {
  const [records, setRecords] = useState<HandoverRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void listProjectHandoverRecords(project.id).then((result) => {
      if (cancelled) return;
      if (result.error) setError(result.error.message);
      else setRecords(result.records);
    });
    return () => { cancelled = true; };
  }, [project.id]);

  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Handover</p><h2 className="mt-2 text-xl font-semibold">Handover foundation</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Handover is the downstream implementation lifecycle boundary after active documentation. This view is read-only and does not transfer files, signatures, credentials, or infrastructure ownership.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Handover records unavailable" tone="danger">{error}</Alert></div> : null}{records.length ? <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)} · service {record.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Documentation {record.documentationRecordId.slice(0, 8)} · Stabilization {record.stabilizationRecordId.slice(0, 8)} · Observation {record.observationRecordId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{record.handoverReference} · Started {new Date(record.startedAt).toLocaleString()}{record.completedAt ? ` · Completed ${new Date(record.completedAt).toLocaleString()}` : ''}</p></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div>{record.statusReason ? <p className="mt-3 text-xs text-slate-400">{record.statusReason}</p> : null}</div>)}</div> : <EmptyState title="No handover records" message="Handover has not been initialized for this project." />}</Card>;
}

function OngoingServicePanel({ project }: { project: Project }) {
  const [records, setRecords] = useState<OngoingServiceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { let cancelled = false; void listProjectOngoingServiceRecords(project.id).then((result) => { if (cancelled) return; if (result.error) setError(result.error.message); else setRecords(result.records); }); return () => { cancelled = true; }; }, [project.id]);
  return <Card className="xl:col-span-2"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Ongoing service</p><h2 className="mt-2 text-xl font-semibold">Optional post-handover service</h2><p className="mt-2 max-w-3xl text-sm text-slate-400">Ongoing service is optional and separately paid. This read-only foundation does not execute billing, subscriptions, or payment collection.</p></div><Badge tone="info">Read only</Badge></div>{error ? <div className="mt-4"><Alert title="Ongoing service records unavailable" tone="danger">{error}</Alert></div> : null}{records.length ? <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)} · service {record.projectServiceId.slice(0, 8)}</p><p className="mt-1 text-sm text-slate-200">Handover {record.handoverRecordId.slice(0, 8)} · Entitlement {record.entitlementId.slice(0, 8)}</p><p className="mt-1 text-xs text-slate-500">{record.ongoingServiceReference} · {record.billingMode} · Started {new Date(record.startedAt).toLocaleString()}</p></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div>{record.statusReason ? <p className="mt-3 text-xs text-slate-400">{record.statusReason}</p> : null}</div>)}</div> : <EmptyState title="No ongoing service records" message="Optional ongoing service has not been initialized after handover." />}</Card>;
}

function CommercialRecordsPage({ data, onNavigate, kind, resourceId }: { data: PlatformData; onNavigate: (target: string) => void; kind: 'proposal' | 'agreement'; resourceId?: string }) {
  const organization = data.selectedOrganization;
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalVersions, setProposalVersions] = useState<ProposalVersion[]>([]);
  const [proposalItems, setProposalItems] = useState<ProposalItem[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [agreementVersions, setAgreementVersions] = useState<AgreementVersion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!organization) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const [proposalResult, agreementResult] = await Promise.all([
        listProposals(organization.id),
        listAgreements(organization.id),
      ]);
      if (cancelled) return;
      const firstError = proposalResult.error ?? agreementResult.error;
      if (firstError) setError(firstError.message);
      setProposals(proposalResult.proposals);
      setAgreements(agreementResult.agreements);
      if (kind === 'proposal' && resourceId) {
        const versionResult = await listProposalVersions(resourceId);
        const itemResult = versionResult.versions[0] ? await listProposalItems(versionResult.versions[0].id) : { items: [], error: null };
        if (cancelled) return;
        setProposalVersions(versionResult.versions);
        setProposalItems(itemResult.items);
        if (versionResult.error || itemResult.error) setError(versionResult.error?.message ?? itemResult.error?.message ?? null);
      }
      if (kind === 'agreement' && resourceId) {
        const versionResult = await listAgreementVersions(resourceId);
        if (cancelled) return;
        setAgreementVersions(versionResult.versions);
        if (versionResult.error) setError(versionResult.error.message);
      }
      setLoading(false);
    };
    void load();
    return () => { cancelled = true; };
  }, [kind, organization, resourceId]);

  if (!organization) return <ErrorState title="Commercial records unavailable" message="Select an organization before opening commercial records." />;
  if (loading) return <LoadingState label="Loading commercial records…" />;
  if (error) return <ErrorState title="Commercial records unavailable" message={error} />;

  const records = kind === 'proposal' ? proposals : agreements;
  const selectedRecord = records.find((record) => record.id === resourceId);
  const title = kind === 'proposal' ? 'Proposals' : 'Agreements';
  const basePath = kind === 'proposal' ? '/proposals' : '/agreements';
  return <><PageHeader eyebrow="Commercial foundation" title={resourceId ? `${title} detail` : title} description="Authenticated commercial records remain separate from payment, entitlement, and delivery activation." action={<OrganizationPicker data={data} onNavigate={onNavigate} />} />{resourceId && !selectedRecord ? <ErrorState title={`${title.slice(0, -1)} not found`} message="This record is unavailable in the selected organization or you do not have access." /> : null}{!resourceId ? <>{records.length ? <div className="grid gap-4 md:grid-cols-2">{records.map((record) => <Card key={record.id} interactive className="cursor-pointer" onClick={() => onNavigate(`${basePath}/${record.id}`)}><div className="flex items-start justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{record.id.slice(0, 8)}</p><h2 className="mt-2 text-lg font-semibold">{kind === 'proposal' ? 'Proposal versioned record' : 'Agreement record'}</h2></div><Badge tone={statusTone(record.status)}>{record.status}</Badge></div><p className="mt-4 text-sm text-slate-400">{record.projectId ? 'Project-scoped commercial record' : 'Organization-scoped commercial record'}</p></Card>)}</div> : <EmptyState title={`No ${title.toLowerCase()} yet`} message="Commercial records will appear here when created through the authenticated project workflow." />}</> : null}{resourceId && selectedRecord && kind === 'proposal' ? <Card><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-cyan-300">Proposal {selectedRecord.id.slice(0, 8)}</p><h2 className="mt-2 text-2xl font-semibold">Immutable proposal history</h2></div><Badge tone={statusTone(selectedRecord.status)}>{selectedRecord.status}</Badge></div><p className="mt-4 text-sm text-slate-400">Currency context: USD. Amounts, tax, and payment state are intentionally not defined.</p><div className="mt-6 space-y-3">{proposalVersions.map((version) => <div key={version.id} className="rounded-xl border border-slate-800 p-4"><div className="flex items-center justify-between"><p className="font-medium">Version {version.versionNumber}</p><Badge>{version.status}</Badge></div><p className="mt-2 text-xs text-slate-500">Checksum {version.contentChecksum} · {proposalItems.length} snapshot item(s)</p></div>)}</div>{selectedRecord.projectId ? <Button className="mt-6" variant="outline" onClick={() => onNavigate(`/projects/${selectedRecord.projectId}`)}>Open project commercial workflow <ArrowRight size={15} /></Button> : null}</Card> : null}{resourceId && selectedRecord && kind === 'agreement' ? <Card><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-cyan-300">Agreement {selectedRecord.id.slice(0, 8)}</p><h2 className="mt-2 text-2xl font-semibold">Agreement history</h2></div><Badge tone={statusTone(selectedRecord.status)}>{selectedRecord.status}</Badge></div><p className="mt-4 text-sm text-slate-400">Acceptance is authenticated and versioned; it does not activate payment, entitlement, or delivery.</p><div className="mt-6 space-y-3">{agreementVersions.map((version) => <div key={version.id} className="rounded-xl border border-slate-800 p-4"><div className="flex items-center justify-between"><p className="font-medium">Version {version.versionNumber}</p><Badge>{version.status}</Badge></div><p className="mt-2 text-xs text-slate-500">Checksum {version.contentChecksum}</p></div>)}</div>{selectedRecord.projectId ? <Button className="mt-6" variant="outline" onClick={() => onNavigate(`/projects/${selectedRecord.projectId}`)}>Open project commercial workflow <ArrowRight size={15} /></Button> : null}</Card> : null}</>;
}

function ProjectDetail({ project, data, onNavigate }: { project: Project; data: PlatformData; onNavigate: (target: string) => void }) {
  const [memberships, setMemberships] = useState<ProjectMembership[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [memberUser, setMemberUser] = useState('');
  const [memberRole, setMemberRole] = useState<ProjectRole>('CONTRIBUTOR');
  const organizationMembership = data.memberships.find((item) => item.userId === data.currentUserId);
  const canManage = organizationMembership?.role === 'OWNER' || organizationMembership?.role === 'ADMIN' || memberships.some((item) => item.userId === organizationMembership?.userId && item.role === 'PROJECT_MANAGER' && item.status === 'ACTIVE');
  const loadMembers = useCallback(async () => { const result = await listProjectMembers(project.id); if (result.error) setError(result.error.message); else setMemberships(result.memberships); }, [project.id]);
  useEffect(() => { void loadMembers(); }, [loadMembers]);
  const addMember = async (event: FormEvent) => { event.preventDefault(); if (!memberUser) return; const result = await addProjectMember({ projectId: project.id, userId: memberUser, role: memberRole }); if (result.error) setError(result.error.message); else { setMemberUser(''); await loadMembers(); } };
  const changeMember = async (membership: ProjectMembership, role: ProjectRole, status: ProjectMembership['status']) => {
    const result = await updateProjectMembership({ membershipId: membership.id, role, status });
    if (result.error) setError(result.error.message); else await loadMembers();
  };
  return <><PageHeader eyebrow="Project" title={project.name} description={project.description || 'Delivery workspace'} action={<Button variant="outline" onClick={() => onNavigate('/projects')}>Back to projects</Button>} /><div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs uppercase tracking-wide text-cyan-300">{project.slug}</p><h2 className="mt-2 text-2xl font-semibold">Project workspace</h2></div><div className="flex gap-2"><Badge tone={statusTone(project.status)}>{project.status}</Badge><Badge>{project.deliveryStage.replace(/_/g, ' ')}</Badge></div></div><div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-slate-800 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Lifecycle</p><p className="mt-2 text-sm text-slate-100">Implementation → Deployment → Observation → Stabilization → Documentation → Handover</p></div><div className="rounded-xl border border-slate-800 p-4"><p className="text-xs uppercase tracking-wide text-slate-500">Access</p><p className="mt-2 text-sm text-slate-100">Organization membership plus project role</p></div></div></Card><Card><div className="flex items-center justify-between"><div><h2 className="text-xl font-semibold">Project members</h2><p className="mt-1 text-sm text-slate-400">{memberships.length} assigned members</p></div><button className="bw-focus rounded-lg p-2 text-cyan-300" aria-label="Open project members" onClick={() => onNavigate(`/projects/${project.id}/members`)}><Users size={19} /></button></div>{canManage ? <form onSubmit={addMember} className="mt-5 space-y-3"><label className="block"><span className="mb-2 block text-sm font-medium text-slate-200">Organization member</span><select className={fieldClass} value={memberUser} onChange={(event) => setMemberUser(event.target.value)}><option value="">Choose a member</option>{data.memberships.filter((item) => item.status === 'ACTIVE').map((item) => <option key={item.userId} value={item.userId}>{item.userId === data.selectedOrganization?.ownerId ? 'Organization owner' : item.userId}</option>)}</select></label><label className="block"><span className="mb-2 block text-sm font-medium text-slate-200">Project role</span><select className={fieldClass} value={memberRole} onChange={(event) => setMemberRole(event.target.value as ProjectRole)}><option value="PROJECT_MANAGER">PROJECT_MANAGER</option><option value="CONTRIBUTOR">CONTRIBUTOR</option><option value="VIEWER">VIEWER</option></select></label><Button type="submit">Add member <Plus size={16} /></Button></form> : null}{error ? <div className="mt-4"><Alert title="Project member request failed" tone="danger">{error}</Alert></div> : null}<div className="mt-5 space-y-2">{memberships.map((membership) => <div key={membership.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 p-3"><div><p className="text-sm text-slate-100">{membership.userId}</p><div className="mt-1 flex gap-2"><Badge tone={roleTone(membership.role)}>{membership.role}</Badge><Badge tone={statusTone(membership.status)}>{membership.status}</Badge></div></div>{canManage ? <div className="flex gap-2"><select className={`${fieldClass} w-auto`} value={membership.role} onChange={(event) => changeMember(membership, event.target.value as ProjectRole, membership.status)}><option value="PROJECT_MANAGER">PROJECT_MANAGER</option><option value="CONTRIBUTOR">CONTRIBUTOR</option><option value="VIEWER">VIEWER</option></select><select className={`${fieldClass} w-auto`} value={membership.status} onChange={(event) => changeMember(membership, membership.role, event.target.value as ProjectMembership['status'])}><option value="ACTIVE">ACTIVE</option><option value="SUSPENDED">SUSPENDED</option><option value="REMOVED">REMOVED</option></select>{membership.status !== 'REMOVED' ? <button className="bw-focus rounded px-2 py-1 text-xs text-rose-300" onClick={async () => { const result = await removeProjectMember(membership.id); if (result.error) setError(result.error.message); else await loadMembers(); }}>Remove</button> : null}</div> : null}</div>)}</div></Card></div><ProjectServicesPanel project={project} canManage={canManage} /></>;
}

function PlatformContent({ route, data, onNavigate }: { route: RouteState; data: PlatformData; onNavigate: (target: string) => void }) {
  if (route.page === 'dashboard') return <Dashboard data={data} onNavigate={onNavigate} />;
  if (route.page === 'organizations') return <OrganizationsPage data={data} onNavigate={onNavigate} />;
  if (route.page === 'organization' || route.page === 'organization-members' || route.page === 'organization-invitations') return <OrganizationManagement data={data} onNavigate={onNavigate} section={route.page === 'organization-members' ? 'members' : route.page === 'organization-invitations' ? 'invitations' : undefined} />;
  if (route.page === 'projects') return <ProjectsPage data={data} onNavigate={onNavigate} />;
  if (route.page === 'proposals' || route.page === 'proposal') return <CommercialRecordsPage data={data} onNavigate={onNavigate} kind="proposal" resourceId={route.resourceId} />;
  if (route.page === 'agreements' || route.page === 'agreement') return <CommercialRecordsPage data={data} onNavigate={onNavigate} kind="agreement" resourceId={route.resourceId} />;
  if (route.page === 'project' || route.page === 'project-members') {
    const project = data.projects.find((item) => item.id === route.resourceId);
    return project ? <ProjectDetail project={project} data={data} onNavigate={onNavigate} /> : <ErrorState title="Project not found" message="This project is unavailable or you do not have access." />;
  }
  return <ProfilePage onNavigate={onNavigate} />;
}

export default function PlatformApp({ route, onNavigate }: PlatformAppProps) {
  const { user, isLoading } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string | null>(route.resourceId ?? null);
  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true); setLoadError(null);
    const organizationResult = await listOrganizations();
    if (organizationResult.error) { setLoadError(organizationResult.error.message); setLoading(false); return; }
    setOrganizations(organizationResult.organizations);
    let requestedOrganizationId: string | null = null;
    const isOrganizationRoute = route.page === 'organization' || route.page === 'organization-members' || route.page === 'organization-invitations';
    const isProjectRoute = route.page === 'project' || route.page === 'project-members';
    const hasRequestedResource = (isOrganizationRoute || isProjectRoute) && Boolean(route.resourceId);
    if (isOrganizationRoute && route.resourceId) requestedOrganizationId = route.resourceId;
    if (isProjectRoute && route.resourceId) {
      const projectResult = await getProject(route.resourceId);
      if (projectResult.project) requestedOrganizationId = projectResult.project.organizationId;
      else setLoadError(projectResult.error?.message ?? 'Project access is unavailable.');
    }
    const nextId = hasRequestedResource
      ? organizationResult.organizations.some((item) => item.id === requestedOrganizationId) ? requestedOrganizationId : null
      : selectedOrganizationId && organizationResult.organizations.some((item) => item.id === selectedOrganizationId)
        ? selectedOrganizationId
        : organizationResult.organizations[0]?.id ?? null;
    setSelectedOrganizationId(nextId);
    if (nextId) {
      const [memberResult, invitationResult, projectResult] = await Promise.all([listOrganizationMembers(nextId), listOrganizationInvitations(nextId), listProjects(nextId)]);
      if (memberResult.error || invitationResult.error || projectResult.error) setLoadError(memberResult.error?.message ?? invitationResult.error?.message ?? projectResult.error?.message ?? 'Could not load organization context.');
      setMemberships(memberResult.memberships); setInvitations(invitationResult.invitations); setProjects(projectResult.projects);
    } else { setMemberships([]); setInvitations([]); setProjects([]); }
    setLoading(false);
  }, [route.page, route.resourceId, selectedOrganizationId]);

  useEffect(() => { if (user) void refresh(); }, [user, refresh]);

  const selectedOrganization = organizations.find((item) => item.id === selectedOrganizationId) ?? null;
  const currentUserId = user?.id ?? '';
  const data = useMemo<PlatformData>(() => ({ currentUserId, organizations, selectedOrganization, memberships, invitations, projects, refresh }), [currentUserId, organizations, selectedOrganization, memberships, invitations, projects, refresh]);
  latestPlatformData = data;

  useEffect(() => {
    if (!isLoading && !user) onNavigate('/login');
  }, [isLoading, user, onNavigate]);

  if (isLoading || !user) return <div className="min-h-screen bg-[#080d18] px-5 py-20 text-center text-slate-300">Loading secure workspace…</div>;
  if (loading) return <PlatformShell active={route.path} onNavigate={onNavigate}><Container><LoadingState label="Loading your workspace…" /></Container></PlatformShell>;
  if (loadError && !organizations.length) return <PlatformShell active={route.path} onNavigate={onNavigate}><Container><ErrorState title="Workspace unavailable" message={loadError} /></Container></PlatformShell>;
  return <PlatformShell active={route.path} onNavigate={onNavigate}><PlatformContent route={route} data={data} onNavigate={onNavigate} /></PlatformShell>;
}
