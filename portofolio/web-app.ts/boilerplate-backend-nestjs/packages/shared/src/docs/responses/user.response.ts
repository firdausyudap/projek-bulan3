export const UserResponses = {
  SingleUser: {
    status: "success",
    message: "User retrieved successfully",
    data: {
      id: "1",
      full_name: "John Doe",
      email: "john@example.com",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  },
  UserList: {
    status: "success",
    message: "Users retrieved successfully",
    data: [
      {
        id: "1",
        full_name: "John Doe",
        email: "john@example.com",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ],
  },
};
