import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlogService {
  constructor(private db: PrismaService) {}

  async create(createBlogDto: CreatePostDto) {
    const existingPost = await this.db.blog.findFirst({
      where: {
        title: createBlogDto.title,
      },
    });
    if (existingPost) {
      throw new ConflictException('Title already exists');
    }

    return this.db.blog.create({
      data: createBlogDto,
    });
  }

  findAll() {
    return this.db.blog.findMany();
  }

  async findOne(id: number) {
    const post = await this.db.blog.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return this.db.blog.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateBlogDto: UpdatePostDto) {
    const post = await this.db.blog.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const existingPost = await this.db.blog.findFirst({
      where: {
        title: updateBlogDto.title,
      },
    });
    if (existingPost && existingPost.id !== id) {
      throw new ConflictException('Title already exists');
    }

    return this.db.blog.update({
      where: {
        id,
      },
      data: updateBlogDto,
    });
  }

  async remove(id: number) {
    const post = await this.db.blog.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    this.db.blog.delete({
      where: {
        id,
      },
    });

    return 'Post deleted successfully';
  }
}
