import { PickType } from '@nestjs/mapped-types';
import { TokenExternal } from '@/auth/schemas/token-external.schema';

export class CreateTokenExternalDto extends PickType(TokenExternal, ['token'] as const) {}
