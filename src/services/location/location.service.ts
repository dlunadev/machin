import { LocationAdapter } from "@/sdk/infraestructure/location/location.supabase";

const { create: create_location } = new LocationAdapter();

export { create_location };
