import axiosInstance from "@/commons/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { get as getLodash } from "lodash";
import { Region, StateOption } from "@/types/utilities";

interface UtilityStore {
  loading: boolean;
  getRegionsByState: (stateId: number) => Promise<Region[]>;
  getRegions: () => Promise<void>;
  getStates: () => Promise<void>;
  createRegion: (region: Region) => Promise<void>;
  updateRegion: (region: Region) => Promise<void>;
  deleteRegion: (regionId: number) => Promise<void>;
  regions: Region[];
  states: StateOption[];
}

export const useUtilityStore = create<UtilityStore>()(
  persist(
    (set, get) => ({
      loading: false,
      setLoading: (loading: boolean) => set({ loading }),
      regions: [],
      states: [],

      getRegions: async () => {
        try {
          set({ loading: true });
          const res = await axiosInstance.get(`/region`);
          if (res.status === 200) {
            const data = res.data;
            const regionData = getLodash(data, "data", {});
            set({ regions: regionData, loading: false });
            return;
          }
          set({ loading: false, regions: [] });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      createRegion: async (region: Region) => {
        try {
          set({ loading: true });
          const res = await axiosInstance.post(`/region`, region);
          if (res.status === 201) {
            get().getRegions();
            return;
          }
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      updateRegion: async (region: Region) => {
        try {
          set({ loading: true });
          const res = await axiosInstance.put(
            `/region/${region.regionid}`,
            region
          );
          if (res.status === 200) {
            const data = res.data;
            const regionData = getLodash(data, "data", {});
            const updatedRegions = get().regions.map((r) =>
              r.regionid === regionData.regionid ? regionData : r
            );
            set({ regions: updatedRegions, loading: false });
            return;
          }
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      deleteRegion: async (regionId: number) => {
        try {
          set({ loading: true });
          const res = await axiosInstance.delete(`/region/${regionId}`);
          if (res.status === 200) {
            const updatedRegions = get().regions.filter(
              (r) => r.regionid !== regionId
            );
            set({ regions: updatedRegions, loading: false });
            return;
          }
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      getStates: async () => {
        try {
          set({ loading: true });
          const res = await axiosInstance.get(`/state`);
          if (res.status === 200) {
            const data = res.data;
            const stateData = getLodash(data, "data", {});
            set({ states: stateData, loading: false });
            return;
          }
          set({ loading: false, states: [] });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
      getRegionsByState: async (stateId: number) => {
        try {
          set({ loading: true });
          const res = await axiosInstance.get(`/region/${stateId}`);
          if (res.status === 200) {
            const data = res.data;
            const regionData = getLodash(data, "data", {});
            return regionData;
          }
          return [];
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },
    }),
    {
      name: "utilityStore",
    }
  )
);
