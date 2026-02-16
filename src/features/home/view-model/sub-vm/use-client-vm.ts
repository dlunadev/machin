import { useClients } from '@/src/features/home/hooks';
import { useState } from 'react';
import { Client, ClientSelectionState, initialClientSelectionState } from '../../model/client.model';

export const useClientViewModel = (zoneId?: string) => {
  const [selectionState, setSelectionState] = useState<ClientSelectionState>(
    initialClientSelectionState
  );
  
  const { clients, isLoading, loadMore } = useClients(
    10,
    selectionState.searchQuery,
    zoneId
  );
  
  const toggleClient = (client: Client) => {
    setSelectionState(prev => {
      const exists = prev.selectedClients.find(c => c.client_id === client.id);
      
      if (exists) {
        return {
          ...prev,
          selectedClients: prev.selectedClients
            .filter(c => c.client_id !== client.id)
            .map((c, index) => ({ ...c, order: index + 1 })),
        };
      }
      
      return {
        ...prev,
        selectedClients: [
          ...prev.selectedClients,
          { client_id: client.id, order: prev.selectedClients.length + 1 },
        ],
      };
    });
  };
  
  const setSearchQuery = (query: string) => {
    setSelectionState(prev => ({ ...prev, searchQuery: query }));
  };
  
  const clearSelection = () => {
    setSelectionState(prev => ({ ...prev, selectedClients: [] }));
  };
  
  const isClientSelected = (clientId: string) => {
    return !!selectionState.selectedClients.find(c => c.client_id === clientId);
  };
  
  return {
    clients,
    isLoading,
    loadMore,
    selectedClients: selectionState.selectedClients,
    searchQuery: selectionState.searchQuery,
    toggleClient,
    setSearchQuery,
    clearSelection,
    isClientSelected,
  };
};
