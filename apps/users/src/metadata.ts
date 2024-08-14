/* eslint-disable */
export default async () => {
  const t = {
    ['./entities/user.entity']: await import(
      '../../../libs/data-access-users/src/entities/user.entity'
    ),
  };
  return {
    '@nestjs/swagger': {
      models: [
        [
          import('../../../libs/data-access-users/src/entities/user.entity'),
          {
            UserEntity: {
              id: { required: true, type: () => String },
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              username: { required: true, type: () => String },
              phoneNumber: { required: true, type: () => String },
              profileImageUrl: { required: true, type: () => String },
              email: { required: true, type: () => String },
              password: { required: true, type: () => String },
              roles: { required: true, type: () => [Object] },
              createdAt: { required: true, type: () => Date },
              updatedAt: { required: true, type: () => Date },
            },
          },
        ],
        [
          import('../../../libs/data-access-users/src/dto/create-user.dto'),
          {
            CreateUserDto: {
              firstName: { required: true, type: () => String },
              lastName: { required: true, type: () => String },
              username: { required: true, type: () => String },
              phoneNumber: { required: false, type: () => String },
              email: {
                required: true,
                type: () => String,
                description: "A list of user's roles",
                example: 'email@example.com',
              },
              password: { required: true, type: () => String },
              profileImageUrl: { required: false, type: () => String },
            },
          },
        ],
        [
          import('../../../libs/data-access-users/src/dto/update-user.dto'),
          {
            UpdateUserDto: {
              profileImageUrl: { required: false, type: () => String },
            },
          },
        ],
      ],
      controllers: [
        [
          import('./users.controller'),
          {
            UsersController: {
              create: { type: t['./entities/user.entity'].UserEntity },
              findAll: { type: [t['./entities/user.entity'].UserEntity] },
              findOne: { type: t['./entities/user.entity'].UserEntity },
              update: { type: t['./entities/user.entity'].UserEntity },
              remove: { type: t['./entities/user.entity'].UserEntity },
            },
          },
        ],
      ],
    },
  };
};
