import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateRegister = [
  body('studentId')
    .isLength({ min: 10, max: 10 })
    .withMessage('学号必须是10位')
    .isNumeric()
    .withMessage('学号必须是数字'),
  body('username')
    .isLength({ min: 2, max: 20 })
    .withMessage('用户名长度必须在2-20之间')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('请输入有效的邮箱地址')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少6位'),
  validateRequest
];

export const validateLogin = [
  body('studentId')
    .notEmpty()
    .withMessage('学号不能为空'),
  body('password')
    .notEmpty()
    .withMessage('密码不能为空'),
  validateRequest
]; 