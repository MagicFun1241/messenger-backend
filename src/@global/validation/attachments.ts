import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Attachment } from '@/messages/@types/api/messages.type';

@ValidatorConstraint()
export class AttachmentsArray implements ValidatorConstraintInterface {
  public async validate(data: Attachment[]) {
    if (!Array.isArray(data) || data.length === 0) {
      return false;
    }

    if ((new Set(data.map((e) => e?.type))).size > 1) {
      return false;
    }

    switch (data[0].type) {
      case 'photo':
        return data.length < 10;
      case 'document':
        return data.length < 5;
      default:
        return false;
    }
  }
}
