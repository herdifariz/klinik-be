import userRepository from '../repositories/user.repository';
import { CreateUserInput, UpdateUserInput, ChangeRoleInput, ChangePasswordInput, ListUsersQuery } from '../schemas/user.schema';
import { hashPassword, comparePassword } from '../utils/password';
import { User, Prisma } from '@prisma/client';

export const createUser = async (data: CreateUserInput): Promise<User> => {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    const error: any = new Error('Email already exists');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(data.password);

  return userRepository.create({
    ...data,
    password: hashedPassword,
  });
};

export const listUsers = async (query: ListUsersQuery) => {
  const { page, limit, role, isActive, search, sortBy, order } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {};
  if (role) where.role = role;
  if (isActive !== undefined) where.isActive = isActive;
  if (search) {
    where.OR = [
      { fullName: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    userRepository.findMany({
      skip,
      take: limit,
      where,
      orderBy: { [sortBy]: order },
    }),
    userRepository.count(where),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getUserById = async (id: string): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export const updateUser = async (id: string, data: UpdateUserInput): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (data.email && data.email !== user.email) {
    const existingEmail = await userRepository.findByEmail(data.email);
    if (existingEmail) {
      const error: any = new Error('Email already exists');
      error.statusCode = 409;
      throw error;
    }
  }

  return userRepository.update(id, data);
};

export const deleteUser = async (id: string): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return userRepository.update(id, { isActive: false });
};

export const changeRole = async (id: string, data: ChangeRoleInput): Promise<User> => {
  const user = await userRepository.findById(id);
  if (!user) {
    const error: any = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // In a real app, you might want to log the reason
  console.log(`Changing role for user ${id} from ${user.role} to ${data.role}. Reason: ${data.reason}`);

  return userRepository.update(id, { role: data.role });
};

// export const changePassword = async (id: string, data: ChangePasswordInput): Promise<User> => {
//   const user = await userRepository.findById(id);
//   if (!user) {
//     const error: any = new Error('User not found');
//     error.statusCode = 404;
//     throw error;
//   }

//   const isPasswordValid = await comparePassword(data.oldPassword, user.password);
//   if (!isPasswordValid) {
//     const error: any = new Error('Invalid old password');
//     error.statusCode = 400;
//     throw error;
//   }

//   const hashedPassword = await hashPassword(data.newPassword);
//   return userRepository.update(id, { password: hashedPassword });
// };

export const userService = {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeRole,
  // changePassword,
};

export default userService;
