import { z } from 'zod'

import {
    PeriodeEnum,
    SoknadSporsmal,
    SoknadSporsmalKriterierEnum,
    SoknadSporsmalSvartypeEnum,
    SoknadsstatusEnum,
    SporsmalTagEnum,
} from '../../../graphql/resolvers/resolvers.generated'

import { DateSchema, DateTimeSchema } from './common'

export const SoknadsperiodeSchema = z.object({
    fom: DateSchema,
    tom: DateSchema,
    sykmeldingsgrad: z.number().nullable(),
    sykmeldingstype: z.nativeEnum(PeriodeEnum),
})

export const SoknadSporsmalSvarSchema = z.object({
    verdi: z.string(),
})

export const SoknadSporsmalSchema: z.ZodSchema<SoknadSporsmal> = z.lazy(() =>
    z.object({
        id: z.string(),
        tag: z.preprocess(removeSporsmalTagPostfixNumber, z.nativeEnum(SporsmalTagEnum)),
        min: z.string().nullable(),
        max: z.string().nullable(),
        sporsmalstekst: z.string().nullable(),
        undertekst: z.string().nullable(),
        svartype: z.nativeEnum(SoknadSporsmalSvartypeEnum),
        kriterieForVisningAvUndersporsmal: z.nativeEnum(SoknadSporsmalKriterierEnum).nullable(),
        svar: z.array(SoknadSporsmalSvarSchema).nullable(),
        undersporsmal: z.array(SoknadSporsmalSchema).nullable(),
    }),
)

export const BasePreviewSoknadSchema = z.object({
    id: z.string(),
    sykmeldingId: z.string(),
    fom: DateSchema,
    tom: DateSchema,
    perioder: z.array(SoknadsperiodeSchema),
})

export type PreviewSendtSoknadApi = z.infer<typeof PrewievSendtSoknadSchema>
export const PrewievSendtSoknadSchema = BasePreviewSoknadSchema.extend({
    korrigererSoknadId: z.string().nullable(),
    lest: z.boolean(),
    sendtDato: DateTimeSchema,
    status: z.literal(SoknadsstatusEnum.Sendt),
})

export type PreviewNySoknadApi = z.infer<typeof PreviewNySoknadSchema>
export const PreviewNySoknadSchema = BasePreviewSoknadSchema.extend({
    status: z.literal(SoknadsstatusEnum.Ny),
    ikkeSendtSoknadVarsel: z.boolean(),
    ikkeSendtSoknadVarsletDato: DateTimeSchema.nullable(),
    lest: z.boolean(),
})

export type PreviewFremtidigSoknadApi = z.infer<typeof PreviewFremtidigSoknadSchema>
export const PreviewFremtidigSoknadSchema = BasePreviewSoknadSchema.extend({
    status: z.literal(SoknadsstatusEnum.Fremtidig),
})

export type PreviewSoknadApi = z.infer<typeof PreviewSoknadSchema>
export const PreviewSoknadSchema = z.discriminatedUnion('status', [
    PrewievSendtSoknadSchema,
    PreviewNySoknadSchema,
    PreviewFremtidigSoknadSchema,
])

export type SoknadApi = z.infer<typeof SoknadSchema>
export const SoknadSchema = z.object({
    id: z.string(),
    sykmeldingId: z.string(),
    fnr: z.string(),
    navn: z.string(),
    fom: DateSchema,
    tom: DateSchema,
    lest: z.boolean(),
    sendtTilNavDato: DateTimeSchema.nullable(),
    sendtDato: DateTimeSchema,
    korrigererSoknadId: z.string().nullable(),
    perioder: z.array(SoknadsperiodeSchema),
    sporsmal: z.array(SoknadSporsmalSchema),
})

export function removeSporsmalTagPostfixNumber(value: unknown): string {
    return String(value).replace(/(_\d+)$/gm, '')
}
