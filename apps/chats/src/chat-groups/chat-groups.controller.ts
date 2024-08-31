import { AuthUser, PaginatedResult } from '@libs/common';
import {
  ChatGroupsService,
  CreateChatGroupDto,
  QueryChatGroupsDto,
  UpdateChatGroupDto,
} from '@libs/data-access-chat-groups';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatGroup, User } from '@prisma/client';
import { AccessGuard, Actions, UseAbility } from 'nest-casl';
import { ChatGroupHook } from './chat-group.hook';
import { ChatGroupEntity } from './entity';

@UseGuards(AccessGuard)
@ApiTags('chat-groups')
@Controller('chat-groups')
export class ChatsGroupsController {
  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  @Post()
  @UseAbility(Actions.create, ChatGroupEntity)
  public create(
    @Body() data: CreateChatGroupDto,
    @AuthUser() user: User,
  ): Promise<ChatGroup> {
    return this.chatGroupsService.create({
      name: data.name,
      chatGroupTrips: { create: { postId: data.postId } },
      chatGroupOwner: { connect: { id: user.id } },
      chatGroupMembers: {
        createMany: data.chatGroupMembers && {
          skipDuplicates: true,
          data: data.chatGroupMembers,
        },
      },
      memberUserIds: data.chatGroupMembers && {
        set: data.chatGroupMembers?.map((member) => member.userId),
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

  @Patch(':groupId')
  @UseAbility(Actions.update, ChatGroupEntity, ChatGroupHook)
  public update(
    @Param('groupId') id: string,
    @Body() data: UpdateChatGroupDto,
  ): Promise<ChatGroupEntity> {
    return this.chatGroupsService.update({ id }, {});
  }

  @Delete(':groupId')
  @UseAbility(Actions.delete, ChatGroupEntity, ChatGroupHook)
  public remove(@Param('groupId') id: string): Promise<ChatGroupEntity> {
    return this.chatGroupsService.remove({ id });
  }
}
