// import { SetMetadata } from '@nestjs/common';
// import { Role as DbRole } from '@prisma/client';

// export const ROLE_KEY = 'role';
// export const Role = (role: DbRole) => SetMetadata(ROLE_KEY, role);

import { Reflector } from '@nestjs/core';
import type { Role as DbRole } from '@prisma/client';

export const Role = Reflector.createDecorator<DbRole>();
