import * as z from 'zod';
import * as zm from 'zod/mini';
import type {StandardSchemaV1} from '@standard-schema/spec';

type AnyZodType = z.ZodType | zm.ZodMiniType;

type ZodInferAny<T extends AnyZodType> = T extends z.ZodType ? z.infer<T> : zm.infer<T>;

const ZodUserSchema = z.object({name: z.string()});

const ZodMiniUserSchema = zm.object({name: zm.string()});

async function zodParsing<T extends AnyZodType>(schema: T, payload: unknown): Promise<ZodInferAny<T>> {
    const result = await schema.parseAsync(payload);

    return result as ZodInferAny<T>;
}

async function standardParsing<T extends StandardSchemaV1>(
    schema: T,
    input: StandardSchemaV1.InferInput<T>
): Promise<StandardSchemaV1.InferOutput<T>> {
    let result = schema['~standard'].validate(input);
    if (result instanceof Promise) result = await result;

    if (result.issues) {
        throw new Error(JSON.stringify(result.issues, null, 2));
    }

    return result.value;
}

async function main() {
    const zodUser = await zodParsing(ZodUserSchema, {name: 'Kamaal'});
    const zodMiniUser = await zodParsing(ZodMiniUserSchema, {name: 'Laamak'});
    console.log('zodUser', zodUser.name);
    console.log('zodMiniUser', zodMiniUser.name);

    const standardUser = await standardParsing(ZodUserSchema, {name: 'Kamaal'});
    const standardMiniUser = await standardParsing(ZodMiniUserSchema, {name: 'Laamak'});
    console.log('standardUser', standardUser.name);
    console.log('standardMiniUser', standardMiniUser.name);
}

main();
