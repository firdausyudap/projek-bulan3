export const CommonErrorResponses = {
  ValidationError: {
    status: "error",
    code: 400,
    message: "Validation failed",
    errors: [
      {
        field: "email",
        message: "Invalid email format",
      },
    ],
  },
  Unauthorized: {
    status: "error",
    code: 401,
    message: "Unauthorized access",
    errors: [],
  },
  InternalServerError: {
    status: "error",
    code: 500,
    message: "An unexpected error occurred",
    errors: [],
  },
};
