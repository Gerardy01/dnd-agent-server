// services
import { AccountService } from "@/services/accountService";
import { AuthService } from "@/services/authService";

// orchestration
import { AuthOrchestration } from "@/services/orchestration/authOrchestration";
import { AccountOrchestration } from "@/services/orchestration/accountOrchestration";

// providers
import { BcryptHashProvider } from "@/provider/hashProvider";
import { ValidatorValidatorProvider } from "@/provider/validatorProvider";
import { InMemoryEventPublisher } from "@/provider/eventPublisherProvider";
import { JwtProvider } from "@/provider/jwtProvider";
import { CryptoCryptProvider } from "@/provider/cryptProvider";

// providers init
const bcryptHashProvider = new BcryptHashProvider();
const validatorValidatorProvider = new ValidatorValidatorProvider();
const inMemoryEventPublisher = new InMemoryEventPublisher();
const jwtProvider = new JwtProvider();
const cryptoCryptProvider = new CryptoCryptProvider();

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

// orchestration init
export const authOrchestration = new AuthOrchestration(
    authService,
    accountService,
);
export const accountOrchestration = new AccountOrchestration(
    accountService,
    authService,
);