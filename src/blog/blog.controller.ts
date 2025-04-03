import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BearerAuthGuard } from '../auth/auth.guard';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { BlogPost } from './entities/blog.entity';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  /**
   * Create a new blog post (only for workers)
   */
  @Post('posts')
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    type: BlogPost,
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
  create(@Request() req, @Body() createBlogDto: CreatePostDto) {
    const role = req.user.role as 'USER' | 'WORKER';
    if (role !== 'WORKER') {
      throw new ForbiddenException(
        'You are not authorized to delete a blog post',
      );
    }

    return this.blogService.create(createBlogDto);
  }

  /**
   * Get all blog posts
   */
  @Get('posts')
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    type: [BlogPost],
  })
  findAll() {
    return this.blogService.findAll();
  }

  /**
   * Get a blog post by ID
   */
  @Get('posts/:id')
  @ApiParam({
    name: 'id',
    description: 'The ID of the blog post to retrieve',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    type: BlogPost,
  })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  /**
   * Update a blog post (only for workers)
   */
  @Patch('posts/:id')
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The ID of the blog post to update',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    type: BlogPost,
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
    description: 'Post not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdatePostDto,
  ) {
    const role = req.user.role as 'USER' | 'WORKER';
    if (role !== 'WORKER') {
      throw new ForbiddenException(
        'You are not authorized to delete a blog post',
      );
    }

    return this.blogService.update(+id, updateBlogDto);
  }

  /**
   * Update a blog post (only for workers)
   */
  @Delete('posts/:id')
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The ID of the blog post to delete',
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
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
    description: 'Post not found',
  })
  remove(@Request() req, @Param('id') id: string) {
    const role = req.user.role as 'USER' | 'WORKER';
    if (role !== 'WORKER') {
      throw new ForbiddenException(
        'You are not authorized to delete a blog post',
      );
    }

    return this.blogService.remove(+id);
  }
}
