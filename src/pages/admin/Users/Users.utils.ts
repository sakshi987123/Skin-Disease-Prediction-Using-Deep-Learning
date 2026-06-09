// Utility functions for Users

export const UsersUtils = {
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

export const formatUsersData = (data: any) => {
  return UsersUtils.format(data);
};

export const validateUsersData = (data: any) => {
  return UsersUtils.validate(data);
};