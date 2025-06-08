interface User {
  id: number,
  username: string,
  roles: ('ROLE_USER' | 'ROLE_ADMIN')[],
}