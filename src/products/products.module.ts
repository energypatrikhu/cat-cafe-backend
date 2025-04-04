import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { PrismaService } from '../prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [
    MulterModule.register({
      dest: 'uploads/products',
      limits: {
        fileSize: 1024 * 1024 * 32, // 32 MB
      },
    }),
  ],
})
export class ProductsModule {}
