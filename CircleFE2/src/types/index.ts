interface IRegister {
    fullname : string;
    email: string;
    password: string;
}

interface ILogin {
    email: string;
    password: string;
}

interface UserProfileType {
    id: string;
    username: string;
    fullname: string;
    email: string;
    password: null;  
    profile_picture: string;
    bio: string;
    created_at: string;    
    updated_at: string;       
    followers: FollowType[]    
    followings: FollowType[]   
}

interface FollowType {
    id: string;
    follower: string;
    following: string;
}