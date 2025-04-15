import { Reflector } from '@nestjs/core';

export const Authenticated = Reflector.createDecorator<boolean>();
