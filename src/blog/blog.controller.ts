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

  private validateWorkerRole(userRole: 'USER' | 'WORKER') {
    if (userRole !== 'WORKER') {
      throw new ForbiddenException(
        "You don't have permission to perform this action",
      );
    }
  }

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
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "You don't have permission to perform this action",
  })
  @ApiResponse({ status: 409, description: 'Title already exists' })
  create(@Request() req, @Body() createBlogDto: CreatePostDto) {
    this.validateWorkerRole(req);
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
  @ApiResponse({ status: 404, description: 'Post not found' })
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
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "You don't have permission to perform this action",
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 409, description: 'Title already exists' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateBlogDto: UpdatePostDto,
  ) {
    this.validateWorkerRole(req);
    return this.blogService.update(+id, updateBlogDto);
  }

  /**
   * Delete a blog post (only for workers)
   */
  @Delete('posts/:id')
  @UseGuards(BearerAuthGuard)
  @ApiBearerAuth()
  @ApiParam({
    name: 'id',
    description: 'The ID of the blog post to delete',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: "You don't have permission to perform this action",
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  remove(@Request() req, @Param('id') id: string) {
    this.validateWorkerRole(req);
    return this.blogService.remove(+id);
  }
}
