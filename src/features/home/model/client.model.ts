export interface Client {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  active: boolean;
  address: string;
  store: string;
  zone_id: string;
  locality: string;
}

export interface ClientOrder {
  client_id: string;
  order: number;
}

export interface ClientSelectionState {
  selectedClients: ClientOrder[];
  searchQuery: string;
}

export const initialClientSelectionState: ClientSelectionState = {
  selectedClients: [],
  searchQuery: '',
};

export function toClientViewModel(client: Client) {
  return {
    id: client.id,
    latitude: client.latitude,
    longitude: client.longitude,
    name: client.name,
    active: client.active,
    address: client.address,
    store: client.store,
    zone_id: client.zone_id,
    locality: client.locality,
  };
}
