export enum ProjectMemberRole {
  COLLABORATOR = "collaborator",
  COLLABORATOR_RESTRICTED = "collaborator_restricted",
  CLIENT_READ = "client_read",
  CLIENT_READ_WRITE = "client_read_write",
}

export enum ProjectMemberStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  DECLINED = "declined",
}

export enum ProjectStatus {
  ACTIVE = "active",
  DEACTIVATED = "deactivated",
}

export interface ProjectMember {
  id: string;
  email: string;
  role: ProjectMemberRole;
  status: ProjectMemberStatus;
  userId?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  startDate: string;
  deadline: string;
  budget: number;
  status: ProjectStatus;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}
