import { ShiftClientAdapter } from "@/sdk/infraestructure/clients-shift/clients-shift.supabase";
import { ShiftStatusAdapter } from "@/sdk/infraestructure/shift-status/shift-status.supabase";
import { ShiftSupabaseAdapter } from "@/sdk/infraestructure/shift/supabase/shift.supabase";


const { create, update } = new ShiftSupabaseAdapter();
const { create: create_status } = new ShiftStatusAdapter();
const { create_clients_shift } = new ShiftClientAdapter();

export { create, create_clients_shift, create_status, update };

