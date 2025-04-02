import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private db: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
    userId: number,
  ) {
    const productExists = await this.db.product.findFirst({
      where: {
        name: createProductDto.name,
      },
    });

    if (productExists) {
      throw new ConflictException(
        `Product with name ${createProductDto.name} already exists`,
      );
    }

    const product = await this.db.product.create({
      data: {
        ...createProductDto,
        image: image.filename,
        Uploader: {
          connect: {
            id: userId,
          },
        },
      },
    });

    delete product.image;
    delete product.uploaderId;
    return product;
  }

  findAll(query: QueryProductDto) {
    const queryOrder = query.order
      ? ['name', 'price'].includes(query.order.toLowerCase())
        ? query.order
        : 'name'
      : 'name';

    const queryDirection = query.direction
      ? ['asc', 'desc'].includes(query.direction.toLowerCase())
        ? query.direction
        : 'asc'
      : 'asc';

    if (query.search) {
      return this.db.product.findMany({
        where: {
          name: {
            contains: query.search.toLowerCase(),
          },
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          quantity: true,
        },
        orderBy: {
          [queryOrder]: queryDirection,
        },
      });
    }

    return this.db.product.findMany({
      orderBy: {
        [queryOrder]: queryDirection,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        quantity: true,
      },
    });
  }

  findOne(id: number) {
    return this.db.product.findFirstOrThrow({
      where: {
        id,
      },
    });
  }

  update(
    productId: number,
    updateProductDto: CreateProductDto,
    image: Express.Multer.File,
    userId: any,
  ) {
    return this.db.product.update({
      where: {
        id: productId,
      },
      data: {
        ...updateProductDto,
        image: image.filename,
        Uploader: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async remove(productId: number) {
    await this.db.product.delete({
      where: {
        id: productId,
      },
    });

    return 'Product deleted successfully';
  }
}
