import userRepository from '../repositories/user.repository';
import { LoginInput, RefreshTokenInput } from '../schemas/auth.schema';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyToken, verifyRefreshToken } from '../utils/jwt';
import { User } from '@prisma/client';



export const login = async (data: LoginInput): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    const error: any = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await comparePassword(data.password, user.password);
  if (!isPasswordValid) {
    const error: any = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user, accessToken, refreshToken };
};

export const refreshToken = async (data: RefreshTokenInput): Promise<{ accessToken: string }> => {
  try {
    const payload = verifyRefreshToken(data.refreshToken);
    const user = await userRepository.findById(payload.id);
    
    if (!user) {
      const error: any = new Error('User not found');
      error.statusCode = 401;
      throw error;
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { accessToken };
  } catch (error) {
    const err: any = new Error('Invalid refresh token');
    err.statusCode = 401;
    throw err;
  }
};

// export const forgotPassword = async (email: string): Promise<void> => {
//   const user = await userRepository.findByEmail(email);
//   if (!user) {
//     // We don't want to leak if an email exists or not
//     return;
//   }
  
//   // Implementation for sending email would go here
//   console.log(`Forgot password requested for: ${email}`);
// };

// export const resetPassword = async (data: ResetPasswordInput): Promise<User> => {
//   // In a real app, you would verify a reset token from DB/Redis
//   // For now, let's assume the token is just the user ID for demonstration (NOT SECURE)
//   const userId = data.params.token; 
//   const hashedPassword = await hashPassword(data.body.newPassword);
  
//   return userRepository.update(userId, {
//     password: hashedPassword,
//   });
// };

export const authService = {
  login,
  refreshToken,
  // forgotPassword,
  // resetPassword,
};

export default authService;
