import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  /**
   * The title of the blog post
   */
  @IsString()
  @IsNotEmpty()
  title: string;

  /**
   * The content of the blog post
   */
  @IsString()
  @IsNotEmpty()
  content: string;
}
