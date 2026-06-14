import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { sendSuccess } from '../utils/response';



export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);
    const { password, ...userWithoutPassword } = user;

    res.cookie("accessToken", accessToken, {
      maxAge: 86400 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 86400 * 1000, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return sendSuccess(res, {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
      expiresIn: 86400,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refreshToken(req.body);
    
    res.cookie("accessToken", result.accessToken, {
      maxAge: 86400 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return sendSuccess(res, {
      accessToken: result.accessToken,
      expiresIn: 3600,
    }, 'Token refreshed');
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendSuccess(res, null, 'Logged out successfully');
};

// export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     await authService.forgotPassword(req.body.email);
//     return sendSuccess(res, { email: req.body.email, expiresIn: 3600 }, 'Password reset email sent');
//   } catch (error) {
//     next(error);
//   }
// };

// export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const user = await authService.resetPassword({
//       params: { token: req.params.token },
//       body: req.body
//     });
    
//     return sendSuccess(res, {
//       id: user.id,
//       resetAt: new Date().toISOString()
//     }, 'Password reset successful');
//   } catch (error) {
//     next(error);
//   }
// };

export const authController = {
  login,
  refreshToken,
  logout,
  // forgotPassword,
  // resetPassword,
};

export default authController;
