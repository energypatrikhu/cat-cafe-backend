import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as n_fs from 'node:fs';
import * as n_path from 'node:path';
import { PrismaService } from '../prisma.service';
import { BuyProductDto } from './dto/buy-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly uploadsPath = n_path.join(
    __dirname,
    '../../uploads/products',
  );
  private readonly notFoundImagePath = n_path.join(
    __dirname,
    '../../srv/images',
    'imageNotFound.webp',
  );

  constructor(private readonly db: PrismaService) {}

  private async validateProduct(id: number | null, name: string | null) {
    if (id) {
      const product = await this.db.product.findUnique({ where: { id } });
      if (!product) throw new NotFoundException('Product not found');
    }

    if (name) {
      const product = await this.db.product.findUnique({ where: { name } });
      if (product && product.id !== id)
        throw new ConflictException('Name already exists');
    }
  }

  private buildQueryOrder(query: QueryProductDto) {
    const order = ['name', 'price'].includes(query.order?.toLowerCase() || '')
      ? query.order
      : 'name';
    const direction = ['asc', 'desc'].includes(
      query.direction?.toLowerCase() || '',
    )
      ? query.direction
      : 'asc';

    return { order, direction };
  }

  async create(createProductDto: CreateProductDto, image: Express.Multer.File) {
    await this.validateProduct(null, createProductDto.name);

    createProductDto.price = parseFloat(createProductDto.price.toString());
    createProductDto.quantity = parseInt(createProductDto.quantity.toString());

    const product = await this.db.product.create({
      data: { ...createProductDto, image: image.filename },
    });

    delete product.image;
    return product;
  }

  findAll(query: QueryProductDto) {
    const { order, direction } = this.buildQueryOrder(query);

    const where = query.search
      ? { name: { contains: query.search.toLowerCase() } }
      : undefined;

    return this.db.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
      },
      orderBy: { [order]: direction },
    });
  }

  async findOne(id: number) {
    await this.validateProduct(id, null);

    return this.db.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
      },
    });
  }

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    await this.validateProduct(productId, updateProductDto.name);

    if (updateProductDto.price) {
      updateProductDto.price = parseFloat(updateProductDto.price.toString());
    }

    if (updateProductDto.quantity) {
      updateProductDto.quantity = parseInt(
        updateProductDto.quantity.toString(),
      );
    }

    const newData = {
      ...updateProductDto,
      ...(image && { image: image.filename }),
    };

    return this.db.product.update({
      where: { id: productId },
      data: newData,
    });
  }

  async getImage(productId: number, res: any) {
    await this.validateProduct(productId, null);

    const product = await this.db.product.findUnique({
      where: { id: productId },
    });
    const imagePath = n_path.join(this.uploadsPath, product.image);

    const resolvedPath = n_fs.existsSync(imagePath)
      ? imagePath
      : this.notFoundImagePath;
    if (!n_fs.existsSync(resolvedPath))
      throw new NotFoundException('Image not found');

    const imageStream = n_fs.createReadStream(resolvedPath);
    imageStream.pipe(res);
  }

  async remove(productId: number) {
    await this.validateProduct(productId, null);

    await this.db.product.delete({ where: { id: productId } });
    return 'Product deleted successfully';
  }

  async buy(buyProductDto: BuyProductDto) {
    const products = await this.db.product.findMany({
      where: { id: { in: buyProductDto.products.map((p) => p.id) } },
    });

    const updatedProducts = products.map((product) => {
      const quantity = buyProductDto.products.find(
        (p) => p.id === product.id,
      ).quantity;
      if (product.quantity < quantity) {
        throw new NotFoundException(
          `Not enough quantity for product ${product.name}`,
        );
      }
      return { id: product.id, quantity: product.quantity - quantity };
    });

    await Promise.all(
      updatedProducts.map((product) =>
        this.db.product.update({
          where: { id: product.id },
          data: { quantity: product.quantity },
        }),
      ),
    );

    return 'Products bought successfully';
  }
}
