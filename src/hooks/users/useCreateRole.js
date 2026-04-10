import { useMutation } from '@tanstack/react-query';
import userRolesService from '@/services/user-roles.service';

/**
 * React Query hook to create a user role
 * @returns mutation object
 */
export function useCreateRole() {
  return useMutation({
    mutationFn: (payload) => userRolesService.createRole(payload),
  });
}