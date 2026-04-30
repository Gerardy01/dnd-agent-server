import { OAuth2Client } from 'google-auth-library';

// types and interfaces
export interface IGoogleOauthProvider {
    verifyCodeAndGetEmail(code: string): Promise<string>;
    generateAuthUrl(): string;
}

export class GoogleOauthProvider implements IGoogleOauthProvider {
    private client: OAuth2Client;

    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_CALLBACK_ENDPOINT;

        this.client = new OAuth2Client(clientId, clientSecret, redirectUri);
    }

    generateAuthUrl(): string {
        return this.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['email', 'profile'],
        });
    }

    async verifyCodeAndGetEmail(code: string): Promise<string> {
        try {
            const { tokens } = await this.client.getToken(code);

            if (!tokens.id_token) {
                throw new Error("No ID token returned from Google");
            }

            const ticket = await this.client.verifyIdToken({
                idToken: tokens.id_token,
                audience: process.env.GOOGLE_CLIENT_ID || "",
            });

            const payload = ticket.getPayload();
            if (!payload || !payload.email) {
                throw new Error("Could not retrieve email from Google");
            }

            return payload.email;
        } catch (error) {
            throw new Error("Invalid Google auth code");
        }
    }
}
