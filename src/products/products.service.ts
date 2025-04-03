import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import * as n_fs from 'node:fs';
import * as n_path from 'node:path';

@Injectable()
export class ProductsService {
  constructor(private db: PrismaService) {}

  /**
   * Check if a product exists by id or name.
   * @throws {NotFoundException} if not found by id.
   * @throws {ConflictException} if found by name.
   */
  async checkForExistingProduct(id: number | null, name: string | null) {
    if (id) {
      const checkProductById = await this.db.product.findUnique({
        where: { id },
      });
      if (!checkProductById) {
        throw new NotFoundException('Product not found');
      }
    }

    if (name) {
      const checkProductByName = await this.db.product.findUnique({
        where: { name },
      });
      if (checkProductByName && checkProductByName.id !== id) {
        throw new ConflictException('Name already exists');
      }
    }
  }

  async create(createProductDto: CreateProductDto, image: Express.Multer.File) {
    await this.checkForExistingProduct(null, createProductDto.name);

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

  async findOne(id: number) {
    await this.checkForExistingProduct(id, null);

    return this.db.product.findUnique({
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
    await this.checkForExistingProduct(productId, updateProductDto.name);

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

  async getImage(productId: number, res: any) {
    await this.checkForExistingProduct(productId, null);

    const productById = await this.db.product.findUnique({
      where: {
        id: productId,
      },
    });

    const imagePath = n_path.join(
      __dirname,
      '../../uploads/products',
      productById.image,
    );

    if (!n_fs.existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }

    const imageStream = n_fs.createReadStream(imagePath);
    imageStream.pipe(res);
  }

  async remove(productId: number) {
    await this.checkForExistingProduct(productId, null);

    await this.db.product.delete({
      where: {
        id: productId,
      },
    });

    return 'Product deleted successfully';
  }
}
