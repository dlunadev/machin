import { ShiftClientsUseCase } from "@/sdk/application/shift-clients/shift-clients.use-case";
import { ShiftStatusUseCase } from "@/sdk/application/shift-status/shift-status.use-case";
import { ShiftUseCase } from "@/sdk/application/shift/shift.use-case";
import { ShiftClientMockAdapter, ShiftMockAdapter, ShiftStatusMockAdapter } from "@/sdk/infraestructure";

const shift_mock = new ShiftMockAdapter();
const shift_status_mock = new ShiftStatusMockAdapter();
const shift_client_mock = new ShiftClientMockAdapter();

const service_shift = new ShiftUseCase(shift_mock);
const service_shift_client  = new ShiftClientsUseCase(shift_client_mock);
const service_shift_status = new ShiftStatusUseCase(shift_status_mock);

export { service_shift, service_shift_client, service_shift_status };

