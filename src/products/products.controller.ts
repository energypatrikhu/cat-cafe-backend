import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  ForbiddenException,
  FileTypeValidator,
  ParseFilePipe,
  BadRequestException,
  Response,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { QueryProductDto } from './dto/query-product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';
import { BearerAuthGuard } from '../auth/auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as n_fs from 'node:fs';
import * as n_crypto from 'node:crypto';
import * as n_path from 'node:path';

const allowedMimeTypes = ['image/jpeg', 'image/webp', 'image/png', 'image/gif'];

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
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - You do not have permission to create a product',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Product already exists',
  })
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(
    FileInterceptor('image', {
      dest: 'uploads/products',
      limits: {
        fileSize: 1024 * 1024 * 32, // 32 MB
      },
      fileFilter: (req, file, callback) => {
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
        filename: (req, file, callback) => {
          const uniqueFilename = n_crypto.randomUUID();
          const extension = n_path.extname(file.originalname);
          callback(null, `${uniqueFilename}${extension}`);
        },
      }),
    }),
  )
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

    const userId = req.user.id;

    return this.productsService.create(createProductDto, image, userId);
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
    const product = await this.productsService.findOne(+id);

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    const imagePath = n_path.join(
      __dirname,
      '../../uploads/products',
      product.image,
    );

    if (!n_fs.existsSync(imagePath)) {
      throw new BadRequestException('Image not found');
    }

    const imageStream = n_fs.createReadStream(imagePath);
    imageStream.pipe(res);
  }
}
