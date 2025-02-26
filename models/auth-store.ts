import axiosInstance from "@/commons/axios";
import { MemberData } from "@/types/member";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { get as getLodash } from "lodash";
import { EditProfileType } from "@/components/edit-profile";

interface AuthStore {
  profile: MemberData | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  login: (username: string, password: string) => Promise<void>;
  getMemberInfo(): Promise<void>;
  editProfile: (values: EditProfileType) => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      profile: null,

      login: async (username: string, password: string) => {
        try {
          set({ loading: true });
          const response = await axiosInstance.post("/members/login", {
            mobile: username,
            password_hash: password,
          });

          const { token, member, role_name, member_id, district_id, state_id } =
            response.data;

          const { password_hash, ...rest } = member;

          localStorage.setItem("token", token);
          localStorage.setItem(
            "userRole",
            role_name === "Admin" ? "ADMIN" : "USER"
          );
          localStorage.setItem("member_id", member_id.toString());
          localStorage.setItem("state_id", state_id.toString());
          localStorage.setItem("district_id", district_id.toString());

          set({ profile: rest, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      getMemberInfo: async () => {
        try {
          set({ loading: true });
          const res = await axiosInstance.get(
            `/members/${get().profile?.member_id}`
          );
          if (res.status === 200) {
            const data = res.data;
            const memberData = getLodash(data, "data", {});
            set({ profile: memberData, loading: false });
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      editProfile: async (values: EditProfileType) => {
        set({ loading: true });
        try {
          await axiosInstance.put(
            `/members/${get().profile?.member_id}`,
            values
          );

          get().getMemberInfo();

          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: "authStore",
    }
  )
);
