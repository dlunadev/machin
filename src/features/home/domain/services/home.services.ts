import { ClientUseCase } from "@/sdk/application/client/client.use-case";
import { LocationLiveUseCase } from "@/sdk/application/location-live/location-live.use-case";
import { ShiftStatusUseCase } from "@/sdk/application/shift-status/shift-status.use-case";
import { ShiftUseCase } from "@/sdk/application/shift/shift.use-case";
import { ZoneUseCase } from "@/sdk/application/zone/zone.use-case";
import { ClientSupabaseAdapter, ShiftStatusAdapter, ShiftSupabaseAdapter, ZoneSupabaseAdapter } from "@/sdk/infraestructure";
import { LocationAdapter } from "@/sdk/infraestructure/location/location.supabase";

const shift_adapter = new ShiftSupabaseAdapter();
const shift_status_adapter = new ShiftStatusAdapter();
const zone_adapter = new ZoneSupabaseAdapter();
const client_adapter = new ClientSupabaseAdapter();
const location_adapter = new LocationAdapter();

const shift_service = new ShiftUseCase(shift_adapter);
const zone_service = new ZoneUseCase(zone_adapter);
const client_service = new ClientUseCase(client_adapter);
const location_service = new LocationLiveUseCase(location_adapter);
const shift_status_service = new ShiftStatusUseCase(shift_status_adapter);

export { client_service, location_service, shift_service, shift_status_service, zone_service };

