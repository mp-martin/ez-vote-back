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

export interface AuthedUserShowPollsRequest {
    userId: string;
    userLogin: string;
}

export interface AuthPositiveResponse {
    success: boolean
    user: {userId: string, userLogin: string}
    token: string
    expires: string
}