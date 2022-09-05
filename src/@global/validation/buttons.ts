import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

export interface UrlButton {
  url: string;
}

export interface TextButton {
  text: string;
}

export interface WebAppButton {
  webapp: string;
}

@ValidatorConstraint()
export class ButtonsArray implements ValidatorConstraintInterface {
  public async validate(data: any[]) {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    for (const row of data) {
      if (Array.isArray(row)) {
        if (row.length > 5) {
          return false;
        }

        for (const button of row) {
          switch (typeof button) {
            case 'string':
              if (button.length > 14) {
                return false;
              }
              break;

            case 'object':
              if ((button as WebAppButton).webapp == null
                && (button as UrlButton).url == null
                && (button as TextButton).text == null) {
                return false;
              }
              break;

            default:
              return false;
          }
        }
      } else {
        return false;
      }
    }

    return true;
  }
}
