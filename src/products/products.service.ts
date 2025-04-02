import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private db: PrismaService) {}

  async create(createProductDto: CreateProductDto, image: Express.Multer.File) {
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
      },
    });

    delete product.image;
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

  async update(
    productId: number,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    const productExists = await this.db.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!productExists) {
      throw new NotFoundException(
        `Product with id ${productId} does not exist`,
      );
    }

    const productNameExists = await this.db.product.findFirst({
      where: {
        name: updateProductDto.name,
      },
    });

    if (productNameExists && productNameExists.id !== productId) {
      throw new ConflictException(
        `Product with name ${updateProductDto.name} already exists`,
      );
    }

    let newData: Record<string, string | number> = {};
    if (updateProductDto.name) {
      newData.name = updateProductDto.name;
    }
    if (updateProductDto.description) {
      newData.description = updateProductDto.description;
    }
    if (updateProductDto.price) {
      newData.price = updateProductDto.price;
    }
    if (updateProductDto.quantity) {
      newData.quantity = updateProductDto.quantity;
    }
    if (image) {
      newData.image = image.filename;
    }

    return this.db.product.update({
      where: {
        id: productId,
      },
      data: newData,
    });
  }

  async remove(productId: number) {
    const productExists = await this.db.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!productExists) {
      throw new NotFoundException(
        `Product with id ${productId} does not exist`,
      );
    }

    await this.db.product.delete({
      where: {
        id: productId,
      },
    });

    return 'Product deleted successfully';
  }
}
