
// interfaces
export interface DomainEventDTO {
    type: string;
    payload: any;
    timestamp?: Date;
}
export interface IEventPublisherProvider {
    subscribe(eventType: string, handler: (event: DomainEventDTO) => Promise<void>): Promise<void>
    publish(event: DomainEventDTO): Promise<void>;
}



export class InMemoryEventPublisher implements IEventPublisherProvider {

    private subscribers: Map<string, ((event: DomainEventDTO) => Promise<void>)[]> = new Map();

    async subscribe(eventType: string, handler: (event: DomainEventDTO) => Promise<void>): Promise<void> {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType)!.push(handler);
    }

    async publish(event: DomainEventDTO) {
        const handlers = this.subscribers.get(event.type) || [];
        await Promise.all(handlers.map(handler => handler({
            ...event,
            timestamp: event.timestamp ? event.timestamp : new Date(),
        })));
    }
}