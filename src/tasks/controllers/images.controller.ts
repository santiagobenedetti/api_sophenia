import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from '../services/images.service';

@ApiTags('/images')
@Controller('/images')
export class ImagesController {
  constructor(private readonly fileService: ImagesService) {}

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const fileId = await this.fileService.saveFile(file);
    return { fileId };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileStream = await this.fileService.findFileById(id);
    fileStream.getStream().pipe(res);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    await this.fileService.deleteFile(id);
    return { message: 'File deleted successfully' };
  }
}
