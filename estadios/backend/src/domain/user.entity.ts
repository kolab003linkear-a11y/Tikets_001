
export type UserRole = 'CLIENT' | 'ADMIN' | 'VALIDATOR';
 
export interface User {
  id: string;
  name: string;
  email: string;
  dni: string;
  role: UserRole;
  favoriteTeams?: {
    id?: string;
    teamId: string;
    team?: {
      id?: string;
      name: string;
    };
  }[];
  createdAt: Date;
}
 