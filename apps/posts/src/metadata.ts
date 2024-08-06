/* eslint-disable */
export default async () => {
  const t = {
    ['../../users/src/entities/user.entity']: await import(
      '../../users/src/entities/user.entity'
    ),
    ['./entity/post.entity']: await import('./entity/post.entity'),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('../../users/src/entities/user.entity'),
          {
            UserEntity: {
              id: { required: true, type: () => String },
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              username: { required: true, type: () => String },
              phoneNumber: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
              roles: { required: true, type: () => [Object] },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('../../users/src/dto/create-user.dto'),
          {
            CreateUserDto: {
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              username: { required: true, type: () => String },
              phoneNumber: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
            },
          },
        ],
        [import('../../users/src/dto/update-user.dto'), { UpdateUserDto: {} }],
        [
          import('./dto/create-post.dto'),
          {
            CreatePostDto: {
              title: { required: true, type: () => String },
              description: { required: true, type: () => String },
              locationLat: { required: true, type: () => Number },
              locationLong: { required: true, type: () => Number },
            },
          },
        ],
        [import('./dto/update-post.dto'), { UpdatePostDto: {} }],
        [
          import('./entity/post.entity'),
          {
            PostEntity: {
              id: { required: true, type: () => String },
              title: { required: true, type: () => String },
              description: { required: true, type: () => String },
              averageRating: { required: true, type: () => Number },
              ratingsCount: { required: true, type: () => Number },
              activityTags: { required: true, type: () => [Object] },
              nearbyTags: { required: true, type: () => [Object] },
              imageUrl: { required: true, type: () => String },
              locationLat: { required: true, type: () => Number },
              locationLong: { required: true, type: () => Number },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
      ],
      controllers: [
        [
          import('../../users/src/users.controller'),
          {
            UsersController: {
              create: {
                type: t['../../users/src/entities/user.entity'].UserEntity,
              },
              findAll: {
                type: [t['../../users/src/entities/user.entity'].UserEntity],
              },
              findOne: {
                type: t['../../users/src/entities/user.entity'].UserEntity,
              },
              update: {
                type: t['../../users/src/entities/user.entity'].UserEntity,
              },
              remove: {
                type: t['../../users/src/entities/user.entity'].UserEntity,
              },
            },
          },
        ],
        [
          import('./posts.controller'),
          {
            PostsController: {
              create: { type: t['./entity/post.entity'].PostEntity },
              findAll: { type: [t['./entity/post.entity'].PostEntity] },
              findOne: { type: t['./entity/post.entity'].PostEntity },
              update: { type: t['./entity/post.entity'].PostEntity },
              remove: { type: t['./entity/post.entity'].PostEntity },
            },
          },
        ],
      ],
    },
  };
};
