import { Reflector } from '@nestjs/core';
import type { Role as DbRole } from '@prisma/client';

export const Role = Reflector.createDecorator<DbRole>();
