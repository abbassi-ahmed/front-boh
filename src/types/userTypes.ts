export type TUser = {
  id: number;
  lastname: string;
  email: string;
  username: string;
  phone: string;
  createdAt: Date;
  percentage: number;
  modifiedAt: Date;
};
export type UserFormData = {
  id?: number;
  email: string;
  username: string;
  phone: string;
  percentage: number;
  password?: string;
  confirmPassword?: string;
};
