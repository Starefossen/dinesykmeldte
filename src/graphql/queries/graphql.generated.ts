import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    Date: string
    DateTime: string
}

export type AktivitetIkkeMulig = FomTom & {
    __typename: 'AktivitetIkkeMulig'
    arbeidsrelatertArsak?: Maybe<ArbeidsrelatertArsak>
    fom: Scalars['Date']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Aktivitetsvarsel = {
    __typename: 'Aktivitetsvarsel'
    hendelseId: Scalars['ID']
    lest?: Maybe<Scalars['DateTime']>
    mottatt: Scalars['DateTime']
}

export type Arbeidsgiver = {
    __typename: 'Arbeidsgiver'
    navn?: Maybe<Scalars['String']>
}

export type ArbeidsrelatertArsak = {
    __typename: 'ArbeidsrelatertArsak'
    arsak: Array<ArbeidsrelatertArsakEnum>
    beskrivelse?: Maybe<Scalars['String']>
}

export enum ArbeidsrelatertArsakEnum {
    Annet = 'ANNET',
    ManglendeTilrettelegging = 'MANGLENDE_TILRETTELEGGING',
}

export type Avventende = FomTom & {
    __typename: 'Avventende'
    fom: Scalars['Date']
    tilrettelegging?: Maybe<Scalars['String']>
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type BasePreviewSoknad = {
    fom: Scalars['Date']
    id: Scalars['String']
    perioder: Array<Soknadsperiode>
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type Behandler = {
    __typename: 'Behandler'
    hprNummer?: Maybe<Scalars['String']>
    navn: Scalars['String']
    telefon?: Maybe<Scalars['String']>
}

export type Behandlingsdager = FomTom & {
    __typename: 'Behandlingsdager'
    behandlingsdager: Scalars['Int']
    fom: Scalars['Date']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Dialogmote = {
    __typename: 'Dialogmote'
    hendelseId: Scalars['String']
    mottatt?: Maybe<Scalars['DateTime']>
    tekst?: Maybe<Scalars['String']>
}

export type FomTom = {
    fom: Scalars['Date']
    tom: Scalars['Date']
}

export type Gradert = FomTom & {
    __typename: 'Gradert'
    fom: Scalars['Date']
    grad: Scalars['Int']
    reisetilskudd: Scalars['Boolean']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Mutation = {
    __typename: 'Mutation'
    markAktivitetvarselRead?: Maybe<Scalars['Boolean']>
    read?: Maybe<Scalars['Boolean']>
    unlinkSykmeldt?: Maybe<Scalars['Boolean']>
}

export type MutationMarkAktivitetvarselReadArgs = {
    sykmeldtId: Scalars['ID']
}

export type MutationReadArgs = {
    id: Scalars['ID']
    type: ReadType
}

export type MutationUnlinkSykmeldtArgs = {
    sykmeldtId: Scalars['ID']
}

export type Oppfolgingsplan = {
    __typename: 'Oppfolgingsplan'
    hendelseId: Scalars['String']
    mottatt?: Maybe<Scalars['DateTime']>
    tekst?: Maybe<Scalars['String']>
}

export type Periode = AktivitetIkkeMulig | Avventende | Behandlingsdager | Gradert | Reisetilskudd

export enum PeriodeEnum {
    AktivitetIkkeMulig = 'AKTIVITET_IKKE_MULIG',
    Avventende = 'AVVENTENDE',
    Behandlingsdager = 'BEHANDLINGSDAGER',
    Gradert = 'GRADERT',
    Reisetilskudd = 'REISETILSKUDD',
}

export type PreviewFremtidigSoknad = BasePreviewSoknad & {
    __typename: 'PreviewFremtidigSoknad'
    fom: Scalars['Date']
    id: Scalars['String']
    perioder: Array<Soknadsperiode>
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type PreviewNySoknad = BasePreviewSoknad & {
    __typename: 'PreviewNySoknad'
    fom: Scalars['Date']
    id: Scalars['String']
    ikkeSendtSoknadVarsel: Scalars['Boolean']
    ikkeSendtSoknadVarsletDato?: Maybe<Scalars['DateTime']>
    lest: Scalars['Boolean']
    perioder: Array<Soknadsperiode>
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type PreviewSendtSoknad = BasePreviewSoknad & {
    __typename: 'PreviewSendtSoknad'
    fom: Scalars['Date']
    id: Scalars['String']
    korrigererSoknadId?: Maybe<Scalars['String']>
    lest: Scalars['Boolean']
    perioder: Array<Soknadsperiode>
    sendtDato: Scalars['DateTime']
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type PreviewSoknad = PreviewFremtidigSoknad | PreviewNySoknad | PreviewSendtSoknad

export type PreviewSykmeldt = {
    __typename: 'PreviewSykmeldt'
    aktivitetsvarsler: Array<Aktivitetsvarsel>
    dialogmoter: Array<Dialogmote>
    fnr: Scalars['String']
    friskmeldt: Scalars['Boolean']
    narmestelederId: Scalars['String']
    navn: Scalars['String']
    oppfolgingsplaner: Array<Oppfolgingsplan>
    orgnavn: Scalars['String']
    orgnummer: Scalars['String']
    previewSoknader: Array<PreviewSoknad>
    sykmeldinger: Array<Sykmelding>
}

export type Query = {
    __typename: 'Query'
    mineSykmeldte?: Maybe<Array<PreviewSykmeldt>>
    soknad?: Maybe<Soknad>
    sykmelding?: Maybe<Sykmelding>
    virksomheter: Array<Virksomhet>
}

export type QuerySoknadArgs = {
    soknadId: Scalars['ID']
}

export type QuerySykmeldingArgs = {
    sykmeldingId: Scalars['ID']
}

export enum ReadType {
    Aktivitetsvarsel = 'Aktivitetsvarsel',
    Hendelse = 'Hendelse',
    Soknad = 'Soknad',
    Sykmelding = 'Sykmelding',
}

export type Reisetilskudd = FomTom & {
    __typename: 'Reisetilskudd'
    fom: Scalars['Date']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Soknad = {
    __typename: 'Soknad'
    fnr: Scalars['String']
    fom: Scalars['Date']
    id: Scalars['ID']
    korrigererSoknadId?: Maybe<Scalars['String']>
    lest: Scalars['Boolean']
    navn: Scalars['String']
    perioder: Array<Soknadsperiode>
    sendtDato: Scalars['DateTime']
    sendtTilNavDato?: Maybe<Scalars['DateTime']>
    sporsmal: Array<SoknadSporsmal>
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type SoknadSporsmal = {
    __typename: 'SoknadSporsmal'
    id: Scalars['ID']
    kriterieForVisningAvUndersporsmal?: Maybe<SoknadSporsmalKriterierEnum>
    max?: Maybe<Scalars['String']>
    min?: Maybe<Scalars['String']>
    sporsmalstekst?: Maybe<Scalars['String']>
    svar?: Maybe<Array<Maybe<SoknadSporsmalSvar>>>
    svartype: SoknadSporsmalSvartypeEnum
    tag: SporsmalTagEnum
    undersporsmal?: Maybe<Array<Maybe<SoknadSporsmal>>>
    undertekst?: Maybe<Scalars['String']>
}

export enum SoknadSporsmalKriterierEnum {
    Checked = 'CHECKED',
    Ja = 'JA',
    Nei = 'NEI',
}

export type SoknadSporsmalSvar = {
    __typename: 'SoknadSporsmalSvar'
    verdi: Scalars['String']
}

export enum SoknadSporsmalSvartypeEnum {
    Belop = 'BELOP',
    Checkbox = 'CHECKBOX',
    CheckboxGruppe = 'CHECKBOX_GRUPPE',
    CheckboxPanel = 'CHECKBOX_PANEL',
    Dato = 'DATO',
    Datoer = 'DATOER',
    Fritekst = 'FRITEKST',
    IkkeRelevant = 'IKKE_RELEVANT',
    InfoBehandlingsdager = 'INFO_BEHANDLINGSDAGER',
    JaNei = 'JA_NEI',
    Kilometer = 'KILOMETER',
    Kvittering = 'KVITTERING',
    Land = 'LAND',
    Periode = 'PERIODE',
    Perioder = 'PERIODER',
    Prosent = 'PROSENT',
    Radio = 'RADIO',
    RadioGruppe = 'RADIO_GRUPPE',
    RadioGruppeTimerProsent = 'RADIO_GRUPPE_TIMER_PROSENT',
    RadioGruppeUkekalender = 'RADIO_GRUPPE_UKEKALENDER',
    Tall = 'TALL',
    Timer = 'TIMER',
}

export type Soknadsperiode = FomTom & {
    __typename: 'Soknadsperiode'
    fom: Scalars['Date']
    sykmeldingsgrad?: Maybe<Scalars['Int']>
    sykmeldingstype: PeriodeEnum
    tom: Scalars['Date']
}

export enum SoknadsstatusEnum {
    Fremtidig = 'FREMTIDIG',
    Ny = 'NY',
    Sendt = 'SENDT',
}

export enum SporsmalTagEnum {
    AndreInntektskilder = 'ANDRE_INNTEKTSKILDER',
    Ansvarserklaring = 'ANSVARSERKLARING',
    Arbeidsgiver = 'ARBEIDSGIVER',
    ArbeidsledigUtland = 'ARBEIDSLEDIG_UTLAND',
    ArbeidUtenforNorge = 'ARBEID_UTENFOR_NORGE',
    BekreftOpplysninger = 'BEKREFT_OPPLYSNINGER',
    BekreftOpplysningerUtland = 'BEKREFT_OPPLYSNINGER_UTLAND',
    BekreftOpplysningerUtlandInfo = 'BEKREFT_OPPLYSNINGER_UTLAND_INFO',
    BetalerArbeidsgiver = 'BETALER_ARBEIDSGIVER',
    BilBompenger = 'BIL_BOMPENGER',
    BilBompengerBelop = 'BIL_BOMPENGER_BELOP',
    BilDatoer = 'BIL_DATOER',
    BilTilDaglig = 'BIL_TIL_DAGLIG',
    BrukteReisetilskuddet = 'BRUKTE_REISETILSKUDDET',
    Egenmeldinger = 'EGENMELDINGER',
    EgenmeldingerNar = 'EGENMELDINGER_NAR',
    EnkeltstaendeBehandlingsdager = 'ENKELTSTAENDE_BEHANDLINGSDAGER',
    EnkeltstaendeBehandlingsdagerUke = 'ENKELTSTAENDE_BEHANDLINGSDAGER_UKE',
    Ferie = 'FERIE',
    FerieNar = 'FERIE_NAR',
    FerieNarV2 = 'FERIE_NAR_V2',
    FeriePermisjonUtland = 'FERIE_PERMISJON_UTLAND',
    FeriePermisjonUtlandHva = 'FERIE_PERMISJON_UTLAND_HVA',
    FerieV2 = 'FERIE_V2',
    FravarForSykmeldingen = 'FRAVAR_FOR_SYKMELDINGEN',
    FravarForSykmeldingenNar = 'FRAVAR_FOR_SYKMELDINGEN_NAR',
    FraverForBehandling = 'FRAVER_FOR_BEHANDLING',
    Friskmeldt = 'FRISKMELDT',
    FriskmeldtStart = 'FRISKMELDT_START',
    Fulltidsstudium = 'FULLTIDSSTUDIUM',
    HvilkeAndreInntektskilder = 'HVILKE_ANDRE_INNTEKTSKILDER',
    HvorMangeTimer = 'HVOR_MANGE_TIMER',
    HvorMangeTimerPerUke = 'HVOR_MANGE_TIMER_PER_UKE',
    HvorMyeHarDuJobbet = 'HVOR_MYE_HAR_DU_JOBBET',
    HvorMyeProsent = 'HVOR_MYE_PROSENT',
    HvorMyeProsentVerdi = 'HVOR_MYE_PROSENT_VERDI',
    HvorMyeTimer = 'HVOR_MYE_TIMER',
    HvorMyeTimerVerdi = 'HVOR_MYE_TIMER_VERDI',
    IkkeSoktUtenlandsoppholdInformasjon = 'IKKE_SOKT_UTENLANDSOPPHOLD_INFORMASJON',
    InntektskildeAndreArbeidsforhold = 'INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD',
    InntektskildeAndreArbeidsforholdErDuSykmeldt = 'INNTEKTSKILDE_ANDRE_ARBEIDSFORHOLD_ER_DU_SYKMELDT',
    InntektskildeAnnet = 'INNTEKTSKILDE_ANNET',
    InntektskildeArbeidsforhold = 'INNTEKTSKILDE_ARBEIDSFORHOLD',
    InntektskildeArbeidsforholdErDuSykmeldt = 'INNTEKTSKILDE_ARBEIDSFORHOLD_ER_DU_SYKMELDT',
    InntektskildeFosterhjem = 'INNTEKTSKILDE_FOSTERHJEM',
    InntektskildeFosterhjemErDuSykmeldt = 'INNTEKTSKILDE_FOSTERHJEM_ER_DU_SYKMELDT',
    InntektskildeFrilanser = 'INNTEKTSKILDE_FRILANSER',
    InntektskildeFrilanserErDuSykmeldt = 'INNTEKTSKILDE_FRILANSER_ER_DU_SYKMELDT',
    InntektskildeFrilanserSelvstendig = 'INNTEKTSKILDE_FRILANSER_SELVSTENDIG',
    InntektskildeFrilanserSelvstendigErDuSykmeldt = 'INNTEKTSKILDE_FRILANSER_SELVSTENDIG_ER_DU_SYKMELDT',
    InntektskildeJordbruker = 'INNTEKTSKILDE_JORDBRUKER',
    InntektskildeJordbrukerErDuSykmeldt = 'INNTEKTSKILDE_JORDBRUKER_ER_DU_SYKMELDT',
    InntektskildeOmsorgslonn = 'INNTEKTSKILDE_OMSORGSLONN',
    InntektskildeOmsorgslonnErDuSykmeldt = 'INNTEKTSKILDE_OMSORGSLONN_ER_DU_SYKMELDT',
    InntektskildeSelvstendig = 'INNTEKTSKILDE_SELVSTENDIG',
    InntektskildeSelvstendigDagmamma = 'INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA',
    InntektskildeSelvstendigDagmammaErDuSykmeldt = 'INNTEKTSKILDE_SELVSTENDIG_DAGMAMMA_ER_DU_SYKMELDT',
    InntektskildeSelvstendigErDuSykmeldt = 'INNTEKTSKILDE_SELVSTENDIG_ER_DU_SYKMELDT',
    JobbetDu_100Prosent = 'JOBBET_DU_100_PROSENT',
    JobbetDuGradert = 'JOBBET_DU_GRADERT',
    KmHjemJobb = 'KM_HJEM_JOBB',
    Kvitteringer = 'KVITTERINGER',
    Land = 'LAND',
    OffentligTransportBelop = 'OFFENTLIG_TRANSPORT_BELOP',
    OffentligTransportTilDaglig = 'OFFENTLIG_TRANSPORT_TIL_DAGLIG',
    PapirsykmeldingNar = 'PAPIRSYKMELDING_NAR',
    Perioder = 'PERIODER',
    Periodeutland = 'PERIODEUTLAND',
    Permisjon = 'PERMISJON',
    PermisjonNar = 'PERMISJON_NAR',
    PermisjonNarV2 = 'PERMISJON_NAR_V2',
    PermisjonV2 = 'PERMISJON_V2',
    PermittertNaa = 'PERMITTERT_NAA',
    PermittertNaaNar = 'PERMITTERT_NAA_NAR',
    PermittertPeriode = 'PERMITTERT_PERIODE',
    PermittertPeriodeNar = 'PERMITTERT_PERIODE_NAR',
    ReiseMedBil = 'REISE_MED_BIL',
    Sykmeldingsgrad = 'SYKMELDINGSGRAD',
    TidligereEgenmelding = 'TIDLIGERE_EGENMELDING',
    TidligerePapirsykmelding = 'TIDLIGERE_PAPIRSYKMELDING',
    TidligereSyk = 'TIDLIGERE_SYK',
    TilbakeIArbeid = 'TILBAKE_I_ARBEID',
    TilbakeNar = 'TILBAKE_NAR',
    TransportTilDaglig = 'TRANSPORT_TIL_DAGLIG',
    TypeTransport = 'TYPE_TRANSPORT',
    Utbetaling = 'UTBETALING',
    Utdanning = 'UTDANNING',
    UtdanningStart = 'UTDANNING_START',
    Utland = 'UTLAND',
    UtlandsoppholdSoktSykepenger = 'UTLANDSOPPHOLD_SOKT_SYKEPENGER',
    UtlandNar = 'UTLAND_NAR',
    UtlandNarV2 = 'UTLAND_NAR_V2',
    UtlandV2 = 'UTLAND_V2',
    VaerKlarOverAt = 'VAER_KLAR_OVER_AT',
}

export type Sykmelding = {
    __typename: 'Sykmelding'
    arbeidsforEtterPeriode?: Maybe<Scalars['Boolean']>
    arbeidsgiver: Arbeidsgiver
    behandler: Behandler
    behandletTidspunkt: Scalars['Date']
    fnr: Scalars['String']
    hensynArbeidsplassen?: Maybe<Scalars['String']>
    id: Scalars['ID']
    innspillArbeidsplassen?: Maybe<Scalars['String']>
    kontaktDato?: Maybe<Scalars['Date']>
    lest: Scalars['Boolean']
    navn: Scalars['String']
    perioder: Array<Periode>
    sendtTilArbeidsgiverDato?: Maybe<Scalars['DateTime']>
    tiltakArbeidsplassen?: Maybe<Scalars['String']>
}

export type Virksomhet = {
    __typename: 'Virksomhet'
    navn: Scalars['String']
    orgnummer: Scalars['String']
}

export type MarkSoknadReadMutationVariables = Exact<{
    soknadId: Scalars['ID']
}>

export type MarkSoknadReadMutation = { __typename: 'Mutation'; read?: boolean | null }

export type MarkSykmeldingReadMutationVariables = Exact<{
    sykmeldingId: Scalars['ID']
}>

export type MarkSykmeldingReadMutation = { __typename: 'Mutation'; read?: boolean | null }

export type MarkHendelseResolvedMutationVariables = Exact<{
    hendelseId: Scalars['ID']
}>

export type MarkHendelseResolvedMutation = { __typename: 'Mutation'; read?: boolean | null }

export type MarkAktivitetvarselReadMutationVariables = Exact<{
    aktivitetsvarselId: Scalars['ID']
}>

export type MarkAktivitetvarselReadMutation = { __typename: 'Mutation'; read?: boolean | null }

export type SoknadFragment = {
    __typename: 'Soknad'
    id: string
    sykmeldingId: string
    fnr: string
    navn: string
    fom: string
    tom: string
    lest: boolean
    sendtTilNavDato?: string | null
    sendtDato: string
    perioder: Array<{
        __typename: 'Soknadsperiode'
        fom: string
        tom: string
        sykmeldingstype: PeriodeEnum
        sykmeldingsgrad?: number | null
    }>
    sporsmal: Array<{
        __typename: 'SoknadSporsmal'
        id: string
        tag: SporsmalTagEnum
        min?: string | null
        max?: string | null
        sporsmalstekst?: string | null
        undertekst?: string | null
        svartype: SoknadSporsmalSvartypeEnum
        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
        undersporsmal?: Array<{
            __typename: 'SoknadSporsmal'
            id: string
            tag: SporsmalTagEnum
            min?: string | null
            max?: string | null
            sporsmalstekst?: string | null
            undertekst?: string | null
            svartype: SoknadSporsmalSvartypeEnum
            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
            undersporsmal?: Array<{
                __typename: 'SoknadSporsmal'
                id: string
                tag: SporsmalTagEnum
                min?: string | null
                max?: string | null
                sporsmalstekst?: string | null
                undertekst?: string | null
                svartype: SoknadSporsmalSvartypeEnum
                kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                undersporsmal?: Array<{
                    __typename: 'SoknadSporsmal'
                    id: string
                    tag: SporsmalTagEnum
                    min?: string | null
                    max?: string | null
                    sporsmalstekst?: string | null
                    undertekst?: string | null
                    svartype: SoknadSporsmalSvartypeEnum
                    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                    undersporsmal?: Array<{
                        __typename: 'SoknadSporsmal'
                        id: string
                        tag: SporsmalTagEnum
                        min?: string | null
                        max?: string | null
                        sporsmalstekst?: string | null
                        undertekst?: string | null
                        svartype: SoknadSporsmalSvartypeEnum
                        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                        undersporsmal?: Array<{
                            __typename: 'SoknadSporsmal'
                            id: string
                            tag: SporsmalTagEnum
                            min?: string | null
                            max?: string | null
                            sporsmalstekst?: string | null
                            undertekst?: string | null
                            svartype: SoknadSporsmalSvartypeEnum
                            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                            undersporsmal?: Array<{
                                __typename: 'SoknadSporsmal'
                                id: string
                                tag: SporsmalTagEnum
                                min?: string | null
                                max?: string | null
                                sporsmalstekst?: string | null
                                undertekst?: string | null
                                svartype: SoknadSporsmalSvartypeEnum
                                kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                                svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                            } | null> | null
                            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                        } | null> | null
                        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                    } | null> | null
                    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                } | null> | null
                svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
            } | null> | null
            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
        } | null> | null
    }>
}

export type SoknadperiodeFragment = {
    __typename: 'Soknadsperiode'
    fom: string
    tom: string
    sykmeldingstype: PeriodeEnum
    sykmeldingsgrad?: number | null
}

export type SoknadSporsmalFragment = {
    __typename: 'SoknadSporsmal'
    id: string
    tag: SporsmalTagEnum
    min?: string | null
    max?: string | null
    sporsmalstekst?: string | null
    undertekst?: string | null
    svartype: SoknadSporsmalSvartypeEnum
    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
    undersporsmal?: Array<{
        __typename: 'SoknadSporsmal'
        id: string
        tag: SporsmalTagEnum
        min?: string | null
        max?: string | null
        sporsmalstekst?: string | null
        undertekst?: string | null
        svartype: SoknadSporsmalSvartypeEnum
        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
        undersporsmal?: Array<{
            __typename: 'SoknadSporsmal'
            id: string
            tag: SporsmalTagEnum
            min?: string | null
            max?: string | null
            sporsmalstekst?: string | null
            undertekst?: string | null
            svartype: SoknadSporsmalSvartypeEnum
            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
            undersporsmal?: Array<{
                __typename: 'SoknadSporsmal'
                id: string
                tag: SporsmalTagEnum
                min?: string | null
                max?: string | null
                sporsmalstekst?: string | null
                undertekst?: string | null
                svartype: SoknadSporsmalSvartypeEnum
                kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                undersporsmal?: Array<{
                    __typename: 'SoknadSporsmal'
                    id: string
                    tag: SporsmalTagEnum
                    min?: string | null
                    max?: string | null
                    sporsmalstekst?: string | null
                    undertekst?: string | null
                    svartype: SoknadSporsmalSvartypeEnum
                    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                    undersporsmal?: Array<{
                        __typename: 'SoknadSporsmal'
                        id: string
                        tag: SporsmalTagEnum
                        min?: string | null
                        max?: string | null
                        sporsmalstekst?: string | null
                        undertekst?: string | null
                        svartype: SoknadSporsmalSvartypeEnum
                        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                        undersporsmal?: Array<{
                            __typename: 'SoknadSporsmal'
                            id: string
                            tag: SporsmalTagEnum
                            min?: string | null
                            max?: string | null
                            sporsmalstekst?: string | null
                            undertekst?: string | null
                            svartype: SoknadSporsmalSvartypeEnum
                            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                        } | null> | null
                        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                    } | null> | null
                    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                } | null> | null
                svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
            } | null> | null
            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
        } | null> | null
        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
    } | null> | null
}

export type SoknadUndersporsmalFragment = {
    __typename: 'SoknadSporsmal'
    id: string
    tag: SporsmalTagEnum
    min?: string | null
    max?: string | null
    sporsmalstekst?: string | null
    undertekst?: string | null
    svartype: SoknadSporsmalSvartypeEnum
    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
}

export type SoknadUndersporsmalRecursiveFragment = {
    __typename: 'SoknadSporsmal'
    id: string
    tag: SporsmalTagEnum
    min?: string | null
    max?: string | null
    sporsmalstekst?: string | null
    undertekst?: string | null
    svartype: SoknadSporsmalSvartypeEnum
    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
    undersporsmal?: Array<{
        __typename: 'SoknadSporsmal'
        id: string
        tag: SporsmalTagEnum
        min?: string | null
        max?: string | null
        sporsmalstekst?: string | null
        undertekst?: string | null
        svartype: SoknadSporsmalSvartypeEnum
        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
        undersporsmal?: Array<{
            __typename: 'SoknadSporsmal'
            id: string
            tag: SporsmalTagEnum
            min?: string | null
            max?: string | null
            sporsmalstekst?: string | null
            undertekst?: string | null
            svartype: SoknadSporsmalSvartypeEnum
            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
            undersporsmal?: Array<{
                __typename: 'SoknadSporsmal'
                id: string
                tag: SporsmalTagEnum
                min?: string | null
                max?: string | null
                sporsmalstekst?: string | null
                undertekst?: string | null
                svartype: SoknadSporsmalSvartypeEnum
                kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                undersporsmal?: Array<{
                    __typename: 'SoknadSporsmal'
                    id: string
                    tag: SporsmalTagEnum
                    min?: string | null
                    max?: string | null
                    sporsmalstekst?: string | null
                    undertekst?: string | null
                    svartype: SoknadSporsmalSvartypeEnum
                    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                    undersporsmal?: Array<{
                        __typename: 'SoknadSporsmal'
                        id: string
                        tag: SporsmalTagEnum
                        min?: string | null
                        max?: string | null
                        sporsmalstekst?: string | null
                        undertekst?: string | null
                        svartype: SoknadSporsmalSvartypeEnum
                        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                    } | null> | null
                    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                } | null> | null
                svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
            } | null> | null
            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
        } | null> | null
        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
    } | null> | null
    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
}

export type SoknadSporsmalSvarFragment = { __typename: 'SoknadSporsmalSvar'; verdi: string }

export type SoknadByIdQueryVariables = Exact<{
    soknadId: Scalars['ID']
}>

export type SoknadByIdQuery = {
    __typename: 'Query'
    soknad?: {
        __typename: 'Soknad'
        id: string
        sykmeldingId: string
        fnr: string
        navn: string
        fom: string
        tom: string
        lest: boolean
        sendtTilNavDato?: string | null
        sendtDato: string
        perioder: Array<{
            __typename: 'Soknadsperiode'
            fom: string
            tom: string
            sykmeldingstype: PeriodeEnum
            sykmeldingsgrad?: number | null
        }>
        sporsmal: Array<{
            __typename: 'SoknadSporsmal'
            id: string
            tag: SporsmalTagEnum
            min?: string | null
            max?: string | null
            sporsmalstekst?: string | null
            undertekst?: string | null
            svartype: SoknadSporsmalSvartypeEnum
            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
            undersporsmal?: Array<{
                __typename: 'SoknadSporsmal'
                id: string
                tag: SporsmalTagEnum
                min?: string | null
                max?: string | null
                sporsmalstekst?: string | null
                undertekst?: string | null
                svartype: SoknadSporsmalSvartypeEnum
                kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                undersporsmal?: Array<{
                    __typename: 'SoknadSporsmal'
                    id: string
                    tag: SporsmalTagEnum
                    min?: string | null
                    max?: string | null
                    sporsmalstekst?: string | null
                    undertekst?: string | null
                    svartype: SoknadSporsmalSvartypeEnum
                    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                    undersporsmal?: Array<{
                        __typename: 'SoknadSporsmal'
                        id: string
                        tag: SporsmalTagEnum
                        min?: string | null
                        max?: string | null
                        sporsmalstekst?: string | null
                        undertekst?: string | null
                        svartype: SoknadSporsmalSvartypeEnum
                        kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                        undersporsmal?: Array<{
                            __typename: 'SoknadSporsmal'
                            id: string
                            tag: SporsmalTagEnum
                            min?: string | null
                            max?: string | null
                            sporsmalstekst?: string | null
                            undertekst?: string | null
                            svartype: SoknadSporsmalSvartypeEnum
                            kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                            undersporsmal?: Array<{
                                __typename: 'SoknadSporsmal'
                                id: string
                                tag: SporsmalTagEnum
                                min?: string | null
                                max?: string | null
                                sporsmalstekst?: string | null
                                undertekst?: string | null
                                svartype: SoknadSporsmalSvartypeEnum
                                kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                                undersporsmal?: Array<{
                                    __typename: 'SoknadSporsmal'
                                    id: string
                                    tag: SporsmalTagEnum
                                    min?: string | null
                                    max?: string | null
                                    sporsmalstekst?: string | null
                                    undertekst?: string | null
                                    svartype: SoknadSporsmalSvartypeEnum
                                    kriterieForVisningAvUndersporsmal?: SoknadSporsmalKriterierEnum | null
                                    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                                } | null> | null
                                svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                            } | null> | null
                            svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                        } | null> | null
                        svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                    } | null> | null
                    svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
                } | null> | null
                svar?: Array<{ __typename: 'SoknadSporsmalSvar'; verdi: string } | null> | null
            } | null> | null
        }>
    } | null
}

export type SykmeldingFragment = {
    __typename: 'Sykmelding'
    id: string
    fnr: string
    lest: boolean
    navn: string
    behandletTidspunkt: string
    arbeidsforEtterPeriode?: boolean | null
    tiltakArbeidsplassen?: string | null
    innspillArbeidsplassen?: string | null
    sendtTilArbeidsgiverDato?: string | null
    arbeidsgiver: { __typename: 'Arbeidsgiver'; navn?: string | null }
    behandler: { __typename: 'Behandler'; navn: string; telefon?: string | null }
    perioder: Array<
        | {
              __typename: 'AktivitetIkkeMulig'
              fom: string
              tom: string
              arbeidsrelatertArsak?: {
                  __typename: 'ArbeidsrelatertArsak'
                  arsak: Array<ArbeidsrelatertArsakEnum>
                  beskrivelse?: string | null
              } | null
          }
        | { __typename: 'Avventende'; fom: string; tom: string; tilrettelegging?: string | null }
        | { __typename: 'Behandlingsdager'; fom: string; tom: string; behandlingsdager: number }
        | { __typename: 'Gradert'; fom: string; tom: string; grad: number; reisetilskudd: boolean }
        | { __typename: 'Reisetilskudd'; fom: string; tom: string }
    >
}

export type SykmeldingPeriode_AktivitetIkkeMulig_Fragment = {
    __typename: 'AktivitetIkkeMulig'
    fom: string
    tom: string
    arbeidsrelatertArsak?: {
        __typename: 'ArbeidsrelatertArsak'
        arsak: Array<ArbeidsrelatertArsakEnum>
        beskrivelse?: string | null
    } | null
}

export type SykmeldingPeriode_Avventende_Fragment = {
    __typename: 'Avventende'
    fom: string
    tom: string
    tilrettelegging?: string | null
}

export type SykmeldingPeriode_Behandlingsdager_Fragment = {
    __typename: 'Behandlingsdager'
    fom: string
    tom: string
    behandlingsdager: number
}

export type SykmeldingPeriode_Gradert_Fragment = {
    __typename: 'Gradert'
    fom: string
    tom: string
    grad: number
    reisetilskudd: boolean
}

export type SykmeldingPeriode_Reisetilskudd_Fragment = { __typename: 'Reisetilskudd'; fom: string; tom: string }

export type SykmeldingPeriodeFragment =
    | SykmeldingPeriode_AktivitetIkkeMulig_Fragment
    | SykmeldingPeriode_Avventende_Fragment
    | SykmeldingPeriode_Behandlingsdager_Fragment
    | SykmeldingPeriode_Gradert_Fragment
    | SykmeldingPeriode_Reisetilskudd_Fragment

export type SykmeldingByIdQueryVariables = Exact<{
    sykmeldingId: Scalars['ID']
}>

export type SykmeldingByIdQuery = {
    __typename: 'Query'
    sykmelding?: {
        __typename: 'Sykmelding'
        id: string
        fnr: string
        lest: boolean
        navn: string
        behandletTidspunkt: string
        arbeidsforEtterPeriode?: boolean | null
        tiltakArbeidsplassen?: string | null
        innspillArbeidsplassen?: string | null
        sendtTilArbeidsgiverDato?: string | null
        arbeidsgiver: { __typename: 'Arbeidsgiver'; navn?: string | null }
        behandler: { __typename: 'Behandler'; navn: string; telefon?: string | null }
        perioder: Array<
            | {
                  __typename: 'AktivitetIkkeMulig'
                  fom: string
                  tom: string
                  arbeidsrelatertArsak?: {
                      __typename: 'ArbeidsrelatertArsak'
                      arsak: Array<ArbeidsrelatertArsakEnum>
                      beskrivelse?: string | null
                  } | null
              }
            | { __typename: 'Avventende'; fom: string; tom: string; tilrettelegging?: string | null }
            | { __typename: 'Behandlingsdager'; fom: string; tom: string; behandlingsdager: number }
            | { __typename: 'Gradert'; fom: string; tom: string; grad: number; reisetilskudd: boolean }
            | { __typename: 'Reisetilskudd'; fom: string; tom: string }
        >
    } | null
}

export type PreviewSoknad_PreviewFremtidigSoknad_Fragment = {
    __typename: 'PreviewFremtidigSoknad'
    id: string
    sykmeldingId: string
    fom: string
    tom: string
    perioder: Array<{
        __typename: 'Soknadsperiode'
        fom: string
        tom: string
        sykmeldingstype: PeriodeEnum
        sykmeldingsgrad?: number | null
    }>
}

export type PreviewSoknad_PreviewNySoknad_Fragment = {
    __typename: 'PreviewNySoknad'
    id: string
    sykmeldingId: string
    fom: string
    tom: string
    lest: boolean
    ikkeSendtSoknadVarsel: boolean
    perioder: Array<{
        __typename: 'Soknadsperiode'
        fom: string
        tom: string
        sykmeldingstype: PeriodeEnum
        sykmeldingsgrad?: number | null
    }>
}

export type PreviewSoknad_PreviewSendtSoknad_Fragment = {
    __typename: 'PreviewSendtSoknad'
    id: string
    sykmeldingId: string
    fom: string
    tom: string
    lest: boolean
    sendtDato: string
    korrigererSoknadId?: string | null
    perioder: Array<{
        __typename: 'Soknadsperiode'
        fom: string
        tom: string
        sykmeldingstype: PeriodeEnum
        sykmeldingsgrad?: number | null
    }>
}

export type PreviewSoknadFragment =
    | PreviewSoknad_PreviewFremtidigSoknad_Fragment
    | PreviewSoknad_PreviewNySoknad_Fragment
    | PreviewSoknad_PreviewSendtSoknad_Fragment

export type DialogmoteFragment = { __typename: 'Dialogmote'; hendelseId: string; tekst?: string | null }

export type OppfolgingsplanFragment = { __typename: 'Oppfolgingsplan'; hendelseId: string; tekst?: string | null }

export type AktivitetsvarselFragment = {
    __typename: 'Aktivitetsvarsel'
    hendelseId: string
    mottatt: string
    lest?: string | null
}

export type PreviewSykmeldtFragment = {
    __typename: 'PreviewSykmeldt'
    fnr: string
    navn: string
    orgnummer: string
    orgnavn: string
    friskmeldt: boolean
    narmestelederId: string
    sykmeldinger: Array<{
        __typename: 'Sykmelding'
        id: string
        fnr: string
        lest: boolean
        navn: string
        behandletTidspunkt: string
        arbeidsforEtterPeriode?: boolean | null
        tiltakArbeidsplassen?: string | null
        innspillArbeidsplassen?: string | null
        sendtTilArbeidsgiverDato?: string | null
        arbeidsgiver: { __typename: 'Arbeidsgiver'; navn?: string | null }
        behandler: { __typename: 'Behandler'; navn: string; telefon?: string | null }
        perioder: Array<
            | {
                  __typename: 'AktivitetIkkeMulig'
                  fom: string
                  tom: string
                  arbeidsrelatertArsak?: {
                      __typename: 'ArbeidsrelatertArsak'
                      arsak: Array<ArbeidsrelatertArsakEnum>
                      beskrivelse?: string | null
                  } | null
              }
            | { __typename: 'Avventende'; fom: string; tom: string; tilrettelegging?: string | null }
            | { __typename: 'Behandlingsdager'; fom: string; tom: string; behandlingsdager: number }
            | { __typename: 'Gradert'; fom: string; tom: string; grad: number; reisetilskudd: boolean }
            | { __typename: 'Reisetilskudd'; fom: string; tom: string }
        >
    }>
    previewSoknader: Array<
        | {
              __typename: 'PreviewFremtidigSoknad'
              id: string
              sykmeldingId: string
              fom: string
              tom: string
              perioder: Array<{
                  __typename: 'Soknadsperiode'
                  fom: string
                  tom: string
                  sykmeldingstype: PeriodeEnum
                  sykmeldingsgrad?: number | null
              }>
          }
        | {
              __typename: 'PreviewNySoknad'
              id: string
              sykmeldingId: string
              fom: string
              tom: string
              lest: boolean
              ikkeSendtSoknadVarsel: boolean
              perioder: Array<{
                  __typename: 'Soknadsperiode'
                  fom: string
                  tom: string
                  sykmeldingstype: PeriodeEnum
                  sykmeldingsgrad?: number | null
              }>
          }
        | {
              __typename: 'PreviewSendtSoknad'
              id: string
              sykmeldingId: string
              fom: string
              tom: string
              lest: boolean
              sendtDato: string
              korrigererSoknadId?: string | null
              perioder: Array<{
                  __typename: 'Soknadsperiode'
                  fom: string
                  tom: string
                  sykmeldingstype: PeriodeEnum
                  sykmeldingsgrad?: number | null
              }>
          }
    >
    dialogmoter: Array<{ __typename: 'Dialogmote'; hendelseId: string; tekst?: string | null }>
    aktivitetsvarsler: Array<{
        __typename: 'Aktivitetsvarsel'
        hendelseId: string
        mottatt: string
        lest?: string | null
    }>
    oppfolgingsplaner: Array<{ __typename: 'Oppfolgingsplan'; hendelseId: string; tekst?: string | null }>
}

export type MineSykmeldteQueryVariables = Exact<{ [key: string]: never }>

export type MineSykmeldteQuery = {
    __typename: 'Query'
    mineSykmeldte?: Array<{
        __typename: 'PreviewSykmeldt'
        fnr: string
        navn: string
        orgnummer: string
        orgnavn: string
        friskmeldt: boolean
        narmestelederId: string
        sykmeldinger: Array<{
            __typename: 'Sykmelding'
            id: string
            fnr: string
            lest: boolean
            navn: string
            behandletTidspunkt: string
            arbeidsforEtterPeriode?: boolean | null
            tiltakArbeidsplassen?: string | null
            innspillArbeidsplassen?: string | null
            sendtTilArbeidsgiverDato?: string | null
            arbeidsgiver: { __typename: 'Arbeidsgiver'; navn?: string | null }
            behandler: { __typename: 'Behandler'; navn: string; telefon?: string | null }
            perioder: Array<
                | {
                      __typename: 'AktivitetIkkeMulig'
                      fom: string
                      tom: string
                      arbeidsrelatertArsak?: {
                          __typename: 'ArbeidsrelatertArsak'
                          arsak: Array<ArbeidsrelatertArsakEnum>
                          beskrivelse?: string | null
                      } | null
                  }
                | { __typename: 'Avventende'; fom: string; tom: string; tilrettelegging?: string | null }
                | { __typename: 'Behandlingsdager'; fom: string; tom: string; behandlingsdager: number }
                | { __typename: 'Gradert'; fom: string; tom: string; grad: number; reisetilskudd: boolean }
                | { __typename: 'Reisetilskudd'; fom: string; tom: string }
            >
        }>
        previewSoknader: Array<
            | {
                  __typename: 'PreviewFremtidigSoknad'
                  id: string
                  sykmeldingId: string
                  fom: string
                  tom: string
                  perioder: Array<{
                      __typename: 'Soknadsperiode'
                      fom: string
                      tom: string
                      sykmeldingstype: PeriodeEnum
                      sykmeldingsgrad?: number | null
                  }>
              }
            | {
                  __typename: 'PreviewNySoknad'
                  id: string
                  sykmeldingId: string
                  fom: string
                  tom: string
                  lest: boolean
                  ikkeSendtSoknadVarsel: boolean
                  perioder: Array<{
                      __typename: 'Soknadsperiode'
                      fom: string
                      tom: string
                      sykmeldingstype: PeriodeEnum
                      sykmeldingsgrad?: number | null
                  }>
              }
            | {
                  __typename: 'PreviewSendtSoknad'
                  id: string
                  sykmeldingId: string
                  fom: string
                  tom: string
                  lest: boolean
                  sendtDato: string
                  korrigererSoknadId?: string | null
                  perioder: Array<{
                      __typename: 'Soknadsperiode'
                      fom: string
                      tom: string
                      sykmeldingstype: PeriodeEnum
                      sykmeldingsgrad?: number | null
                  }>
              }
        >
        dialogmoter: Array<{ __typename: 'Dialogmote'; hendelseId: string; tekst?: string | null }>
        aktivitetsvarsler: Array<{
            __typename: 'Aktivitetsvarsel'
            hendelseId: string
            mottatt: string
            lest?: string | null
        }>
        oppfolgingsplaner: Array<{ __typename: 'Oppfolgingsplan'; hendelseId: string; tekst?: string | null }>
    }> | null
}

export type UnlinkSykmeldtMutationVariables = Exact<{
    sykmeldtId: Scalars['ID']
}>

export type UnlinkSykmeldtMutation = { __typename: 'Mutation'; unlinkSykmeldt?: boolean | null }

export type VirksomheterQueryVariables = Exact<{ [key: string]: never }>

export type VirksomheterQuery = {
    __typename: 'Query'
    virksomheter: Array<{ __typename: 'Virksomhet'; orgnummer: string; navn: string }>
}

export const SoknadperiodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'Soknadperiode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Soknadsperiode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykmeldingstype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykmeldingsgrad' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SoknadperiodeFragment, unknown>
export const SoknadSporsmalSvarFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SoknadSporsmalSvar' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadSporsmalSvar' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [{ kind: 'Field', name: { kind: 'Name', value: 'verdi' } }],
            },
        },
    ],
} as unknown as DocumentNode<SoknadSporsmalSvarFragment, unknown>
export const SoknadUndersporsmalFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SoknadUndersporsmal' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadSporsmal' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sporsmalstekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'undertekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'svartype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'kriterieForVisningAvUndersporsmal' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'svar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'SoknadSporsmalSvar' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SoknadUndersporsmalFragment, unknown>
export const SoknadUndersporsmalRecursiveFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SoknadUndersporsmalRecursive' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadSporsmal' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'FragmentSpread', name: { kind: 'Name', value: 'SoknadUndersporsmal' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'undersporsmal' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'SoknadUndersporsmal' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'undersporsmal' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            {
                                                kind: 'FragmentSpread',
                                                name: { kind: 'Name', value: 'SoknadUndersporsmal' },
                                            },
                                            {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'undersporsmal' },
                                                selectionSet: {
                                                    kind: 'SelectionSet',
                                                    selections: [
                                                        {
                                                            kind: 'FragmentSpread',
                                                            name: { kind: 'Name', value: 'SoknadUndersporsmal' },
                                                        },
                                                        {
                                                            kind: 'Field',
                                                            name: { kind: 'Name', value: 'undersporsmal' },
                                                            selectionSet: {
                                                                kind: 'SelectionSet',
                                                                selections: [
                                                                    {
                                                                        kind: 'FragmentSpread',
                                                                        name: {
                                                                            kind: 'Name',
                                                                            value: 'SoknadUndersporsmal',
                                                                        },
                                                                    },
                                                                    {
                                                                        kind: 'Field',
                                                                        name: { kind: 'Name', value: 'undersporsmal' },
                                                                        selectionSet: {
                                                                            kind: 'SelectionSet',
                                                                            selections: [
                                                                                {
                                                                                    kind: 'FragmentSpread',
                                                                                    name: {
                                                                                        kind: 'Name',
                                                                                        value: 'SoknadUndersporsmal',
                                                                                    },
                                                                                },
                                                                            ],
                                                                        },
                                                                    },
                                                                ],
                                                            },
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SoknadUndersporsmalRecursiveFragment, unknown>
export const SoknadSporsmalFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SoknadSporsmal' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'SoknadSporsmal' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tag' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'min' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'max' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sporsmalstekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'undertekst' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'svartype' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'kriterieForVisningAvUndersporsmal' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'svar' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'SoknadSporsmalSvar' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'undersporsmal' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'SoknadUndersporsmalRecursive' },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SoknadSporsmalFragment, unknown>
export const SoknadFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'Soknad' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Soknad' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sykmeldingId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fnr' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'lest' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sendtTilNavDato' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'sendtDato' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Soknadperiode' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sporsmal' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'SoknadSporsmal' } }],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SoknadFragment, unknown>
export const SykmeldingPeriodeFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'SykmeldingPeriode' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Periode' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'FomTom' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'AktivitetIkkeMulig' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'arbeidsrelatertArsak' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'Field', name: { kind: 'Name', value: 'arsak' } },
                                            { kind: 'Field', name: { kind: 'Name', value: 'beskrivelse' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Gradert' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'grad' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'reisetilskudd' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Avventende' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'tilrettelegging' } }],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Behandlingsdager' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'behandlingsdager' } }],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SykmeldingPeriodeFragment, unknown>
export const SykmeldingFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'Sykmelding' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Sykmelding' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'fnr' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'lest' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'behandletTidspunkt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'arbeidsforEtterPeriode' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tiltakArbeidsplassen' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'innspillArbeidsplassen' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'arbeidsgiver' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'Field', name: { kind: 'Name', value: 'navn' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'behandler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'telefon' } },
                            ],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'perioder' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'FragmentSpread', name: { kind: 'Name', value: 'SykmeldingPeriode' } },
                            ],
                        },
                    },
                    { kind: 'Field', name: { kind: 'Name', value: 'sendtTilArbeidsgiverDato' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<SykmeldingFragment, unknown>
export const PreviewSoknadFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'PreviewSoknad' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PreviewSoknad' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'BasePreviewSoknad' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sykmeldingId' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'fom' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'tom' } },
                                {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'perioder' },
                                    selectionSet: {
                                        kind: 'SelectionSet',
                                        selections: [
                                            { kind: 'FragmentSpread', name: { kind: 'Name', value: 'Soknadperiode' } },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PreviewNySoknad' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'lest' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'ikkeSendtSoknadVarsel' } },
                            ],
                        },
                    },
                    {
                        kind: 'InlineFragment',
                        typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PreviewSendtSoknad' } },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'lest' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'sendtDato' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'korrigererSoknadId' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PreviewSoknadFragment, unknown>
export const DialogmoteFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'Dialogmote' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Dialogmote' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<DialogmoteFragment, unknown>
export const AktivitetsvarselFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'Aktivitetsvarsel' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Aktivitetsvarsel' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'mottatt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'lest' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AktivitetsvarselFragment, unknown>
export const OppfolgingsplanFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'Oppfolgingsplan' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Oppfolgingsplan' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'hendelseId' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'tekst' } },
                ],
            },
        },
    ],
} as unknown as DocumentNode<OppfolgingsplanFragment, unknown>
export const PreviewSykmeldtFragmentDoc = {
    kind: 'Document',
    definitions: [
        {
            kind: 'FragmentDefinition',
            name: { kind: 'Name', value: 'PreviewSykmeldt' },
            typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'PreviewSykmeldt' } },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    { kind: 'Field', name: { kind: 'Name', value: 'fnr' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'orgnavn' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'friskmeldt' } },
                    { kind: 'Field', name: { kind: 'Name', value: 'narmestelederId' } },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sykmeldinger' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Sykmelding' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'previewSoknader' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'PreviewSoknad' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'dialogmoter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Dialogmote' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'aktivitetsvarsler' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Aktivitetsvarsel' } }],
                        },
                    },
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'oppfolgingsplaner' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Oppfolgingsplan' } }],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<PreviewSykmeldtFragment, unknown>
export const MarkSoknadReadDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'MarkSoknadRead' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'soknadId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'read' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'type' },
                                value: { kind: 'EnumValue', value: 'Soknad' },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'soknadId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MarkSoknadReadMutation, MarkSoknadReadMutationVariables>
export const MarkSykmeldingReadDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'MarkSykmeldingRead' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'sykmeldingId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'read' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'type' },
                                value: { kind: 'EnumValue', value: 'Sykmelding' },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'sykmeldingId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MarkSykmeldingReadMutation, MarkSykmeldingReadMutationVariables>
export const MarkHendelseResolvedDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'MarkHendelseResolved' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'hendelseId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'read' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'type' },
                                value: { kind: 'EnumValue', value: 'Hendelse' },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'hendelseId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MarkHendelseResolvedMutation, MarkHendelseResolvedMutationVariables>
export const MarkAktivitetvarselReadDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'MarkAktivitetvarselRead' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'aktivitetsvarselId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'read' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'type' },
                                value: { kind: 'EnumValue', value: 'Aktivitetsvarsel' },
                            },
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'id' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'aktivitetsvarselId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<MarkAktivitetvarselReadMutation, MarkAktivitetvarselReadMutationVariables>
export const SoknadByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'SoknadById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'soknadId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'soknad' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'soknadId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'soknadId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Soknad' } }],
                        },
                    },
                ],
            },
        },
        ...SoknadFragmentDoc.definitions,
        ...SoknadperiodeFragmentDoc.definitions,
        ...SoknadSporsmalFragmentDoc.definitions,
        ...SoknadSporsmalSvarFragmentDoc.definitions,
        ...SoknadUndersporsmalRecursiveFragmentDoc.definitions,
        ...SoknadUndersporsmalFragmentDoc.definitions,
    ],
} as unknown as DocumentNode<SoknadByIdQuery, SoknadByIdQueryVariables>
export const SykmeldingByIdDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'SykmeldingById' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'sykmeldingId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'sykmelding' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'sykmeldingId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'sykmeldingId' } },
                            },
                        ],
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'Sykmelding' } }],
                        },
                    },
                ],
            },
        },
        ...SykmeldingFragmentDoc.definitions,
        ...SykmeldingPeriodeFragmentDoc.definitions,
    ],
} as unknown as DocumentNode<SykmeldingByIdQuery, SykmeldingByIdQueryVariables>
export const MineSykmeldteDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'MineSykmeldte' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'mineSykmeldte' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [{ kind: 'FragmentSpread', name: { kind: 'Name', value: 'PreviewSykmeldt' } }],
                        },
                    },
                ],
            },
        },
        ...PreviewSykmeldtFragmentDoc.definitions,
        ...SykmeldingFragmentDoc.definitions,
        ...SykmeldingPeriodeFragmentDoc.definitions,
        ...PreviewSoknadFragmentDoc.definitions,
        ...SoknadperiodeFragmentDoc.definitions,
        ...DialogmoteFragmentDoc.definitions,
        ...AktivitetsvarselFragmentDoc.definitions,
        ...OppfolgingsplanFragmentDoc.definitions,
    ],
} as unknown as DocumentNode<MineSykmeldteQuery, MineSykmeldteQueryVariables>
export const UnlinkSykmeldtDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'mutation',
            name: { kind: 'Name', value: 'UnlinkSykmeldt' },
            variableDefinitions: [
                {
                    kind: 'VariableDefinition',
                    variable: { kind: 'Variable', name: { kind: 'Name', value: 'sykmeldtId' } },
                    type: { kind: 'NonNullType', type: { kind: 'NamedType', name: { kind: 'Name', value: 'ID' } } },
                },
            ],
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'unlinkSykmeldt' },
                        arguments: [
                            {
                                kind: 'Argument',
                                name: { kind: 'Name', value: 'sykmeldtId' },
                                value: { kind: 'Variable', name: { kind: 'Name', value: 'sykmeldtId' } },
                            },
                        ],
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<UnlinkSykmeldtMutation, UnlinkSykmeldtMutationVariables>
export const VirksomheterDocument = {
    kind: 'Document',
    definitions: [
        {
            kind: 'OperationDefinition',
            operation: 'query',
            name: { kind: 'Name', value: 'Virksomheter' },
            selectionSet: {
                kind: 'SelectionSet',
                selections: [
                    {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'virksomheter' },
                        selectionSet: {
                            kind: 'SelectionSet',
                            selections: [
                                { kind: 'Field', name: { kind: 'Name', value: 'orgnummer' } },
                                { kind: 'Field', name: { kind: 'Name', value: 'navn' } },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<VirksomheterQuery, VirksomheterQueryVariables>
