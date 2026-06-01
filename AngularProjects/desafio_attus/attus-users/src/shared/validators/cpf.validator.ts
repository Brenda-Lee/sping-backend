import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const cpfValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const raw = control.value;
  if (raw === null || raw === undefined || raw === '') {
    return null;
  }

  const digits = String(raw).replace(/\D/g, '');
  if (digits.length !== 11) {
    return { cpfInvalid: true };
  }

  if (/^(\d)\1{10}$/.test(digits)) {
    return { cpfInvalid: true };
  }

  if (!isValidCheckDigit(digits, 9) || !isValidCheckDigit(digits, 10)) {
    return { cpfInvalid: true };
  }

  return null;
};

function isValidCheckDigit(digits: string, position: number): boolean {
  let sum = 0;
  for (let i = 0; i < position; i++) {
    sum += Number(digits.charAt(i)) * (position + 1 - i);
  }
  const remainder = (sum * 10) % 11;
  const expected = remainder === 10 ? 0 : remainder;
  return expected === Number(digits.charAt(position));
}
