/* eslint-disable */
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import { ResolverContextType } from './resolverTypes'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
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
    __typename?: 'AktivitetIkkeMulig'
    arbeidsrelatertArsak: Maybe<ArbeidsrelatertArsak>
    fom: Scalars['Date']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Aktivitetsvarsel = {
    __typename?: 'Aktivitetsvarsel'
    hendelseId: Scalars['ID']
    lest: Maybe<Scalars['DateTime']>
    mottatt: Scalars['DateTime']
}

export type Arbeidsgiver = {
    __typename?: 'Arbeidsgiver'
    navn: Maybe<Scalars['String']>
}

export type ArbeidsrelatertArsak = {
    __typename?: 'ArbeidsrelatertArsak'
    arsak: Array<ArbeidsrelatertArsakEnum>
    beskrivelse: Maybe<Scalars['String']>
}

export enum ArbeidsrelatertArsakEnum {
    Annet = 'ANNET',
    ManglendeTilrettelegging = 'MANGLENDE_TILRETTELEGGING',
}

export type Avventende = FomTom & {
    __typename?: 'Avventende'
    fom: Scalars['Date']
    tilrettelegging: Maybe<Scalars['String']>
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
    __typename?: 'Behandler'
    hprNummer: Maybe<Scalars['String']>
    navn: Scalars['String']
    telefon: Maybe<Scalars['String']>
}

export type Behandlingsdager = FomTom & {
    __typename?: 'Behandlingsdager'
    behandlingsdager: Scalars['Int']
    fom: Scalars['Date']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Dialogmote = {
    __typename?: 'Dialogmote'
    hendelseId: Scalars['String']
    mottatt: Maybe<Scalars['DateTime']>
    tekst: Maybe<Scalars['String']>
}

export type FomTom = {
    fom: Scalars['Date']
    tom: Scalars['Date']
}

export type Gradert = FomTom & {
    __typename?: 'Gradert'
    fom: Scalars['Date']
    grad: Scalars['Int']
    reisetilskudd: Scalars['Boolean']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Mutation = {
    __typename?: 'Mutation'
    markAktivitetvarselRead: Maybe<Scalars['Boolean']>
    read: Maybe<Scalars['Boolean']>
    unlinkSykmeldt: Maybe<Scalars['Boolean']>
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
    __typename?: 'Oppfolgingsplan'
    hendelseId: Scalars['String']
    mottatt: Maybe<Scalars['DateTime']>
    tekst: Maybe<Scalars['String']>
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
    __typename?: 'PreviewFremtidigSoknad'
    fom: Scalars['Date']
    id: Scalars['String']
    perioder: Array<Soknadsperiode>
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type PreviewNySoknad = BasePreviewSoknad & {
    __typename?: 'PreviewNySoknad'
    fom: Scalars['Date']
    id: Scalars['String']
    ikkeSendtSoknadVarsel: Scalars['Boolean']
    ikkeSendtSoknadVarsletDato: Maybe<Scalars['DateTime']>
    lest: Scalars['Boolean']
    perioder: Array<Soknadsperiode>
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type PreviewSendtSoknad = BasePreviewSoknad & {
    __typename?: 'PreviewSendtSoknad'
    fom: Scalars['Date']
    id: Scalars['String']
    korrigererSoknadId: Maybe<Scalars['String']>
    lest: Scalars['Boolean']
    perioder: Array<Soknadsperiode>
    sendtDato: Scalars['DateTime']
    status: SoknadsstatusEnum
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type PreviewSoknad = PreviewFremtidigSoknad | PreviewNySoknad | PreviewSendtSoknad

export type PreviewSykmeldt = {
    __typename?: 'PreviewSykmeldt'
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
    __typename?: 'Query'
    mineSykmeldte: Maybe<Array<PreviewSykmeldt>>
    soknad: Maybe<Soknad>
    sykmelding: Maybe<Sykmelding>
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
    __typename?: 'Reisetilskudd'
    fom: Scalars['Date']
    tom: Scalars['Date']
    type: PeriodeEnum
}

export type Soknad = {
    __typename?: 'Soknad'
    fnr: Scalars['String']
    fom: Scalars['Date']
    id: Scalars['ID']
    korrigererSoknadId: Maybe<Scalars['String']>
    lest: Scalars['Boolean']
    navn: Scalars['String']
    perioder: Array<Soknadsperiode>
    sendtDato: Scalars['DateTime']
    sendtTilNavDato: Maybe<Scalars['DateTime']>
    sporsmal: Array<SoknadSporsmal>
    sykmeldingId: Scalars['String']
    tom: Scalars['Date']
}

export type SoknadSporsmal = {
    __typename?: 'SoknadSporsmal'
    id: Scalars['ID']
    kriterieForVisningAvUndersporsmal: Maybe<SoknadSporsmalKriterierEnum>
    max: Maybe<Scalars['String']>
    min: Maybe<Scalars['String']>
    sporsmalstekst: Maybe<Scalars['String']>
    svar: Maybe<Array<Maybe<SoknadSporsmalSvar>>>
    svartype: SoknadSporsmalSvartypeEnum
    tag: SporsmalTagEnum
    undersporsmal: Maybe<Array<Maybe<SoknadSporsmal>>>
    undertekst: Maybe<Scalars['String']>
}

export enum SoknadSporsmalKriterierEnum {
    Checked = 'CHECKED',
    Ja = 'JA',
    Nei = 'NEI',
}

export type SoknadSporsmalSvar = {
    __typename?: 'SoknadSporsmalSvar'
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
    __typename?: 'Soknadsperiode'
    fom: Scalars['Date']
    sykmeldingsgrad: Maybe<Scalars['Int']>
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
    __typename?: 'Sykmelding'
    arbeidsforEtterPeriode: Maybe<Scalars['Boolean']>
    arbeidsgiver: Arbeidsgiver
    behandler: Behandler
    behandletTidspunkt: Scalars['Date']
    fnr: Scalars['String']
    hensynArbeidsplassen: Maybe<Scalars['String']>
    id: Scalars['ID']
    innspillArbeidsplassen: Maybe<Scalars['String']>
    kontaktDato: Maybe<Scalars['Date']>
    lest: Scalars['Boolean']
    navn: Scalars['String']
    perioder: Array<Periode>
    sendtTilArbeidsgiverDato: Maybe<Scalars['DateTime']>
    tiltakArbeidsplassen: Maybe<Scalars['String']>
}

export type Virksomhet = {
    __typename?: 'Virksomhet'
    navn: Scalars['String']
    orgnummer: Scalars['String']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
    | ResolverFn<TResult, TParent, TContext, TArgs>
    | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
    resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
    | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
    | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
    | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
    | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
    parent: TParent,
    context: TContext,
    info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
    obj: T,
    context: TContext,
    info: GraphQLResolveInfo,
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
    next: NextResolverFn<TResult>,
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
    AktivitetIkkeMulig: ResolverTypeWrapper<AktivitetIkkeMulig>
    Aktivitetsvarsel: ResolverTypeWrapper<Aktivitetsvarsel>
    Arbeidsgiver: ResolverTypeWrapper<Arbeidsgiver>
    ArbeidsrelatertArsak: ResolverTypeWrapper<ArbeidsrelatertArsak>
    ArbeidsrelatertArsakEnum: ArbeidsrelatertArsakEnum
    Avventende: ResolverTypeWrapper<Avventende>
    BasePreviewSoknad:
        | ResolversTypes['PreviewFremtidigSoknad']
        | ResolversTypes['PreviewNySoknad']
        | ResolversTypes['PreviewSendtSoknad']
    Behandler: ResolverTypeWrapper<Behandler>
    Behandlingsdager: ResolverTypeWrapper<Behandlingsdager>
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>
    Date: ResolverTypeWrapper<Scalars['Date']>
    DateTime: ResolverTypeWrapper<Scalars['DateTime']>
    Dialogmote: ResolverTypeWrapper<Dialogmote>
    FomTom:
        | ResolversTypes['AktivitetIkkeMulig']
        | ResolversTypes['Avventende']
        | ResolversTypes['Behandlingsdager']
        | ResolversTypes['Gradert']
        | ResolversTypes['Reisetilskudd']
        | ResolversTypes['Soknadsperiode']
    Gradert: ResolverTypeWrapper<Gradert>
    ID: ResolverTypeWrapper<Scalars['ID']>
    Int: ResolverTypeWrapper<Scalars['Int']>
    Mutation: ResolverTypeWrapper<{}>
    Oppfolgingsplan: ResolverTypeWrapper<Oppfolgingsplan>
    Periode:
        | ResolversTypes['AktivitetIkkeMulig']
        | ResolversTypes['Avventende']
        | ResolversTypes['Behandlingsdager']
        | ResolversTypes['Gradert']
        | ResolversTypes['Reisetilskudd']
    PeriodeEnum: PeriodeEnum
    PreviewFremtidigSoknad: ResolverTypeWrapper<PreviewFremtidigSoknad>
    PreviewNySoknad: ResolverTypeWrapper<PreviewNySoknad>
    PreviewSendtSoknad: ResolverTypeWrapper<PreviewSendtSoknad>
    PreviewSoknad:
        | ResolversTypes['PreviewFremtidigSoknad']
        | ResolversTypes['PreviewNySoknad']
        | ResolversTypes['PreviewSendtSoknad']
    PreviewSykmeldt: ResolverTypeWrapper<
        Omit<PreviewSykmeldt, 'previewSoknader'> & { previewSoknader: Array<ResolversTypes['PreviewSoknad']> }
    >
    Query: ResolverTypeWrapper<{}>
    ReadType: ReadType
    Reisetilskudd: ResolverTypeWrapper<Reisetilskudd>
    Soknad: ResolverTypeWrapper<Soknad>
    SoknadSporsmal: ResolverTypeWrapper<SoknadSporsmal>
    SoknadSporsmalKriterierEnum: SoknadSporsmalKriterierEnum
    SoknadSporsmalSvar: ResolverTypeWrapper<SoknadSporsmalSvar>
    SoknadSporsmalSvartypeEnum: SoknadSporsmalSvartypeEnum
    Soknadsperiode: ResolverTypeWrapper<Soknadsperiode>
    SoknadsstatusEnum: SoknadsstatusEnum
    SporsmalTagEnum: SporsmalTagEnum
    String: ResolverTypeWrapper<Scalars['String']>
    Sykmelding: ResolverTypeWrapper<Omit<Sykmelding, 'perioder'> & { perioder: Array<ResolversTypes['Periode']> }>
    Virksomhet: ResolverTypeWrapper<Virksomhet>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
    AktivitetIkkeMulig: AktivitetIkkeMulig
    Aktivitetsvarsel: Aktivitetsvarsel
    Arbeidsgiver: Arbeidsgiver
    ArbeidsrelatertArsak: ArbeidsrelatertArsak
    Avventende: Avventende
    BasePreviewSoknad:
        | ResolversParentTypes['PreviewFremtidigSoknad']
        | ResolversParentTypes['PreviewNySoknad']
        | ResolversParentTypes['PreviewSendtSoknad']
    Behandler: Behandler
    Behandlingsdager: Behandlingsdager
    Boolean: Scalars['Boolean']
    Date: Scalars['Date']
    DateTime: Scalars['DateTime']
    Dialogmote: Dialogmote
    FomTom:
        | ResolversParentTypes['AktivitetIkkeMulig']
        | ResolversParentTypes['Avventende']
        | ResolversParentTypes['Behandlingsdager']
        | ResolversParentTypes['Gradert']
        | ResolversParentTypes['Reisetilskudd']
        | ResolversParentTypes['Soknadsperiode']
    Gradert: Gradert
    ID: Scalars['ID']
    Int: Scalars['Int']
    Mutation: {}
    Oppfolgingsplan: Oppfolgingsplan
    Periode:
        | ResolversParentTypes['AktivitetIkkeMulig']
        | ResolversParentTypes['Avventende']
        | ResolversParentTypes['Behandlingsdager']
        | ResolversParentTypes['Gradert']
        | ResolversParentTypes['Reisetilskudd']
    PreviewFremtidigSoknad: PreviewFremtidigSoknad
    PreviewNySoknad: PreviewNySoknad
    PreviewSendtSoknad: PreviewSendtSoknad
    PreviewSoknad:
        | ResolversParentTypes['PreviewFremtidigSoknad']
        | ResolversParentTypes['PreviewNySoknad']
        | ResolversParentTypes['PreviewSendtSoknad']
    PreviewSykmeldt: Omit<PreviewSykmeldt, 'previewSoknader'> & {
        previewSoknader: Array<ResolversParentTypes['PreviewSoknad']>
    }
    Query: {}
    Reisetilskudd: Reisetilskudd
    Soknad: Soknad
    SoknadSporsmal: SoknadSporsmal
    SoknadSporsmalSvar: SoknadSporsmalSvar
    Soknadsperiode: Soknadsperiode
    String: Scalars['String']
    Sykmelding: Omit<Sykmelding, 'perioder'> & { perioder: Array<ResolversParentTypes['Periode']> }
    Virksomhet: Virksomhet
}>

export type AktivitetIkkeMuligResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['AktivitetIkkeMulig'] = ResolversParentTypes['AktivitetIkkeMulig'],
> = ResolversObject<{
    arbeidsrelatertArsak?: Resolver<Maybe<ResolversTypes['ArbeidsrelatertArsak']>, ParentType, ContextType>
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    type?: Resolver<ResolversTypes['PeriodeEnum'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AktivitetsvarselResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Aktivitetsvarsel'] = ResolversParentTypes['Aktivitetsvarsel'],
> = ResolversObject<{
    hendelseId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
    lest?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
    mottatt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArbeidsgiverResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Arbeidsgiver'] = ResolversParentTypes['Arbeidsgiver'],
> = ResolversObject<{
    navn?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArbeidsrelatertArsakResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['ArbeidsrelatertArsak'] = ResolversParentTypes['ArbeidsrelatertArsak'],
> = ResolversObject<{
    arsak?: Resolver<Array<ResolversTypes['ArbeidsrelatertArsakEnum']>, ParentType, ContextType>
    beskrivelse?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AvventendeResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Avventende'] = ResolversParentTypes['Avventende'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    tilrettelegging?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    type?: Resolver<ResolversTypes['PeriodeEnum'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BasePreviewSoknadResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['BasePreviewSoknad'] = ResolversParentTypes['BasePreviewSoknad'],
> = ResolversObject<{
    __resolveType: TypeResolveFn<
        'PreviewFremtidigSoknad' | 'PreviewNySoknad' | 'PreviewSendtSoknad',
        ParentType,
        ContextType
    >
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    perioder?: Resolver<Array<ResolversTypes['Soknadsperiode']>, ParentType, ContextType>
    status?: Resolver<ResolversTypes['SoknadsstatusEnum'], ParentType, ContextType>
    sykmeldingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
}>

export type BehandlerResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Behandler'] = ResolversParentTypes['Behandler'],
> = ResolversObject<{
    hprNummer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    navn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    telefon?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type BehandlingsdagerResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Behandlingsdager'] = ResolversParentTypes['Behandlingsdager'],
> = ResolversObject<{
    behandlingsdager?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    type?: Resolver<ResolversTypes['PeriodeEnum'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
    name: 'Date'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
    name: 'DateTime'
}

export type DialogmoteResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Dialogmote'] = ResolversParentTypes['Dialogmote'],
> = ResolversObject<{
    hendelseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    mottatt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
    tekst?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type FomTomResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['FomTom'] = ResolversParentTypes['FomTom'],
> = ResolversObject<{
    __resolveType: TypeResolveFn<
        'AktivitetIkkeMulig' | 'Avventende' | 'Behandlingsdager' | 'Gradert' | 'Reisetilskudd' | 'Soknadsperiode',
        ParentType,
        ContextType
    >
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
}>

export type GradertResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Gradert'] = ResolversParentTypes['Gradert'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    grad?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
    reisetilskudd?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    type?: Resolver<ResolversTypes['PeriodeEnum'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type MutationResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = ResolversObject<{
    markAktivitetvarselRead?: Resolver<
        Maybe<ResolversTypes['Boolean']>,
        ParentType,
        ContextType,
        RequireFields<MutationMarkAktivitetvarselReadArgs, 'sykmeldtId'>
    >
    read?: Resolver<
        Maybe<ResolversTypes['Boolean']>,
        ParentType,
        ContextType,
        RequireFields<MutationReadArgs, 'id' | 'type'>
    >
    unlinkSykmeldt?: Resolver<
        Maybe<ResolversTypes['Boolean']>,
        ParentType,
        ContextType,
        RequireFields<MutationUnlinkSykmeldtArgs, 'sykmeldtId'>
    >
}>

export type OppfolgingsplanResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Oppfolgingsplan'] = ResolversParentTypes['Oppfolgingsplan'],
> = ResolversObject<{
    hendelseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    mottatt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
    tekst?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PeriodeResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Periode'] = ResolversParentTypes['Periode'],
> = ResolversObject<{
    __resolveType: TypeResolveFn<
        'AktivitetIkkeMulig' | 'Avventende' | 'Behandlingsdager' | 'Gradert' | 'Reisetilskudd',
        ParentType,
        ContextType
    >
}>

export type PreviewFremtidigSoknadResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['PreviewFremtidigSoknad'] = ResolversParentTypes['PreviewFremtidigSoknad'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    perioder?: Resolver<Array<ResolversTypes['Soknadsperiode']>, ParentType, ContextType>
    status?: Resolver<ResolversTypes['SoknadsstatusEnum'], ParentType, ContextType>
    sykmeldingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PreviewNySoknadResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['PreviewNySoknad'] = ResolversParentTypes['PreviewNySoknad'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    ikkeSendtSoknadVarsel?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    ikkeSendtSoknadVarsletDato?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
    lest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    perioder?: Resolver<Array<ResolversTypes['Soknadsperiode']>, ParentType, ContextType>
    status?: Resolver<ResolversTypes['SoknadsstatusEnum'], ParentType, ContextType>
    sykmeldingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PreviewSendtSoknadResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['PreviewSendtSoknad'] = ResolversParentTypes['PreviewSendtSoknad'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    id?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    korrigererSoknadId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    lest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    perioder?: Resolver<Array<ResolversTypes['Soknadsperiode']>, ParentType, ContextType>
    sendtDato?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
    status?: Resolver<ResolversTypes['SoknadsstatusEnum'], ParentType, ContextType>
    sykmeldingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PreviewSoknadResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['PreviewSoknad'] = ResolversParentTypes['PreviewSoknad'],
> = ResolversObject<{
    __resolveType: TypeResolveFn<
        'PreviewFremtidigSoknad' | 'PreviewNySoknad' | 'PreviewSendtSoknad',
        ParentType,
        ContextType
    >
}>

export type PreviewSykmeldtResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['PreviewSykmeldt'] = ResolversParentTypes['PreviewSykmeldt'],
> = ResolversObject<{
    aktivitetsvarsler?: Resolver<Array<ResolversTypes['Aktivitetsvarsel']>, ParentType, ContextType>
    dialogmoter?: Resolver<Array<ResolversTypes['Dialogmote']>, ParentType, ContextType>
    fnr?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    friskmeldt?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    narmestelederId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    navn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    oppfolgingsplaner?: Resolver<Array<ResolversTypes['Oppfolgingsplan']>, ParentType, ContextType>
    orgnavn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    orgnummer?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    previewSoknader?: Resolver<Array<ResolversTypes['PreviewSoknad']>, ParentType, ContextType>
    sykmeldinger?: Resolver<Array<ResolversTypes['Sykmelding']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = ResolversObject<{
    mineSykmeldte?: Resolver<Maybe<Array<ResolversTypes['PreviewSykmeldt']>>, ParentType, ContextType>
    soknad?: Resolver<
        Maybe<ResolversTypes['Soknad']>,
        ParentType,
        ContextType,
        RequireFields<QuerySoknadArgs, 'soknadId'>
    >
    sykmelding?: Resolver<
        Maybe<ResolversTypes['Sykmelding']>,
        ParentType,
        ContextType,
        RequireFields<QuerySykmeldingArgs, 'sykmeldingId'>
    >
    virksomheter?: Resolver<Array<ResolversTypes['Virksomhet']>, ParentType, ContextType>
}>

export type ReisetilskuddResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Reisetilskudd'] = ResolversParentTypes['Reisetilskudd'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    type?: Resolver<ResolversTypes['PeriodeEnum'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SoknadResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Soknad'] = ResolversParentTypes['Soknad'],
> = ResolversObject<{
    fnr?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
    korrigererSoknadId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    lest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    navn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    perioder?: Resolver<Array<ResolversTypes['Soknadsperiode']>, ParentType, ContextType>
    sendtDato?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
    sendtTilNavDato?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
    sporsmal?: Resolver<Array<ResolversTypes['SoknadSporsmal']>, ParentType, ContextType>
    sykmeldingId?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SoknadSporsmalResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['SoknadSporsmal'] = ResolversParentTypes['SoknadSporsmal'],
> = ResolversObject<{
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
    kriterieForVisningAvUndersporsmal?: Resolver<
        Maybe<ResolversTypes['SoknadSporsmalKriterierEnum']>,
        ParentType,
        ContextType
    >
    max?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    min?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    sporsmalstekst?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    svar?: Resolver<Maybe<Array<Maybe<ResolversTypes['SoknadSporsmalSvar']>>>, ParentType, ContextType>
    svartype?: Resolver<ResolversTypes['SoknadSporsmalSvartypeEnum'], ParentType, ContextType>
    tag?: Resolver<ResolversTypes['SporsmalTagEnum'], ParentType, ContextType>
    undersporsmal?: Resolver<Maybe<Array<Maybe<ResolversTypes['SoknadSporsmal']>>>, ParentType, ContextType>
    undertekst?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SoknadSporsmalSvarResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['SoknadSporsmalSvar'] = ResolversParentTypes['SoknadSporsmalSvar'],
> = ResolversObject<{
    verdi?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SoknadsperiodeResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Soknadsperiode'] = ResolversParentTypes['Soknadsperiode'],
> = ResolversObject<{
    fom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    sykmeldingsgrad?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
    sykmeldingstype?: Resolver<ResolversTypes['PeriodeEnum'], ParentType, ContextType>
    tom?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SykmeldingResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Sykmelding'] = ResolversParentTypes['Sykmelding'],
> = ResolversObject<{
    arbeidsforEtterPeriode?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
    arbeidsgiver?: Resolver<ResolversTypes['Arbeidsgiver'], ParentType, ContextType>
    behandler?: Resolver<ResolversTypes['Behandler'], ParentType, ContextType>
    behandletTidspunkt?: Resolver<ResolversTypes['Date'], ParentType, ContextType>
    fnr?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    hensynArbeidsplassen?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
    innspillArbeidsplassen?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    kontaktDato?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
    lest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
    navn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    perioder?: Resolver<Array<ResolversTypes['Periode']>, ParentType, ContextType>
    sendtTilArbeidsgiverDato?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
    tiltakArbeidsplassen?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type VirksomhetResolvers<
    ContextType = ResolverContextType,
    ParentType extends ResolversParentTypes['Virksomhet'] = ResolversParentTypes['Virksomhet'],
> = ResolversObject<{
    navn?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    orgnummer?: Resolver<ResolversTypes['String'], ParentType, ContextType>
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = ResolverContextType> = ResolversObject<{
    AktivitetIkkeMulig?: AktivitetIkkeMuligResolvers<ContextType>
    Aktivitetsvarsel?: AktivitetsvarselResolvers<ContextType>
    Arbeidsgiver?: ArbeidsgiverResolvers<ContextType>
    ArbeidsrelatertArsak?: ArbeidsrelatertArsakResolvers<ContextType>
    Avventende?: AvventendeResolvers<ContextType>
    BasePreviewSoknad?: BasePreviewSoknadResolvers<ContextType>
    Behandler?: BehandlerResolvers<ContextType>
    Behandlingsdager?: BehandlingsdagerResolvers<ContextType>
    Date?: GraphQLScalarType
    DateTime?: GraphQLScalarType
    Dialogmote?: DialogmoteResolvers<ContextType>
    FomTom?: FomTomResolvers<ContextType>
    Gradert?: GradertResolvers<ContextType>
    Mutation?: MutationResolvers<ContextType>
    Oppfolgingsplan?: OppfolgingsplanResolvers<ContextType>
    Periode?: PeriodeResolvers<ContextType>
    PreviewFremtidigSoknad?: PreviewFremtidigSoknadResolvers<ContextType>
    PreviewNySoknad?: PreviewNySoknadResolvers<ContextType>
    PreviewSendtSoknad?: PreviewSendtSoknadResolvers<ContextType>
    PreviewSoknad?: PreviewSoknadResolvers<ContextType>
    PreviewSykmeldt?: PreviewSykmeldtResolvers<ContextType>
    Query?: QueryResolvers<ContextType>
    Reisetilskudd?: ReisetilskuddResolvers<ContextType>
    Soknad?: SoknadResolvers<ContextType>
    SoknadSporsmal?: SoknadSporsmalResolvers<ContextType>
    SoknadSporsmalSvar?: SoknadSporsmalSvarResolvers<ContextType>
    Soknadsperiode?: SoknadsperiodeResolvers<ContextType>
    Sykmelding?: SykmeldingResolvers<ContextType>
    Virksomhet?: VirksomhetResolvers<ContextType>
}>
