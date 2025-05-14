interface AccessToken {
  exp: number,
  iat: number,
  roles: ('ROLE_USER' | 'ROLE_ADMIN')[],
  sub: string,
}