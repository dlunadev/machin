
export class LocationLive {
  constructor(
    public shift_id: string,
    public latitude: number,
    public longitude: number,
    public accuracy: number,
    public id?: string,
  ){ }
}