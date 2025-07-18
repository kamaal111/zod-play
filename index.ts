import * as z from 'zod';
import * as zm from 'zod/mini';

type AnyZodType = z.ZodType | zm.ZodMiniType;

type ZodInferAny<T extends AnyZodType> = T extends z.ZodType ? z.infer<T> : zm.infer<T>;

const ZodUserSchema = z.object({name: z.string()});

const ZodMiniUserSchema = zm.object({name: zm.string()});

function zodParsing<T extends AnyZodType>(schema: T, payload: unknown): ZodInferAny<T> {
    console.log('zod vendor', schema['~standard'].vendor);
    return schema.parse(payload) as ZodInferAny<T>;
}

const zodUser = zodParsing(ZodUserSchema, {name: 'Kamaal'});
const zodMiniUser = zodParsing(ZodMiniUserSchema, {name: 'Kamaal'});
console.log('zodUser', zodUser.name);
console.log('zodMiniUser', zodMiniUser.name);
