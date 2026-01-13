
// import { create } from "zustand"
// import { persist } from "zustand/middleware"

// const useAuthStore = create(
//   persist(
//     (set) => ({
//       user: null,
//       token: null,
//       isAuthenticated: false,
//       loading: false,

//       setUser: (userData, token = null) =>
//         set({
//           user: userData,
//           token,
//           isAuthenticated: true,
//         }),

//       clearUser: () =>
//         set({
//           user: null,
//           token: null,
//           isAuthenticated: false,
//         }),

//       setLoading: (loading) => set({ loading }),
//     }),
//     {
//       name: "auth-storage", // stored in localStorage
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
      loading: true, // 🔥 important

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
      onRehydrateStorage: () => (state) => {
        // 🔥 tells app that Zustand is ready
        state?.setLoading(false)
      },
    }
  )
)

export default useAuthStore
