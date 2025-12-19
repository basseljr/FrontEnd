export interface UserContext {
  role: 'Admin' | 'Customer' | 'EndUser';
  tenantId: number;
  email: string;
  fullName: string;
  token: string;
  expiration?: number;
}

