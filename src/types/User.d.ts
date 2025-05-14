interface User {
  username: string,
  roles: ('ROLE_USER' | 'ROLE_ADMIN')[],
}