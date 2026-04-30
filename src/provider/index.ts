// providers
import { BcryptHashProvider } from "@/provider/hashProvider";
import { ValidatorValidatorProvider } from "@/provider/validatorProvider";
import { InMemoryEventPublisher } from "@/provider/eventPublisherProvider";
import { JwtProvider } from "@/provider/jwtProvider";
import { CryptoCryptProvider } from "@/provider/cryptProvider";
import { NodemailerEmailProvider } from "@/provider/emailProvider";
import { CloudflareR2StorageProvider } from "@/provider/storageProvider";
import { GoogleOauthProvider } from "@/provider/googleOauthProvider";



// providers init
export const bcryptHashProvider = new BcryptHashProvider();
export const validatorValidatorProvider = new ValidatorValidatorProvider();
export const inMemoryEventPublisher = new InMemoryEventPublisher();
export const jwtProvider = new JwtProvider();
export const cryptoCryptProvider = new CryptoCryptProvider();
export const nodeMailerEmailProvider = new NodemailerEmailProvider();
export const cloudflareR2StorageProvider = new CloudflareR2StorageProvider();
export const googleOauthProvider = new GoogleOauthProvider();
