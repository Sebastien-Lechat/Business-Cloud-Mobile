export interface FacebookDataI {
    id: string;
    email: string;
    name: string;
    birthday: string;
    picture: {
        data: {
            width: number,
            height: number,
            url: number
        }
    };
}

export interface GoogleDataI {
    id: string;
    idToken: string;
    imageUrl: string;
    email: string;
    familyName: string;
    givenName: string;
}
