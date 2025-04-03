import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BlogModule } from './blog/blog.module';
import { ProductsModule } from './products/products.module';
import { ReservationsModule } from './reservations/reservations.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ProductsModule,
    ReservationsModule,
    BlogModule,
  ],
})
export class AppModule {}
