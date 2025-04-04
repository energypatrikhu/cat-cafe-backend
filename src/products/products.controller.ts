import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  ForbiddenException,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as n_crypto from 'node:crypto';
import * as n_path from 'node:path';
import { BearerAuthGuard } from '../auth/auth.guard';
import { BuyProductDto } from './dto/buy-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

const allowedMimeTypes = ['image/jpeg', 'image/webp', 'image/png', 'image/gif'];
const multerOptions: MulterOptions = {
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(
        new BadRequestException(
          `Invalid file type, allowed types: ${allowedMimeTypes.join(', ')}`,
        ),
        false,
      );
    }
    callback(null, true);
  },
  storage: diskStorage({
    destination: n_path.join(__dirname, '../../uploads/products'),
    filename: (_req, file, callback) => {
      const uniqueFilename = n_crypto.randomUUID();
      const extension = n_path.extname(file.originalname);
      callback(null, `${uniqueFilename}${extension}`);
    },
  }),
};

@Controller('products')
@ApiExtraModels(QueryProductDto)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Create a new product (only for workers)
   */
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Product data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Product name',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        price: {
          type: 'number',
          description: 'Product price',
        },
        quantity: {
          type: 'number',
          description: 'Product quantity',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Request() req,
    @Body() createProductDto: CreateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp(allowedMimeTypes.join('|')),
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const userRole = req.user.role as 'USER' | 'WORKER';

    if (userRole !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to create a product",
      );
    }

    return this.productsService.create(createProductDto, image);
  }

  /**
   * List all products
   */
  @Get()
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: [Product],
  })
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  /**
   * Get a single product by id
   */
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Product details',
    type: Product,
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  /**
   * Get the image of a product by id
   */
  @Get(':id/image')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Product image',
    type: 'file',
  })
  async getImage(@Param('id') id: string, @Response() res) {
    return this.productsService.getImage(+id, res);
  }

  /**
   * Update a product by id (only for workers)
   */
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiBody({
    description: 'Product data',
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Product name',
        },
        description: {
          type: 'string',
          description: 'Product description',
        },
        price: {
          type: 'number',
          description: 'Product price',
        },
        quantity: {
          type: 'number',
          description: 'Product quantity',
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Product image',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: Product,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: new RegExp(allowedMimeTypes.join('|')),
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const userRole = req.user.role as 'USER' | 'WORKER';

    if (userRole !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to update a product",
      );
    }

    return this.productsService.update(+id, updateProductDto, image);
  }

  /**
   * Delete a product by id (only for workers)
   */
  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Product ID',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  async remove(@Request() req, @Param('id') id: string) {
    const userRole = req.user.role as 'USER' | 'WORKER';

    if (userRole !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to delete a product",
      );
    }

    return this.productsService.remove(+id);
  }

  /**
   * Buy a products by ids
   */
  @Patch('buy')
  @ApiResponse({
    status: 200,
    description: 'Products bought successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found',
  })
  @ApiBody({
    description: 'Products to buy',
    type: BuyProductDto,
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  buy(
    @Body()
    buyProductDto: BuyProductDto,
  ) {
    return this.productsService.buy(buyProductDto);
  }
}
