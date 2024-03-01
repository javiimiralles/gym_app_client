import { Session } from "./session.model";

export class Routine {
  constructor(
    public uid: string,
    public name?: string,
    public sessions?: string[] | Session[],
    public iterator?: number,
    public active?: boolean,
    public user?: string
  ) {}
}
