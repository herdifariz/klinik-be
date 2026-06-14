import { Prisma, User } from '@prisma/client';
import prisma from '../config/database';

export const findByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findById = async (id: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export const create = async (data: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({
    data,
  });
};

export const update = async (id: string, data: Prisma.UserUpdateInput): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const findMany = async (params: {
  skip?: number;
  take?: number;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByWithRelationInput;
}): Promise<User[]> => {
  return prisma.user.findMany(params);
};

export const count = async (where?: Prisma.UserWhereInput): Promise<number> => {
  return prisma.user.count({ where });
};

export const userRepository = {
  findByEmail,
  findById,
  create,
  update,
  findMany,
  count,
};

export default userRepository;
