
// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       loading: true, // 🔥 important

//       setUser: (userData, token = null) =>
//         set({
//           user: userData,
//           token,
//           isAuthenticated: true,
//           loading: false,
//         }),

//       clearUser: () =>
//         set({
//           user: null,
//           token: null,
//           isAuthenticated: false,
//           loading: false,
//         }),

//       setLoading: (loading) => set({ loading }),
//     }),
//     {
//       name: "auth-storage",
//       onRehydrateStorage: () => (state) => {
//         // 🔥 tells app that Zustand is ready
//         state?.setLoading(false)
//       },
//     }
//   )
// )

// export default useAuthStore
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false, // always start false

      setUser: (userData, token = null) =>
        set({
          user: userData,
          token,
          isAuthenticated: true,
          loading: false,
        }),

      clearUser: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
        }),

      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "auth-storage",
      // ✅ Only persist these 3 — never persist loading
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore