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
