export class User {
  constructor(
    public uid: string,
    public name?: string,
    public email?: string,
    public password?: string,
    public gender?: string,
    public role?: string
  ) {}
}
