import { useMutation } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * React Query hook to delete a zone-employee assignment by id
 * @returns {object} Mutation object from useMutation
 */
export function useDeleteZoneEmployeeAssignment() {
  return useMutation({
    mutationFn: (id) => zoneEmployeeService.deleteZoneEmployeeAssignment(id),
  });
}
