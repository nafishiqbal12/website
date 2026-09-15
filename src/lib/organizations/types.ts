export type OrganizationStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export type OrganizationRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export type OrganizationMembershipStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED';

export type Organization = {
  id: string;
  name: string;
  status: OrganizationStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationMembership = {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  status: OrganizationMembershipStatus;
  invitedBy: string | null;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrganizationInvitationRole = 'ADMIN' | 'MEMBER';

export type OrganizationInvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';

export type OrganizationInvitation = {
  id: string;
  organizationId: string;
  inviterUserId: string;
  inviteeEmail: string;
  role: OrganizationInvitationRole;
  status: OrganizationInvitationStatus;
  expiresAt: string;
  acceptedBy: string | null;
  acceptedAt: string | null;
  revokedBy: string | null;
  revokedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectStatus = 'ACTIVE' | 'PAUSED' | 'ARCHIVED';

export type ProjectDeliveryStage =
  | 'DRAFT'
  | 'ONBOARDING'
  | 'SCOPING'
  | 'IMPLEMENTATION'
  | 'DEPLOYMENT'
  | 'OBSERVATION'
  | 'STABILIZATION'
  | 'DOCUMENTATION'
  | 'HANDOVER'
  | 'ONGOING_SERVICE'
  | 'PAUSED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'ARCHIVED';

export type Project = {
  id: string;
  organizationId: string;
  name: string;
  slug: string;
  description: string | null;
  status: ProjectStatus;
  deliveryStage: ProjectDeliveryStage;
  createdBy: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRole = 'PROJECT_MANAGER' | 'CONTRIBUTOR' | 'VIEWER';

export type ProjectMembershipStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REMOVED';

export type ProjectMembership = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectRole;
  status: ProjectMembershipStatus;
  createdAt: string;
  updatedAt: string;
};

export type CatalogPillarCode = 'BUILD' | 'AUTOMATE' | 'OPERATE' | 'GROW';

export type CatalogPillar = {
  id: string;
  code: CatalogPillarCode;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CatalogService = {
  id: string;
  pillarId: string;
  code: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServiceOfferingBillingMode = 'ONE_TIME' | 'RECURRING' | 'ONE_TIME_AND_RECURRING';

export type ServiceOffering = {
  id: string;
  serviceId: string;
  version: number;
  name: string;
  description: string;
  scopeTemplate: Record<string, unknown>;
  billingMode: ServiceOfferingBillingMode;
  isActive: boolean;
  displayOrder: number;
  effectiveFrom: string;
  effectiveUntil: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectServiceStatus = 'REQUESTED' | 'QUOTED' | 'APPROVED' | 'PAYMENT_PENDING' | 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'COMPLETED';

export type ProjectService = {
  id: string;
  projectId: string;
  offeringId: string;
  status: ProjectServiceStatus;
  requestedScope: Record<string, unknown>;
  scopeSnapshot: Record<string, unknown>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ProposalStatus = 'DRAFT' | 'INTERNAL_REVIEW' | 'SENT' | 'VIEWED' | 'CHANGES_REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';

export type Proposal = {
  id: string;
  organizationId: string;
  projectId: string | null;
  status: ProposalStatus;
  createdBy: string;
  issuedAt: string | null;
  validUntil: string | null;
  currentVersionId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProposalVersion = {
  id: string;
  proposalId: string;
  versionNumber: number;
  supersedesVersionId: string | null;
  status: ProposalStatus;
  scopeSnapshot: Record<string, unknown>;
  commercialSnapshot: Record<string, unknown>;
  currency: 'USD';
  contentChecksum: string;
  issuedAt: string | null;
  validUntil: string | null;
  createdBy: string;
  createdAt: string;
};

export type ProposalItem = {
  id: string;
  proposalVersionId: string;
  projectId: string | null;
  projectServiceId: string | null;
  offeringId: string | null;
  pillarCode: CatalogPillarCode;
  serviceCode: string;
  serviceName: string;
  offeringName: string;
  scopeSnapshot: Record<string, unknown>;
  commercialSnapshot: Record<string, unknown>;
  quantity: number | null;
  unit: string | null;
  sortOrder: number;
  createdAt: string;
};

export type AgreementStatus = 'DRAFT' | 'PENDING_ACCEPTANCE' | 'ACTIVE' | 'SUSPENDED' | 'TERMINATED' | 'EXPIRED';

export type Agreement = {
  id: string;
  organizationId: string;
  projectId: string | null;
  proposalId: string | null;
  sourceProposalVersionId: string | null;
  status: AgreementStatus;
  createdBy: string;
  effectiveAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AgreementVersion = {
  id: string;
  agreementId: string;
  versionNumber: number;
  supersedesVersionId: string | null;
  status: AgreementStatus;
  termsSnapshot: Record<string, unknown>;
  contentChecksum: string;
  effectiveAt: string | null;
  expiresAt: string | null;
  createdBy: string;
  createdAt: string;
};

export type AgreementAcceptance = {
  id: string;
  agreementId: string;
  agreementVersionId: string;
  organizationId: string;
  acceptingUserId: string;
  acceptedAt: string;
  acceptedVersionNumber: number;
  contentChecksum: string;
  idempotencyKey: string;
  createdAt: string;
};

export type PaymentObligationStatus = 'PENDING' | 'CANCELLED' | 'EXPIRED';

export type PaymentPurpose = 'IMPLEMENTATION' | 'ONGOING_SERVICE';

export type PaymentScheduleType = 'UPFRONT' | 'DEPOSIT' | 'MILESTONE' | 'RECURRING';

export type PaymentObligation = {
  id: string;
  organizationId: string;
  projectId: string | null;
  proposalId: string;
  proposalVersionId: string;
  agreementId: string | null;
  agreementVersionId: string | null;
  paymentPurpose: PaymentPurpose;
  scheduleType: PaymentScheduleType;
  amountMinor: string;
  currency: 'USD';
  dueAt: string | null;
  expiresAt: string | null;
  status: PaymentObligationStatus;
  commercialSnapshot: Record<string, unknown>;
  scheduleSnapshot: Record<string, unknown>;
  idempotencyKey: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentAttemptStatus = 'CREATED' | 'PROCESSING' | 'FAILED' | 'CANCELLED' | 'EXPIRED';

export type PaymentAttempt = {
  id: string;
  organizationId: string;
  projectId: string | null;
  paymentObligationId: string;
  amountMinor: string;
  currency: 'USD';
  status: PaymentAttemptStatus;
  commercialSnapshot: Record<string, unknown>;
  statusReason: string | null;
  idempotencyKey: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type EntitlementStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'CANCELLED';

export type Entitlement = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  paymentObligationId: string;
  proposalId: string;
  proposalVersionId: string;
  agreementId: string | null;
  agreementVersionId: string | null;
  sourceType: 'VERIFIED_COMMERCIAL_EVENT';
  status: EntitlementStatus;
  startsAt: string;
  endsAt: string | null;
  scopeSnapshot: Record<string, unknown>;
  sourceSnapshot: Record<string, unknown>;
  activationReference: string;
  statusReason: string | null;
  idempotencyKey: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryActivationStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type DeliveryStage = 'IMPLEMENTATION' | 'DEPLOYMENT' | 'OBSERVATION' | 'STABILIZATION' | 'DOCUMENTATION' | 'HANDOVER' | 'ONGOING_SERVICE';

export type DeliveryActivation = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  entitlementId: string;
  status: DeliveryActivationStatus;
  deliveryStage: DeliveryStage;
  activationSnapshot: Record<string, unknown>;
  activationReference: string;
  statusReason: string | null;
  idempotencyKey: string;
  activatedAt: string;
  completedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ImplementationStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type ImplementationRecord = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  deliveryActivationId: string;
  entitlementId: string;
  status: ImplementationStatus;
  implementationReference: string;
  scopeSnapshot: Record<string, unknown>;
  sourceSnapshot: Record<string, unknown>;
  idempotencyKey: string;
  statusReason: string | null;
  startedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type DeploymentStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type DeploymentRecord = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  implementationRecordId: string;
  deliveryActivationId: string;
  entitlementId: string;
  deploymentReference: string;
  idempotencyKey: string;
  deploymentSnapshot: Record<string, unknown>;
  status: DeploymentStatus;
  startedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  statusReason: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ObservationStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type ObservationRecord = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  entitlementId: string;
  deliveryActivationId: string;
  implementationRecordId: string;
  deploymentRecordId: string;
  observationReference: string;
  idempotencyKey: string;
  observationSnapshot: Record<string, unknown>;
  status: ObservationStatus;
  startedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  statusReason: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type StabilizationStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type StabilizationRecord = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  observationRecordId: string;
  deploymentRecordId: string;
  implementationRecordId: string;
  deliveryActivationId: string;
  entitlementId: string;
  stabilizationReference: string;
  idempotencyKey: string;
  stabilizationSnapshot: Record<string, unknown>;
  status: StabilizationStatus;
  startedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  statusReason: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type HandoverStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type HandoverRecord = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  documentationRecordId: string;
  stabilizationRecordId: string;
  observationRecordId: string;
  deploymentRecordId: string;
  implementationRecordId: string;
  deliveryActivationId: string;
  entitlementId: string;
  handoverReference: string;
  idempotencyKey: string;
  handoverScopeSnapshot: Record<string, unknown>;
  status: HandoverStatus;
  startedAt: string;
  completedAt: string | null;
  statusReason: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type OngoingServiceStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export type OngoingServiceBillingMode = 'MONTHLY' | 'ANNUAL';

export type OngoingServiceRecord = {
  id: string;
  organizationId: string;
  projectId: string;
  projectServiceId: string;
  handoverRecordId: string;
  documentationRecordId: string;
  stabilizationRecordId: string;
  observationRecordId: string;
  deploymentRecordId: string;
  implementationRecordId: string;
  deliveryActivationId: string;
  entitlementId: string;
  ongoingServiceReference: string;
  idempotencyKey: string;
  serviceScopeSnapshot: Record<string, unknown>;
  billingMode: OngoingServiceBillingMode;
  status: OngoingServiceStatus;
  startedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  statusReason: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};
