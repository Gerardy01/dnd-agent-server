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

// providers init
const bcryptHashProvider = new BcryptHashProvider();
const validatorValidatorProvider = new ValidatorValidatorProvider();
const inMemoryEventPublisher = new InMemoryEventPublisher();
const jwtProvider = new JwtProvider();

// services init
export const accountService = new AccountService(
    bcryptHashProvider,
    validatorValidatorProvider,
);
export const authService = new AuthService(inMemoryEventPublisher, jwtProvider);

// orchestration init
export const authOrchestration = new AuthOrchestration(
    authService,
    accountService,
);
export const accountOrchestration = new AccountOrchestration(
    accountService,
    authService,
);