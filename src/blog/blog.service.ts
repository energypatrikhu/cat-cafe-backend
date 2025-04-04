import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogService {
  constructor(private readonly db: PrismaService) {}

  private async validatePost(id?: number, title?: string) {
    if (id) {
      const post = await this.db.blog.findUnique({ where: { id } });
      if (!post) throw new NotFoundException('Post not found');
    }

    if (title) {
      const existingPost = await this.db.blog.findUnique({ where: { title } });
      if (existingPost && existingPost.id !== id)
        throw new ConflictException('Title already exists');
    }
  }

  async create(createBlogDto: CreatePostDto) {
    await this.validatePost(undefined, createBlogDto.title);

    return this.db.blog.create({
      data: createBlogDto,
    });
  }

  async findAll() {
    return this.db.blog.findMany();
  }

  async findOne(id: number) {
    await this.validatePost(id);

    return this.db.blog.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateBlogDto: UpdatePostDto) {
    await this.validatePost(id, updateBlogDto.title);

    return this.db.blog.update({
      where: { id },
      data: updateBlogDto,
    });
  }

  async remove(id: number) {
    await this.validatePost(id);

    await this.db.blog.delete({
      where: { id },
    });

    return 'Post deleted successfully';
  }
}
