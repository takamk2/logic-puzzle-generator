export default class Copy {
  /**
   * Deep copy for Obj or Array
   *
   * @param value
   * @returns {any}
   */
  static deep(value) {
    return JSON.parse(JSON.stringify(value));
  }
}