// services
import { AccountService } from "@/services/accountService";
import { AuthService } from "@/services/authService";

// orchestration
import { AuthOrchestration } from "@/services/orchestration/authOrchestration";

// providers
import { BcryptHashProvider } from "@/provider/hashProvider";
import { ValidatorValidatorProvider } from "@/provider/validatorProvider";
import { InMemoryEventPublisher } from "@/provider/eventPublisherProvider";

// providers init
const bcryptHashProvider = new BcryptHashProvider();
const validatorValidatorProvider = new ValidatorValidatorProvider();
const inMemoryEventPublisher = new InMemoryEventPublisher();

// services init
export const accountService = new AccountService(
    bcryptHashProvider,
    validatorValidatorProvider,
    inMemoryEventPublisher,
);
export const authService = new AuthService(inMemoryEventPublisher);

// orchestration init
export const authOrchestration = new AuthOrchestration(
    authService,
    accountService,
    inMemoryEventPublisher,
);