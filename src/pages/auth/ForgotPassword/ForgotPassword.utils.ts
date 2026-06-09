// Utility functions for ForgotPassword

export const ForgotPasswordUtils = {
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

export const formatForgotPasswordData = (data: any) => {
  return ForgotPasswordUtils.format(data);
};

export const validateForgotPasswordData = (data: any) => {
  return ForgotPasswordUtils.validate(data);
};