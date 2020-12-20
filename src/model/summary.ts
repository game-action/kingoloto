export class Summary {
  public static MAX_GRID = 10;
  public grid?: number;

  public cash?: number;

  public point?: number;

  get canPlay(): boolean {
    return this.grid !== undefined ? this.grid < Summary.MAX_GRID : false;
  }
}
