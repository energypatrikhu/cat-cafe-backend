import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, ReservationsModule],
})
export class AppModule {}
