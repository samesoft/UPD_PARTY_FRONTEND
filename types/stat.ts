export type Stat = {
  totalMembers: number;
  newMembersThisMonth: number;
  totalStates: number;
  membershipLevels: number;
  monthlyGrowth: number;
};

export type MemberStateGrowth = {
  state: string;
  members: number;
};

export type MemberMonthGrowth = {
  month: string;
  members: number;
};

export type RecentActivity = {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  timeAgo: string;
};
