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

  /**
   * Check if a post exists by id or title.
   * @throws {NotFoundException} if not found by id.
   * @throws {ConflictException} if found by name.
   */
  async checkForExistingPost(id: number | null, title: string | null) {
    if (id) {
      const checkPostById = await this.db.blog.findUnique({ where: { id } });
      if (!checkPostById) {
        throw new NotFoundException('Post not found');
      }
    }

    if (title) {
      const checkPostByTitle = await this.db.blog.findUnique({
        where: { title },
      });
      if (checkPostByTitle && checkPostByTitle.id !== id) {
        throw new ConflictException('Title already exists');
      }
    }
  }

  async create(createBlogDto: CreatePostDto) {
    await this.checkForExistingPost(null, createBlogDto.title);

    return this.db.blog.create({
      data: createBlogDto,
    });
  }

  findAll() {
    return this.db.blog.findMany();
  }

  async findOne(id: number) {
    await this.checkForExistingPost(id, null);

    return this.db.blog.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateBlogDto: UpdatePostDto) {
    await this.checkForExistingPost(id, updateBlogDto.title);

    return this.db.blog.update({
      where: {
        id,
      },
      data: updateBlogDto,
    });
  }

  async remove(id: number) {
    await this.checkForExistingPost(id, null);

    this.db.blog.delete({
      where: {
        id,
      },
    });

    return 'Post deleted successfully';
  }
}
