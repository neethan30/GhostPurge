
export enum ServiceName {
  Microsoft = "Microsoft 365",
  Google = "Google Workspace",
  Slack = "Slack",
  Hubspot = "Hubspot",
  Jira = "Jira",
  Salesforce = "Salesforce",
  ServiceNow = "ServiceNow",
}

export enum UserStatus {
  Active = "Active",
  Inactive = "Inactive",
  PendingDeactivation = "Pending Deactivation",
}

export interface User {
  id: string;
  name: string;
  email: string;
  service: ServiceName;
  lastActive: Date;
  status: UserStatus;
  avatar: string;
}
