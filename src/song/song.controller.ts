import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Song } from '@prisma/client';
import { Auth } from '../auth/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserPayload } from '../common/types/user-payload.interface';
import { UploadMusicRequestDto } from './dtos/song-request.dto';
import { SongResponseDto } from './dtos/song-response.dto';
import { SongService } from './song.service';

@ApiTags('Song')
@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Post('upload')
  @Auth()
  @UseInterceptors(FileInterceptor('song'))
  @ApiOperation({ summary: '음악을 업로드합니다.' })
  @ApiBody({
    description: '업로드하기 위한 정보와, 파일도 같이 필요합니다. form-data로 다같이 보내주세요.',
    type: UploadMusicRequestDto,
  })
  @ApiCreatedResponse({
    description: '정상적으로 업로드가 완료되었습니다. 업로드에 시간이 좀 걸립니다.',
    type: SongResponseDto,
  })
  async uploadMusic(
    @CurrentUser() { userId }: UserPayload,
    @Body() uploadMusicRequestDto: UploadMusicRequestDto,
    @UploadedFile() song: Express.MulterS3.File,
  ): Promise<Song> {
    return await this.songService.uploadMusic(userId, uploadMusicRequestDto, song);
  }
}
