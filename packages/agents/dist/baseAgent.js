export function createAgent(config) {
    const { name, executor, hooks } = config;
    return async function runAgent(input, context) {
        const safeContext = context ?? {};
        try {
            hooks?.beforeExecute && (await hooks.beforeExecute(input, safeContext));
            const output = await executor(input, safeContext);
            hooks?.afterExecute && (await hooks.afterExecute(output, safeContext));
            safeContext.logger?.info?.(`${name} agent executed successfully`);
            return output;
        }
        catch (error) {
            safeContext.logger?.error?.(`${name} agent failed`, { error });
            hooks?.onError && (await hooks.onError(error, safeContext, input));
            throw error;
        }
    };
}
