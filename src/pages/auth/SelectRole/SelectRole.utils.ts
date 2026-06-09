// Utility functions for SelectRole

export const SelectRoleUtils = {
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

export const formatSelectRoleData = (data: any) => {
  return SelectRoleUtils.format(data);
};

export const validateSelectRoleData = (data: any) => {
  return SelectRoleUtils.validate(data);
};