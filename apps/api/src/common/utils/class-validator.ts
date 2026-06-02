import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsStringOrObject(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrObject',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return typeof value === 'string' || (typeof value === 'object' && value !== null);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a string or an object`;
        }
      },
    });
  };
}