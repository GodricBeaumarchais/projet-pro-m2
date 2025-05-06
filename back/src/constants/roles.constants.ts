export const ROLES = {
  ADMIN: process.env.ROLE_ADMIN_UUID,
  SUPERADMIN: process.env.ROLE_SUPERADMIN_UUID,
  DEFAULT: process.env.ROLE_DEFAULT_UUID,
} as const;

// Type pour les rôles
export type RoleType = keyof typeof ROLES;

// Fonction utilitaire pour vérifier si un UUID correspond à un rôle
export const isRole = (roleId: string, role: RoleType): boolean => {
  return roleId === ROLES[role];
}; 