
export const required = (val:any) => val && val.length;
export const requiredNum = (val:any) => !!(val);
export const maxLength = (len:any) => (val:any) => !(val) || (val.length <= len);
export const minLength = (len:any) => (val:any) => (val) && (val.length >= len);
export const maxVal = (len:any) => (val:any) => !(val) || (val<= len);
export const minVal = (len:any) => (val:any) => (val) && (val>= len);
export const isNumber = (val:any) => !isNaN(Number(val));
export const validEmail = (val:any) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(val);
export const matchcreds = (original:any) => (val:any) =>  (val===original);
