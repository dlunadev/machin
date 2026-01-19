import { ShiftClientsUseCase } from '@/sdk/application/shift-clients/shift-clients.use-case';
import { ShiftStatusUseCase } from '@/sdk/application/shift-status/shift-status.use-case';
import { ShiftUseCase } from '@/sdk/application/shift/shift.use-case';
import { ShiftClientAdapter, ShiftStatusAdapter, ShiftSupabaseAdapter } from '@/sdk/infraestructure';

const shift = new ShiftSupabaseAdapter();
const shift_status = new ShiftStatusAdapter();
const shift_client = new ShiftClientAdapter();

const service_shift = new ShiftUseCase(shift);
const service_shift_client = new ShiftClientsUseCase(shift_client);
const service_shift_status = new ShiftStatusUseCase(shift_status);

export { service_shift, service_shift_client, service_shift_status };

