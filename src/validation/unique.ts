import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class IsUniqueItemsArray implements ValidatorConstraintInterface {
  public async validate(data: any[], _: ValidationArguments) {
    return Array.isArray(data) && (new Set(data)).size !== data.length;
  }
}
