import { PickType } from '@nestjs/mapped-types';
import { TokenExternal } from '@/authentication/schemas/token-external.schema';

export class CreateTokenExternalDto extends PickType(TokenExternal, ['token', 'ip', 'service'] as const) {}
