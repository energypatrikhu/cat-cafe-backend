import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express/multer';
import { RoleGuard } from '../auth/role.guard';
import { PrismaService } from '../prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    PrismaService,
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 32, // 32 MB
      },
    }),
  ],
})
export class ProductsModule {}
