type Role = 'ASSIGNMENT_OFFICER' | 'HANDOVER_OFFICER' | 'COURIER_MANAGER';
export const getPathFromRole = (role: Role) => {
  switch (role) {
    case 'ASSIGNMENT_OFFICER':
      return 'assignment-officer';
    case 'HANDOVER_OFFICER':
      return 'handover-officer';
    case 'COURIER_MANAGER':
      return 'courier-manager';
  }
};
