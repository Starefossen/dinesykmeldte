import { MockedResponse } from '@apollo/client/testing'
import { Cache, TypedDocumentNode } from '@apollo/client'
import { FetchResult } from '@apollo/client/link/core'
import { ResultFunction } from '@apollo/client/testing/core/mocking/mockLink'

import {
    ArbeidsrelatertArsakEnum,
    PreviewSoknad_PreviewFremtidigSoknad_Fragment,
    PreviewSoknad_PreviewNySoknad_Fragment,
    PreviewSoknad_PreviewSendtSoknad_Fragment,
    PreviewSykmeldtFragment,
    SykmeldingFragment,
    SykmeldingPeriode_AktivitetIkkeMulig_Fragment,
    SykmeldingPeriode_Gradert_Fragment,
    VirksomheterQuery,
    SoknadFragment,
    DialogmoteFragment,
    SoknadSporsmalSvartypeEnum,
    SoknadSporsmalKriterierEnum,
    PeriodeEnum,
    SporsmalTagEnum,
    SykmeldingPeriode_Behandlingsdager_Fragment,
    SykmeldingPeriode_Avventende_Fragment,
    SykmeldingPeriode_Reisetilskudd_Fragment,
    OppfolgingsplanFragment,
    AktivitetsvarselFragment,
} from '../../graphql/queries/graphql.generated'
import { PossibleSvarEnum } from '../../components/soknadpanel/SporsmalVarianter/SporsmalVarianter'

export function createPreviewSendtSoknad(
    overrides?: Partial<PreviewSoknad_PreviewSendtSoknad_Fragment>,
): PreviewSoknad_PreviewSendtSoknad_Fragment {
    return {
        __typename: 'PreviewSendtSoknad',
        id: 'default-soknad-1',
        fom: '2021-10-01',
        tom: '2021-10-20',
        lest: false,
        sendtDato: '2021-10-05',
        sykmeldingId: 'default-sykmelding-1',
        perioder: [],
        korrigererSoknadId: null,
        ...overrides,
    }
}

export function createPreviewFremtidigSoknad(
    overrides?: Partial<PreviewSoknad_PreviewFremtidigSoknad_Fragment>,
): PreviewSoknad_PreviewFremtidigSoknad_Fragment {
    return {
        __typename: 'PreviewFremtidigSoknad',
        id: 'default-soknad-1',
        fom: '2021-10-01',
        tom: '2021-10-20',
        sykmeldingId: 'default-sykmelding-1',
        perioder: [],
        ...overrides,
    }
}

export function createPreviewNySoknad(
    overrides?: Partial<PreviewSoknad_PreviewNySoknad_Fragment>,
): PreviewSoknad_PreviewNySoknad_Fragment {
    return {
        __typename: 'PreviewNySoknad',
        id: 'default-soknad-1',
        fom: '2021-10-01',
        tom: '2021-10-20',
        sykmeldingId: 'default-sykmelding-1',
        ikkeSendtSoknadVarsel: false,
        ikkeSendtSoknadVarsletDato: null,
        lest: false,
        perioder: [],
        ...overrides,
    }
}

export function createDialogmote(overrides?: Partial<DialogmoteFragment>): DialogmoteFragment {
    return {
        __typename: 'Dialogmote',
        hendelseId: '41e890b3-a9e4-4246-8ad2-aac208ef9a93',
        mottatt: '2022-11-10',
        tekst: 'Fake hendelse tekst, hello',
        ...overrides,
    }
}

export function createOppfolgingsplan(overrides?: Partial<OppfolgingsplanFragment>): OppfolgingsplanFragment {
    return {
        __typename: 'Oppfolgingsplan',
        hendelseId: '34b52ff3-befa-4699-90a5-ced6f5093dd0',
        mottatt: '2022-10-22',
        tekst: 'Fake hendelse tekst, hello',
        ...overrides,
    }
}

export function createBeskjeder(overrides?: Partial<AktivitetsvarselFragment>): AktivitetsvarselFragment {
    return {
        __typename: 'Aktivitetsvarsel',
        hendelseId: '34b52ff3-befa-4699-90a5-ced6f5093dd0',
        mottatt: '2022-03-01',
        lest: '2022-03-11',
        ...overrides,
    }
}

export function createSoknad(overrides?: Partial<SoknadFragment>): SoknadFragment {
    return {
        __typename: 'Soknad',
        id: 'soknad-id',
        sykmeldingId: 'default-sykmelding-1',
        fnr: '03197722411',
        navn: 'Test person',
        fom: '2021-03-01',
        tom: '2021-06-23',
        lest: false,
        sendtTilNavDato: null,
        sendtDato: '2021-03-01',
        perioder: [
            {
                __typename: 'Soknadsperiode',
                fom: '2021-11-08',
                tom: '2021-11-10',
                sykmeldingstype: PeriodeEnum.Gradert,
                sykmeldingsgrad: 50,
            },
        ],
        sporsmal: [
            {
                __typename: 'SoknadSporsmal',
                id: '895023532',
                tag: SporsmalTagEnum.Ferie,
                min: null,
                max: null,
                sporsmalstekst: 'Har du vært på ferie i denne perioden?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                svar: [
                    {
                        __typename: 'SoknadSporsmalSvar',
                        verdi: PossibleSvarEnum.NEI,
                    },
                ],
                undersporsmal: [
                    {
                        __typename: 'SoknadSporsmal',
                        id: '895023532',
                        tag: SporsmalTagEnum.Permisjon,
                        min: null,
                        max: null,
                        sporsmalstekst: 'Har du hatt permisjon i denne perioden?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                        kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                        svar: [
                            {
                                __typename: 'SoknadSporsmalSvar',
                                verdi: PossibleSvarEnum.JA,
                            },
                        ],
                        undersporsmal: [],
                    },
                ],
            },
        ],
        ...overrides,
    }
}

export function createSykmelding(overrides?: Partial<SykmeldingFragment>): SykmeldingFragment {
    return {
        __typename: 'Sykmelding',
        id: 'default-sykmelding-1',
        fnr: '08088033221',
        lest: false,
        navn: 'Test Testysson',
        behandletTidspunkt: '2020-05-05',
        arbeidsforEtterPeriode: false,
        tiltakArbeidsplassen: 'Flere pauser',
        innspillArbeidsplassen: null,
        arbeidsgiver: {
            __typename: 'Arbeidsgiver',
            navn: 'Eplemostfabrikken AS',
        },
        behandler: {
            __typename: 'Behandler',
            navn: 'B. Handlersson',
            telefon: '81549300',
        },
        perioder: [createAktivitetIkkeMuligPeriode()],
        sendtTilArbeidsgiverDato: '2020-06-01',
        ...overrides,
    }
}

export function createAktivitetIkkeMuligPeriode(
    overrides?: Partial<Pick<SykmeldingPeriode_AktivitetIkkeMulig_Fragment, 'fom' | 'tom' | 'arbeidsrelatertArsak'>>,
): SykmeldingPeriode_AktivitetIkkeMulig_Fragment {
    return {
        __typename: 'AktivitetIkkeMulig',
        fom: '2021-08-08',
        tom: '2021-08-15',
        arbeidsrelatertArsak: {
            __typename: 'ArbeidsrelatertArsak',
            arsak: [ArbeidsrelatertArsakEnum.ManglendeTilrettelegging],
            beskrivelse: 'Veldig årsak',
        },
        ...overrides,
    }
}

export function createGradertPeriode(
    overrides?: Partial<SykmeldingPeriode_Gradert_Fragment>,
): SykmeldingPeriode_Gradert_Fragment {
    return {
        __typename: 'Gradert',
        fom: '2021-08-16',
        tom: '2021-08-20',
        grad: 67,
        reisetilskudd: false,
        ...overrides,
    }
}

export function createBehandlingsdagerPeriode(
    overrides?: Partial<SykmeldingPeriode_Behandlingsdager_Fragment>,
): SykmeldingPeriode_Behandlingsdager_Fragment {
    return {
        __typename: 'Behandlingsdager',
        fom: '2022-06-23',
        tom: '2022-06-26',
        behandlingsdager: 3,
        ...overrides,
    }
}

export function createAvventendePeriode(
    overrides?: Partial<SykmeldingPeriode_Avventende_Fragment>,
): SykmeldingPeriode_Avventende_Fragment {
    return {
        __typename: 'Avventende',
        fom: '2022-06-01',
        tom: '2022-06-10',
        tilrettelegging: null,
        ...overrides,
    }
}

export function createReisetilskuddPeriode(
    overrides?: Partial<SykmeldingPeriode_Reisetilskudd_Fragment>,
): SykmeldingPeriode_Reisetilskudd_Fragment {
    return {
        __typename: 'Reisetilskudd',
        fom: '2022-06-11',
        tom: '2022-06-14',
        ...overrides,
    }
}

export function createPreviewSykmeldt(overrides?: Partial<PreviewSykmeldtFragment>): PreviewSykmeldtFragment {
    return {
        __typename: 'PreviewSykmeldt',
        navn: 'Ola Normann',
        fnr: '08088012345',
        orgnummer: '123456789',
        orgnavn: 'Bedrift AS',
        friskmeldt: false,
        narmestelederId: `narmesteleder-1-${overrides?.fnr ?? '08088012345'}`,
        sykmeldinger: [createSykmelding()],
        previewSoknader: [],
        dialogmoter: [],
        aktivitetsvarsler: [],
        oppfolgingsplaner: [],
        ...overrides,
    }
}

export function createVirksomhet(
    overrides?: Partial<VirksomheterQuery['virksomheter'][0]>,
): VirksomheterQuery['virksomheter'][0] {
    return {
        __typename: 'Virksomhet',
        navn: 'Virksomhet 1',
        orgnummer: '123456789',
        ...overrides,
    }
}

export function createInitialQuery<Query, Variables>(
    typedDocumentNode: TypedDocumentNode<Query, Variables>,
    data: Query,
    variables?: Variables,
): Cache.WriteQueryOptions<Query, Variables> {
    return {
        query: typedDocumentNode,
        data,
        variables,
    }
}

export function createMock<Query, Variables extends Record<string, unknown>>(mockedResponse: {
    request: { query: TypedDocumentNode<Query, Variables>; variables?: Variables }
    result?: FetchResult<Query> | ResultFunction<FetchResult<Query>>
    error?: Error
    delay?: number
    newData?: ResultFunction<FetchResult>
}): MockedResponse<Query> {
    return mockedResponse
}
