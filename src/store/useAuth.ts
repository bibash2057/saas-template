import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LoginUserInfo = any;
type UserPermissionItem = any;

interface AuthState {
  token: string;
  userInfo: LoginUserInfo | null;
  permissions: string[];
  isNewUser: boolean;
  isLoggedIn: boolean;
  _hydrated: boolean;
  loginUser: (
    token: string,
    userInfo: LoginUserInfo | null,
    is_new_user: boolean,
  ) => void;
  logOut: () => void;
  setHydrated: (state: boolean) => void;
  setPermissions: (permissionItems: UserPermissionItem[]) => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: "",
      userInfo: null,
      permissions: [],
      isNewUser: false,
      isLoggedIn: false,
      _hydrated: false,
      loginUser: (
        token: string,
        userInfo: LoginUserInfo | null,
        is_new_user: boolean,
      ) => set({ isLoggedIn: true, token, userInfo, isNewUser: is_new_user }),
      logOut: () => {
        set({ isLoggedIn: false, token: "", userInfo: null, isNewUser: false });
        localStorage.removeItem("auth-access");
      },
      setHydrated: (state: boolean) => set({ _hydrated: state }),
      setPermissions: (permissionItems) => {
        const names = permissionItems.map((item) => item.name);
        set({ permissions: names });
      },

      hasPermission: (permission) => {
        return get().permissions.includes(permission);
      },

      hasAnyPermission: (requiredPermissions) => {
        const userPermissions = get().permissions;
        return requiredPermissions.some((perm) =>
          userPermissions.includes(perm),
        );
      },
    }),
    {
      name: "auth-access",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
