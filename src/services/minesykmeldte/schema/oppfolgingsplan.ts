import { z } from 'zod'

import { DateTimeSchema } from './common'

export type OppfolgingsplanApi = z.infer<typeof OppfolgingsplanSchema>
export const OppfolgingsplanSchema = z.object({
    hendelseId: z.string(),
    mottatt: DateTimeSchema.nullable(),
    tekst: z.string().nullable(),
})
