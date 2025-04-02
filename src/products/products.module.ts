import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma.service';
import { MulterModule } from '@nestjs/platform-express/multer';
import n_fs from 'node:fs';
import n_crypto from 'node:crypto';
import n_path from 'node:path';
import { diskStorage } from 'multer';

// const allowedMimeTypes = ['image/jpeg', 'image/webp', 'image/png', 'image/gif'];

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [MulterModule.register()],
})
export class ProductsModule {}
