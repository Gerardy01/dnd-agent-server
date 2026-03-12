// services
import { AccountService } from "@/services/accountService";
import { AuthService } from "@/services/authService";
import { NotificationService } from "@/services/notificationService";

// providers
import { BcryptHashProvider } from "@/provider/hashProvider";
import { ValidatorValidatorProvider } from "@/provider/validatorProvider";
import { InMemoryEventPublisher } from "@/provider/eventPublisherProvider";
import { JwtProvider } from "@/provider/jwtProvider";
import { CryptoCryptProvider } from "@/provider/cryptProvider";
import { NodemailerEmailProvider } from "@/provider/emailProvider";

// providers init
const bcryptHashProvider = new BcryptHashProvider();
const validatorValidatorProvider = new ValidatorValidatorProvider();
const inMemoryEventPublisher = new InMemoryEventPublisher();
const jwtProvider = new JwtProvider();
const cryptoCryptProvider = new CryptoCryptProvider();
const nodeMailerEmailProvider = new NodemailerEmailProvider();

// services init
export const accountService = new AccountService(
    bcryptHashProvider,
    validatorValidatorProvider,
);
export const authService = new AuthService(
    inMemoryEventPublisher,
    jwtProvider,
    cryptoCryptProvider,
);
export const notificationService = new NotificationService(
    nodeMailerEmailProvider,
);