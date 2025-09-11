
export class Client {
  constructor(
    public id: string,
    public latitude: number,
    public longitude: number,
    public name: string,
    public active: boolean,
    public address: string,
    public store: string,
    public zone_id: string,
    public locality: string,
  ) { }
}