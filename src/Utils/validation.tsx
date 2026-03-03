export type User = {
  username: string;
  password: string;
  email: string;
  phoneNumber: number;
};
export type RegistrationErrors = {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

export const validationRegistration = (
  username: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): RegistrationErrors => {
  const errors: RegistrationErrors = {};

  if (!username.trim()) {
    errors.username = "username is required";
  } else if (username.length < 3) {
    errors.username = "username must be of atleast 3 character";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(email)) {
    errors.email = "Invalid email format";
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phone.trim()) {
    errors.phone = "Phone number is required";
  } else if (!phoneRegex.test(phone)) {
    errors.phone = "Phone must be 10 digits";
  }

  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@\$&*_]).{8,}$/;

  if (!password.trim()) {
    errors.password = "Password is required";
  } else if (!strongPassword.test(password)) {
    errors.password =
      "Password must be 8+ chars, include uppercase, lowercase, number & special character (#,@,$,&,*,_)";
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};
