import { Injectable, Scope, ValidationPipe } from '@nestjs/common';
import { WsFormatException } from '@/ws/exceptions/ws.format.exception';

@Injectable({ scope: Scope.REQUEST })
export class WSValidationPipe extends ValidationPipe {
  createExceptionFactory() {
    return (validationErrors = []) => {
      if (this.isDetailedOutputDisabled) {
        return new WsFormatException('Bad request');
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const errors = this.flattenValidationErrors(validationErrors);

      return new WsFormatException(errors);
    };
  }
}
