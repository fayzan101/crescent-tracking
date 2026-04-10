import { useMutation } from '@tanstack/react-query';
import zoneEmployeeService from '@/services/zone-employee.service';

/**
 * @returns {object}
 */
export function useAssignEmployeeToZone() {
  return useMutation({
    mutationFn: (payload) =>
      zoneEmployeeService.assignEmployeeToZone(payload),
  });
}
