export class Seller {
  constructor(
    private user_id: string,
    public id: string,
    public name: string,
    public lastname: string,
    public phone: string,
    public is_active: boolean,
  ){}
}