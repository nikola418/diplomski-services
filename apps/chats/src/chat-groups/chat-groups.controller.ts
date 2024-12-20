import { AuthUser } from '@libs/common';
import { FilesService } from '@libs/data-access-files';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ChatGroup, User } from '@prisma/client';

import { PaginatedResult } from '@libs/core';
import {
  ChatGroupEntity,
  ChatGroupsService,
  CreateChatGroupDto,
  QueryChatGroupsDto,
  UpdateChatGroupDto,
} from '@libs/data-access-chat-groups';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ChatGroupHook } from './chat-group.hook';

@UseGuards(AccessGuard)
@ApiTags('chat-groups')
@Controller('chat-groups')
export class ChatsGroupsController {
  constructor(
    private readonly chatGroupsService: ChatGroupsService,
    private readonly filesService: FilesService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('avatarImage'))
  @UseAbility(Actions.create, ChatGroupEntity)
  public async create(
    @Body() data: CreateChatGroupDto,
    @AuthUser() user: User,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ChatGroupEntity> {
    if (image) {
      data.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }

    return this.chatGroupsService.create({
      name: data.name,
      avatarImageKey: data.avatarImageKey,
      chatGroupOwner: { connect: { id: user.id } },
      chatGroupMembers: {
        createMany: {
          skipDuplicates: true,
          data: [...(data.createChatGroupMembers ?? []), { userId: user.id }],
        },
      },
    });
  }

  @Get()
  @UseAbility(Actions.read, ChatGroupEntity)
  public findAll(
    @Query(ValidationPipe) queries: QueryChatGroupsDto,
    @AuthUser() user: User,
  ): Promise<PaginatedResult<ChatGroup>> {
    return this.chatGroupsService.paginate(queries, user);
  }

  @Get(':groupId')
  @UseAbility(Actions.read, ChatGroupEntity, ChatGroupHook)
  public findOne(@Param('groupId') id: string): Promise<ChatGroup> {
    return this.chatGroupsService.findOne({
      id,
    });
  }

  @ApiConsumes('multipart/form-data')
  @Patch(':groupId')
  @UseInterceptors(FileInterceptor('avatarImage'))
  @UseAbility(Actions.update, ChatGroupEntity, ChatGroupHook)
  public async update(
    @Param('groupId') id: string,
    @Body() data: UpdateChatGroupDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ChatGroupEntity> {
    if (image) {
      data.avatarImageKey = (
        await this.filesService.uploadOne(image)
      ).toString();
    }

    return this.chatGroupsService.update({
      where: { id },
      data: {
        name: data.name,
        avatarImageKey: data.avatarImageKey,
        ownerUserId: data.ownerUserId,
        chatGroupMembers: {
          createMany: data.createChatGroupMembers && {
            skipDuplicates: true,
            data: data.createChatGroupMembers,
          },
          deleteMany: data.deleteChatGroupMemberIds && {
            chatGroupId: id,
            userId: { in: data.deleteChatGroupMemberIds },
          },
        },
      },
    });
  }

  @Delete(':groupId')
  @UseAbility(Actions.delete, ChatGroupEntity, ChatGroupHook)
  public remove(@Param('groupId') id: string): Promise<ChatGroupEntity> {
    return this.chatGroupsService.remove({ id });
  }
}
