import { useQuery } from '@tanstack/react-query';
import { FirmsService } from '@/services/firmsService';

export function useCurrentFirm() {
  return useQuery({
    queryKey: ['current-firm'],
    queryFn: () => FirmsService.getCurrent(),
    staleTime: 5 * 60 * 1000,
  });
}
