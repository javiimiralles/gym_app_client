export class Exercise {
  constructor(
    public uid: string,
    public name?: string,
    public muscles?: string[],
    public difficulty?: string,
    public user?: string
  ) {}
}
