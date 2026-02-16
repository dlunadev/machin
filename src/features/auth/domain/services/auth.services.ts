import { AuthUseCase } from "@/sdk/application";
import { AuthSupabaseAdapter } from "@/sdk/infraestructure";

const adapter = new AuthSupabaseAdapter();
const service = new AuthUseCase(adapter);

export { service };
