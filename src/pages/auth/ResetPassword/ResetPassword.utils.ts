// Utility functions for ResetPassword

export const ResetPasswordUtils = {
  format: (data: any) => {
    return data;
  },
  
  validate: (data: any) => {
    return true;
  },
  
  transform: (data: any) => {
    return data;
  }
};

export const formatResetPasswordData = (data: any) => {
  return ResetPasswordUtils.format(data);
};

export const validateResetPasswordData = (data: any) => {
  return ResetPasswordUtils.validate(data);
};