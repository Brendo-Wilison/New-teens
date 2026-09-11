export type UserRole = 'admin' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface Member {
  id: string;
  name: string;
}

export interface Visitor {
  id: string;
  name: string;
  age: number;
  invitedById: string;
  invitedByName: string;
  createdAt: string;
  createdBy: string;
}

export interface RankingEntry {
  memberId: string;
  memberName: string;
  count: number;
  position: number;
}
