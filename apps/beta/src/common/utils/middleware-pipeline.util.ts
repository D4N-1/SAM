import type { CommandContext, SamMiddleware } from "../interfaces/middleware.interface.js";


export class MiddlewarePipeline {
    private middlewares: SamMiddleware[] = [];

    public use(middleware: SamMiddleware): this {
        this.middlewares.push(middleware)
        return this
    }

    public async execute(context: CommandContext, targetRoute: () => Promise<void> ): Promise<void> {

        let index = 0;

        const next = async(): Promise<void> => {

            if (index >= this.middlewares.length) return await targetRoute();

            const middleware = this.middlewares[index++];
            
            await middleware!.use(context, next);
            
        };

        await next();
    }
}