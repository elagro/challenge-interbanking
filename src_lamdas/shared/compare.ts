/**
 * verifica si todos los parámetros tienen valor
 */
export function allHaveValues(...inputs: any[]): boolean {
  return inputs.every(input => input !== null && input !== undefined);
}