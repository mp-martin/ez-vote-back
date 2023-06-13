export interface UserEntity {
    userId?: string;
    userLogin: string;
    userHash: string;
    userSalt: string
}

export interface UserLoginOrRegisterRequest {
    userLogin: string;
    userPassword: string;
}