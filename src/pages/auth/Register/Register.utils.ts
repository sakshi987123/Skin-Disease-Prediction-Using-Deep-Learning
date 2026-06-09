// Utility functions for Register

export const RegisterUtils = {
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

export const formatRegisterData = (data: any) => {
  return RegisterUtils.format(data);
};

export const validateRegisterData = (data: any) => {
  return RegisterUtils.validate(data);
};