// Utility functions for VerifyOTP

export const VerifyOTPUtils = {
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

export const formatVerifyOTPData = (data: any) => {
  return VerifyOTPUtils.format(data);
};

export const validateVerifyOTPData = (data: any) => {
  return VerifyOTPUtils.validate(data);
};