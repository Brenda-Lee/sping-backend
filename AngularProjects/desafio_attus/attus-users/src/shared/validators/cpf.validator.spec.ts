import { FormControl } from '@angular/forms';

import { cpfValidator } from './cpf.validator';

describe('cpfValidator', () => {
  const run = (value: unknown) => cpfValidator(new FormControl(value));

  it('returns null for empty value (let required handle that)', () => {
    expect(run('')).toBeNull();
    expect(run(null)).toBeNull();
    expect(run(undefined)).toBeNull();
  });

  it('rejects values with fewer than 11 digits', () => {
    expect(run('12345')).toEqual({ cpfInvalid: true });
  });

  it('rejects repeated digit CPFs', () => {
    expect(run('11111111111')).toEqual({ cpfInvalid: true });
    expect(run('000.000.000-00')).toEqual({ cpfInvalid: true });
  });

  it('rejects an invalid check digit', () => {
    expect(run('12345678900')).toEqual({ cpfInvalid: true });
  });

  it('accepts a valid CPF (unformatted)', () => {
    expect(run('52998224725')).toBeNull();
  });

  it('accepts a valid CPF (formatted)', () => {
    expect(run('529.982.247-25')).toBeNull();
  });
});
