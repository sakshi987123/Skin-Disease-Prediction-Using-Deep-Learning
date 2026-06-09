// Utility functions for RegistrationSuccess

export const RegistrationSuccessUtils = {
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

export const formatRegistrationSuccessData = (data: any) => {
  return RegistrationSuccessUtils.format(data);
};

export const validateRegistrationSuccessData = (data: any) => {
  return RegistrationSuccessUtils.validate(data);
};