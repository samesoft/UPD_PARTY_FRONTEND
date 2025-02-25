export interface IMember {
  member_id: number;
  first_name: string;
  last_name: string;
  middle_name?: string;
  state_id: number;
  district_id: number;
  mobile: string;
}

export interface MemberData {
  member_id: number;
  first_name: string;
  last_name: string;
  email: string;
  middle_name: string;
  mobile: string;
  gender: string;
  profile_photo_url: string | null;
  role_name: string;
}
