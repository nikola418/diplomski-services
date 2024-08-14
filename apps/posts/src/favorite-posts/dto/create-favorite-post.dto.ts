import { IsString } from 'class-validator';

export class CreateFavoritePostDto {
  @IsString()
  postId: string;
}
