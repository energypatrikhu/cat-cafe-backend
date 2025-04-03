import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express/multer';
import { PrismaService } from '../prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

// const allowedMimeTypes = ['image/jpeg', 'image/webp', 'image/png', 'image/gif'];

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [MulterModule.register()],
})
export class ProductsModule {}
