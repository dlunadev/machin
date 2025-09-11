
export class ShiftClients {
  constructor(
    public client_id: string,
    public order: number,
    public id?: string,
    public shift_id?: string
  ) { }
}