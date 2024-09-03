import { AuthUser, PaginatedResult } from '@libs/common';
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
import {
  ChatGroupEntity,
  ChatGroupsService,
  CreateChatGroupDto,
  QueryChatGroupsDto,
  UpdateChatGroupDto,
} from 'libs/data-access-chat-groups/src';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ChatGroupHook } from './chat-group.hook';

@UseGuards(AccessGuard)
@ApiTags('chat-groups')
@Controller('chat-groups')
export class ChatsGroupsController {
  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  @ApiConsumes('multipart/form-data')
  @Post()
  @UseInterceptors(FileInterceptor('avatarImage'))
  @UseAbility(Actions.create, ChatGroupEntity)
  public create(
    @Body() data: CreateChatGroupDto,
    @AuthUser() user: User,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ChatGroup> {
    data.avatarImageKey = image?.id;

    return this.chatGroupsService.create({
      name: data.name,
      avatarImageKey: data.avatarImageKey,
      chatGroupOwner: { connect: { id: user.id } },
      chatGroupMembers: {
        createMany: {
          skipDuplicates: true,
          data: data.createChatGroupMembers,
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
  public update(
    @Param('groupId') id: string,
    @Body() data: UpdateChatGroupDto,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ChatGroupEntity> {
    data.avatarImageKey = image?.id;

    return this.chatGroupsService.update(
      { id },
      {
        chatGroupMembers: {
          createMany: {
            skipDuplicates: true,
            data: data.createChatGroupMembers,
          },
          deleteMany: { userId: { in: data.deleteChatGroupMemberIds } },
        },
      },
    );
  }

  @Delete(':groupId')
  @UseAbility(Actions.delete, ChatGroupEntity, ChatGroupHook)
  public remove(@Param('groupId') id: string): Promise<ChatGroupEntity> {
    return this.chatGroupsService.remove({ id });
  }
}
