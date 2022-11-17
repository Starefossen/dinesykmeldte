import { formatISO, subDays } from 'date-fns'

import {
    ArbeidsrelatertArsakEnum,
    PeriodeEnum,
    QuerySoknadArgs,
    QuerySykmeldingArgs,
    SoknadSporsmalKriterierEnum,
    SoknadSporsmalSvartypeEnum,
    SoknadsstatusEnum,
    SporsmalTagEnum,
    Virksomhet,
} from '../../resolvers.generated'
import { dateAdd, dateSub } from '../../../../utils/dateUtils'
import { PossibleSvarEnum } from '../../../../components/soknadpanel/SporsmalVarianter/SporsmalVarianter'
import {
    PreviewSendtSoknadApi,
    PreviewSoknadApi,
    SoknadApi,
    SoknadSchema,
} from '../../../../services/minesykmeldte/schema/soknad'
import { DialogmoteApi } from '../../../../services/minesykmeldte/schema/dialogmote'
import { AktivitetsvarselApi } from '../../../../services/minesykmeldte/schema/melding'
import {
    SykmeldingApi,
    SykmeldingPeriodeApi,
    SykmeldingSchema,
} from '../../../../services/minesykmeldte/schema/sykmelding'
import { MineSykmeldteApiSchema, PreviewSykmeldtApi } from '../../../../services/minesykmeldte/schema/sykmeldt'
import { VirksomhetApi, VirksomheterApiSchema } from '../../../../services/minesykmeldte/schema/virksomhet'
import { OppfolgingsplanApi } from '../../../../services/minesykmeldte/schema/oppfolgingsplan'

import {
    createAktivitetIkkeMulig,
    createAvventende,
    createBehandlingsdager,
    createGradert,
    createReisetilskudd,
} from './mockDataCreators'
import { entries, erFriskmeldt, getEarliestFom } from './mockUtils'

const MOCK_ORG_1 = '896929119'
const MOCK_ORG_2 = '255374274'

const VirksomhetLiten: Virksomhet = {
    navn: 'Liten Bedrift AS',
    orgnummer: MOCK_ORG_1,
}

const VirksomhetStor: Virksomhet = {
    navn: 'Stor & Syk AS',
    orgnummer: MOCK_ORG_2,
}

type Sykmeldte =
    | 'Liten Kopp'
    | 'Gul Tomat'
    | 'Søt Katt'
    | 'Liten Hund'
    | 'Super Nova'
    | 'Stor Kake'
    | 'Page I. Nate'
    | 'Karl I. Koden'
    | 'Snerten Ost'

type SykmeldtDeduplicated = Omit<
    PreviewSykmeldtApi,
    | 'navn'
    | 'sykmeldinger'
    | 'previewSoknader'
    | 'dialogmoter'
    | 'friskmeldt'
    | 'aktivitetsvarsler'
    | 'oppfolgingsplaner'
>

type SykmeldingDeduplicated = Omit<
    SykmeldingApi,
    'navn' | 'fnr' | 'arbeidsgiver' | 'behandletTidspunkt' | 'perioder'
> & {
    perioder: [SykmeldingPeriodeApi, ...SykmeldingPeriodeApi[]]
}

export class FakeMockDB {
    private readonly _now = new Date()
    private readonly _behandlere = [{ navn: 'Frida Perma Frost', hprNummer: null, telefon: 'tel:94431152' }]
    private _sykmeldte: Record<Sykmeldte, SykmeldtDeduplicated> = {
        'Liten Kopp': {
            fnr: '03197722411',
            orgnummer: MOCK_ORG_1,
            orgnavn: VirksomhetLiten.navn,
            narmestelederId: 'c6d0b1b9-463d-4967-ab3e-d0f84a72b88f',
        },
        'Gul Tomat': {
            fnr: '98135321389',
            narmestelederId: '62f86147-fe79-4936-a9bc-3eb94a31cc48',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Søt Katt': {
            fnr: 'SOT-KATT',
            narmestelederId: '17620181-5b12-4843-9e0e-4d80dcd8fccf',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Liten Hund': {
            fnr: 'LITEN-HUND',
            narmestelederId: '30a821bf-5dc8-48b4-a2b7-48a8a61e0ebc',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Super Nova': {
            fnr: 'SUPERNOVA',
            narmestelederId: 'fc5e1e83-8ff0-4493-8367-71fa6b347927',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Stor Kake': {
            fnr: 'STOR-KAKE',
            narmestelederId: '4c6edd84-b63d-456c-8402-23f69af1dcf9',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Page I. Nate': {
            fnr: 'PAGE-I-NATE',
            narmestelederId: '5974d7ff-3c7d-4d0b-9c19-2930f2d0acf0',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Karl I. Koden': {
            fnr: 'KARL-I-KODEN',
            narmestelederId: '19d014c9-2057-41d2-9339-df79a7f8b6f6',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
        'Snerten Ost': {
            fnr: 'SNERTEN-OST',
            narmestelederId: '4c5371f5-2d97-4778-9e45-bd2c9b021dbd',
            orgnummer: MOCK_ORG_2,
            orgnavn: VirksomhetStor.navn,
        },
    }

    private readonly _sykmeldinger: Record<Sykmeldte, [SykmeldingDeduplicated, ...SykmeldingDeduplicated[]]> = {
        // Liten kopp har er friskmeldt, og har flere sykmeldinger med varsler og med flere perioder
        'Liten Kopp': [
            {
                id: '8317b5df-0a42-4b2b-a1de-fccbd9aca63a',
                kontaktDato: null,
                lest: false,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig('2021-11-02', 2, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse: 'Må jobbe hjemmefra',
                    }),
                    createGradert('2021-11-04', 2),
                    createAvventende('2021-11-06', 2, 'Må ha ekstra lange pauser'),
                    createBehandlingsdager('2021-11-08', 2),
                    createReisetilskudd('2021-11-10', 2),
                ],
                sendtTilArbeidsgiverDato: '2021-11-20',
            },
            {
                id: '47440a09-e49c-49e1-b9da-17ce9a12a5a1',
                kontaktDato: null,
                lest: false,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig('2021-11-02', 8, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse: 'andre årsaker til sykefravær',
                    }),
                ],
                sendtTilArbeidsgiverDato: '2021-11-23',
            },
            {
                id: '7d7dbfce-35e8-42c4-b189-9701a685e613',
                kontaktDato: null,
                lest: false,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig('2021-11-15', 5, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse: 'andre årsaker til sykefravær',
                    }),
                ],
                sendtTilArbeidsgiverDato: '2021-11-28',
            },
        ],
        // Har sykmelding i fremtiden
        'Gul Tomat': [
            {
                id: '5b64a54c-78f5-49a0-a89c-a4b878f3d7fa',
                kontaktDato: null,
                lest: true,
                perioder: [
                    createAktivitetIkkeMulig(dateAdd(this._now, { days: 25 }), 10, {
                        arsak: [ArbeidsrelatertArsakEnum.ManglendeTilrettelegging],
                        beskrivelse: 'Trenger flere ståpulter',
                    }),
                ],
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: 'Må gjøre ting',
                behandler: this._behandlere[0],
                sendtTilArbeidsgiverDato: '2022-05-20',
            },
        ],
        // Er i en aktiv sykmelding akkurat nå
        'Søt Katt': [
            {
                id: '39687e2b-2939-4e4a-9241-1b57e81eebee',
                kontaktDato: null,
                lest: true,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig(dateSub(this._now, { days: 0 }), 10, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse: 'andre årsaker til sykefravær',
                    }),
                ],
                sendtTilArbeidsgiverDato: '2022-05-10',
            },
        ],
        // Har en lang aktiv sykmelding
        'Liten Hund': [
            {
                id: '58cbd8c3-0921-40d0-b7d3-b8c07eaef9a1',
                kontaktDato: null,
                lest: true,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [createGradert(dateSub(this._now, { days: 25 }), 40, 60)],
                sendtTilArbeidsgiverDato: '2022-04-01',
            },
        ],
        // Har en sykmleding med en periode i fortiden og en i fremtiden
        'Super Nova': [
            {
                id: '9c237c5b-1011-44bf-a93a-7305e60d1bdf',
                kontaktDato: null,
                lest: true,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig(dateSub(this._now, { days: 25 }), 10, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse: 'Trenger førerkatt',
                    }),
                    createAktivitetIkkeMulig(dateAdd(this._now, { days: 15 }), 10, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse: 'Trenger førerhund',
                    }),
                ],
                sendtTilArbeidsgiverDato: '2022-04-20',
            },
        ],
        'Stor Kake': [
            {
                id: '67c87788-4fb0-4d94-8693-605f19bb29dc',
                kontaktDato: null,
                lest: false,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig(dateSub(this._now, { days: 65 }), 7, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse:
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                    }),
                    createBehandlingsdager('2021-11-08', 2),
                ],
                sendtTilArbeidsgiverDato: '2022-03-20',
            },
            {
                id: 'efa168f8-9e74-41b6-9eb1-fb3ec8d414eb',
                kontaktDato: null,
                lest: false,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [createReisetilskudd('2021-11-10', 2)],
                sendtTilArbeidsgiverDato: '2021-11-20',
            },
            {
                id: '4caa20ba-6a93-4012-93a1-d4c99cc5f400',
                kontaktDato: null,
                lest: false,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må ta det pent',
                tiltakArbeidsplassen: 'Fortsett som sist.',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [createAvventende('2021-11-06', 2, 'Må ha ekstra lange pauser')],
                sendtTilArbeidsgiverDato: '2021-11-15',
            },
        ],
        'Karl I. Koden': [
            {
                id: '285b8615-32d3-4591-9890-8c2d4330cd1d',
                kontaktDato: null,
                lest: true,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Ta det rolig',
                tiltakArbeidsplassen: 'Sev-henk pult',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig(dateSub(this._now, { days: 74 }), 12, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse:
                            'Danny alter practices paradise romantic titled over, whenever tutorials systems consisting alaska stats trivia',
                    }),
                ],
                sendtTilArbeidsgiverDato: '2022-02-20',
            },
        ],
        'Snerten Ost': [
            {
                id: 'd95ebd48-f561-4a3f-ad94-4f114a7620a5',
                kontaktDato: null,
                lest: true,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må stress',
                tiltakArbeidsplassen: 'Sev-henk pult',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig(dateSub(this._now, { days: 77 }), 12, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse:
                            'Danny alter practices paradise romantic titled over, whenever tutorials systems consisting alaska stats trivia',
                    }),
                ],
                sendtTilArbeidsgiverDato: null,
            },
        ],
        'Page I. Nate': [
            {
                id: '783119bf-d0fe-403d-b75b-826fa1382483',
                kontaktDato: null,
                lest: true,
                arbeidsforEtterPeriode: true,
                hensynArbeidsplassen: 'Må vises på side 2',
                tiltakArbeidsplassen: 'Sev-henk pult',
                innspillArbeidsplassen: null,
                behandler: this._behandlere[0],
                perioder: [
                    createAktivitetIkkeMulig(dateSub(this._now, { days: 94 }), 12, {
                        arsak: [ArbeidsrelatertArsakEnum.Annet],
                        beskrivelse:
                            'Danny alter practices paradise romantic titled over, whenever tutorials systems consisting alaska stats trivia',
                    }),
                ],
                sendtTilArbeidsgiverDato: null,
            },
        ],
    }
    private readonly _soknader: Record<Sykmeldte, PreviewSoknadApi[]> = {
        'Gul Tomat': [
            {
                status: SoknadsstatusEnum.Sendt,
                id: 'eb71f3a2-149b-4347-9aa7-9909be005a98',
                sykmeldingId: this._sykmeldinger['Gul Tomat'][0].id,
                lest: false,
                sendtDato: '2022-06-30',
                fom: '2022-06-19',
                tom: '2022-06-29',
                korrigererSoknadId: null,
                perioder: [
                    {
                        fom: '2022-06-19',
                        tom: '2022-06-29',
                        sykmeldingstype: PeriodeEnum.AktivitetIkkeMulig,
                        sykmeldingsgrad: 50,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Ny,
                id: '0e32a9e6-ab2c-4620-95d7-bcb2cc4fd111',
                sykmeldingId: this._sykmeldinger['Gul Tomat'][0].id,
                fom: '2022-05-01',
                tom: '2022-05-14',
                ikkeSendtSoknadVarsel: true,
                ikkeSendtSoknadVarsletDato: '2022-06-20',
                lest: false,
                perioder: [
                    {
                        fom: '2022-05-01',
                        tom: '2022-05-14',
                        sykmeldingstype: PeriodeEnum.AktivitetIkkeMulig,
                        sykmeldingsgrad: null,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Ny,
                id: '22fd1d25-7642-4938-a595-1e6bcd612728',
                sykmeldingId: this._sykmeldinger['Gul Tomat'][0].id,
                fom: '2022-05-09',
                tom: '2022-05-15',
                ikkeSendtSoknadVarsel: true,
                ikkeSendtSoknadVarsletDato: '2022-07-20',
                lest: false,
                perioder: [
                    {
                        fom: '2022-05-09',
                        tom: '2022-05-15',
                        sykmeldingstype: PeriodeEnum.AktivitetIkkeMulig,
                        sykmeldingsgrad: null,
                    },
                ],
            },
        ],
        'Liten Kopp': [
            {
                status: SoknadsstatusEnum.Sendt,
                id: '01206017-dbcf-4f35-ac1f-8cbd2f76d012',
                sykmeldingId: this._sykmeldinger['Liten Kopp'][0].id,
                lest: false,
                sendtDato: '2021-11-22',
                fom: '2021-11-08',
                tom: '2021-11-08',
                korrigererSoknadId: null,
                perioder: [
                    {
                        fom: '2021-11-08',
                        tom: '2021-11-10',
                        sykmeldingstype: PeriodeEnum.Gradert,
                        sykmeldingsgrad: 50,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Sendt,
                id: '83047deb-e8e4-4f0f-a9d4-d9a39a62e9b0',
                sykmeldingId: this._sykmeldinger['Liten Kopp'][0].id,
                lest: true,
                sendtDato: '2021-12-12',
                fom: '2021-12-12',
                tom: '2021-12-21',
                korrigererSoknadId: null,
                perioder: [
                    {
                        fom: '2021-12-12',
                        tom: '2021-12-21',
                        sykmeldingstype: PeriodeEnum.AktivitetIkkeMulig,
                        sykmeldingsgrad: null,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Ny,
                id: 'a1f54a29-52ae-411d-b2f3-8c15d24908a1',
                sykmeldingId: this._sykmeldinger['Liten Kopp'][0].id,
                fom: '2021-11-08',
                tom: '2021-11-08',
                ikkeSendtSoknadVarsel: true,
                ikkeSendtSoknadVarsletDato: '2022-08-20',
                lest: false,
                perioder: [
                    {
                        fom: '2021-11-08',
                        tom: '2021-11-10',
                        sykmeldingstype: PeriodeEnum.AktivitetIkkeMulig,
                        sykmeldingsgrad: null,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Fremtidig,
                id: '698521d1-067f-49d5-a4b2-d4ee74696787',
                fom: '2021-11-08',
                tom: '2021-11-08',
                sykmeldingId: this._sykmeldinger['Liten Kopp'][0].id,
                perioder: [
                    {
                        fom: '2021-11-08',
                        tom: '2021-11-10',
                        sykmeldingstype: PeriodeEnum.AktivitetIkkeMulig,
                        sykmeldingsgrad: null,
                    },
                ],
            },
        ],
        'Søt Katt': [],
        'Liten Hund': [],
        'Super Nova': [],
        'Stor Kake': [
            {
                status: SoknadsstatusEnum.Sendt,
                id: 'a9ef3886-4e3b-4d0d-8884-d55d9ae5e65a',
                sykmeldingId: this._sykmeldinger['Stor Kake'][0].id,
                lest: false,
                sendtDato: '2021-11-16',
                fom: '2021-11-08',
                tom: '2021-11-10',
                korrigererSoknadId: null,
                perioder: [
                    {
                        fom: '2021-11-08',
                        tom: '2021-11-10',
                        sykmeldingstype: PeriodeEnum.Behandlingsdager,
                        sykmeldingsgrad: null,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Sendt,
                id: '6102db6f-e013-499f-a32c-334fae8fb4d5',
                sykmeldingId: this._sykmeldinger['Stor Kake'][1].id,
                lest: true,
                sendtDato: '2021-11-16',
                fom: '2021-11-10',
                tom: '2021-11-12',
                korrigererSoknadId: null,
                perioder: [
                    {
                        fom: '2021-11-10',
                        tom: '2021-11-12',
                        sykmeldingstype: PeriodeEnum.Reisetilskudd,
                        sykmeldingsgrad: null,
                    },
                ],
            },
            {
                status: SoknadsstatusEnum.Sendt,
                id: 'b864d147-5a21-4715-b9cc-d6fe0da38c09',
                sykmeldingId: this._sykmeldinger['Stor Kake'][2].id,
                lest: true,
                sendtDato: '2021-11-16',
                fom: '2021-11-06',
                tom: '2021-11-08',
                korrigererSoknadId: null,
                perioder: [
                    {
                        fom: '2021-11-06',
                        tom: '2021-11-08',
                        sykmeldingstype: PeriodeEnum.Avventende,
                        sykmeldingsgrad: null,
                    },
                ],
            },
        ],
        'Page I. Nate': [],
        'Karl I. Koden': [],
        'Snerten Ost': [],
    }
    private readonly _dialogmoter: Record<Sykmeldte, DialogmoteApi[]> = {
        'Gul Tomat': [
            {
                hendelseId: '8f2a96cf-2fe9-40fb-a946-79579538ee3e',
                mottatt: formatISO(subDays(this._now, 15)),
                tekst: 'Innkalling til dialogmøte',
            },
        ],
        'Liten Kopp': [],
        'Søt Katt': [],
        'Liten Hund': [],
        'Super Nova': [
            {
                hendelseId: 'f311aee3-9b50-4214-a456-732fb2dcacc0',
                mottatt: formatISO(subDays(this._now, 10)),
                tekst: 'Innkalling til dialogmøte',
            },
            {
                hendelseId: '5146da6c-66fe-4683-b9d6-2a57262e2c2f',
                mottatt: formatISO(subDays(this._now, 12)),
                tekst: 'Endring av dialogmøte',
            },
            {
                hendelseId: '10d0026c-8e8c-47c0-b08a-3ba745469787',
                mottatt: formatISO(subDays(this._now, 25)),
                tekst: 'Referat fra dialogmøte',
            },
        ],
        'Stor Kake': [],
        'Page I. Nate': [],
        'Karl I. Koden': [],
        'Snerten Ost': [],
    }
    private readonly _aktivitetsvarsler: Record<Sykmeldte, AktivitetsvarselApi[]> = {
        'Liten Kopp': [],
        'Gul Tomat': [
            {
                hendelseId: 'd07fe229-ee04-4317-bf36-2163d3a9460c',
                mottatt: formatISO(subDays(this._now, 10)),
                lest: null,
            },
            {
                hendelseId: '49b3ed58-a432-4393-b4cf-dede03ffa8d9',
                mottatt: formatISO(subDays(this._now, 12)),
                lest: null,
            },
        ],
        'Søt Katt': [],
        'Liten Hund': [],
        'Super Nova': [],
        'Stor Kake': [],
        'Page I. Nate': [],
        'Karl I. Koden': [],
        'Snerten Ost': [],
    }

    private readonly _oppfolgingsplaner: Record<Sykmeldte, OppfolgingsplanApi[]> = {
        'Liten Kopp': [],
        'Gul Tomat': [],
        'Søt Katt': [],
        'Liten Hund': [],
        'Super Nova': [
            {
                hendelseId: '4014c115-b584-43a8-9467-aa609b8b7262',
                mottatt: formatISO(subDays(this._now, 6)),
                tekst: 'Dette er en oppfølgingsplan.',
            },
            {
                hendelseId: '0189afe5-7636-48d9-be95-b0da01a61c6f',
                mottatt: formatISO(subDays(this._now, 10)),
                tekst: 'Dette er også en oppfølgingsplan.',
            },
            {
                hendelseId: '2322ae93-92c2-43a5-b537-92a968e59026',
                mottatt: formatISO(subDays(this._now, 10)),
                tekst: 'Også en siste oppfolgingsplan',
            },
        ],
        'Stor Kake': [],
        'Page I. Nate': [],
        'Karl I. Koden': [],
        'Snerten Ost': [],
    }

    public get virksomheter(): VirksomhetApi[] {
        return VirksomheterApiSchema.parse([VirksomhetStor, VirksomhetLiten])
    }

    public get sykmeldte(): PreviewSykmeldtApi[] {
        return MineSykmeldteApiSchema.parse(
            entries(this._sykmeldte).map(([sykmeldtNavn, sykmeldt]): PreviewSykmeldtApi => {
                const sykmeldtSykmeldinger: SykmeldingApi[] = entries(this._sykmeldinger)
                    .filter(([sykmeldingNavn]) => sykmeldtNavn === sykmeldingNavn)
                    .flatMap(([navn, sykmeldinger]) =>
                        sykmeldinger.map((it): [Sykmeldte, SykmeldingDeduplicated] => [navn, it]),
                    )
                    .map(([navn, sykmelding]): SykmeldingApi => toCompleteSykmelding(navn, sykmeldt, sykmelding))

                if (sykmeldtSykmeldinger.length === 0) {
                    throw new Error(
                        `Invalid test data, every sykmeldt needs at least one sykmelding, "${sykmeldtNavn}" has none`,
                    )
                }

                return {
                    ...sykmeldt,
                    navn: sykmeldtNavn,
                    sykmeldinger: sykmeldtSykmeldinger,
                    friskmeldt: erFriskmeldt(sykmeldtSykmeldinger),
                    dialogmoter: this._dialogmoter[sykmeldtNavn],
                    previewSoknader: this._soknader[sykmeldtNavn],
                    aktivitetsvarsler: this._aktivitetsvarsler[sykmeldtNavn],
                    oppfolgingsplaner: this._oppfolgingsplaner[sykmeldtNavn],
                }
            }),
        )
    }

    public async getSykmelding(sykmeldingId: QuerySykmeldingArgs['sykmeldingId']): Promise<SykmeldingApi> {
        const [navn, sykmelding] = this.getSykmeldingById(sykmeldingId)
        const sykmeldt: SykmeldtDeduplicated = this._sykmeldte[navn]

        if (process.env.NODE_ENV === 'development') {
            if (Math.random() > 0.92) {
                throw new Error('Fake sykmelding fetching error')
            }
        }

        return SykmeldingSchema.parse(toCompleteSykmelding(navn, sykmeldt, sykmelding))
    }

    public async getSoknad(soknadId: QuerySoknadArgs['soknadId']): Promise<SoknadApi> {
        const [navn, soknad] = this.getSoknadById(soknadId)
        const sykmeldt: SykmeldtDeduplicated = this._sykmeldte[navn]

        if (soknad.status !== SoknadsstatusEnum.Sendt) {
            throw new Error('500: Søknad is not sendt or korrigert and should not be fetched using getSoknad')
        }

        return SoknadSchema.parse(toCompleteSoknad(navn, sykmeldt, soknad))
    }

    public markSoknadRead(soknadId: string): void {
        const [, soknad] = this.getSoknadById(soknadId)

        switch (soknad.status) {
            // Disse har ikke noe varsel
            case 'FREMTIDIG':
                break
            case 'NY':
            case 'SENDT':
                soknad.lest = true
                break
            default:
                throw new Error('Unable to deduce soknad type')
        }
    }

    public markSykmeldingRead(sykmeldingId: string): void {
        const [, sykmelding] = this.getSykmeldingById(sykmeldingId)

        sykmelding.lest = true
    }

    public markHendelseResolved(hendelseId: string): void {
        if (this.hasDialogmote(hendelseId)) {
            const [sykmeldt] = this.getDialogmoteById(hendelseId)
            this._dialogmoter[sykmeldt] = this._dialogmoter[sykmeldt].filter((it) => it.hendelseId !== hendelseId)
        } else {
            const [sykmeldt] = this.getOppfolgingsplanById(hendelseId)
            this._oppfolgingsplaner[sykmeldt] = this._oppfolgingsplaner[sykmeldt].filter(
                (it) => it.hendelseId !== hendelseId,
            )
        }
    }

    public markAktivitetvarselRead(aktivitetsvarselId: string): void {
        const [, aktivitetsvarsel] = this.getAktivitetsvarselById(aktivitetsvarselId)

        aktivitetsvarsel.lest = formatISO(new Date())
    }

    public unlinkSykmeldte(narmestelederId: string): void {
        const sykmeldt = entries(this._sykmeldte).find(([, sykmeldt]) => sykmeldt.narmestelederId === narmestelederId)

        if (!sykmeldt) {
            throw new Error(`Unable to find sykmeldt with narmestelederId ${narmestelederId}`)
        }

        delete this._sykmeldte[sykmeldt[0]]
    }

    public hasDialogmote(hendelseId: string): boolean {
        try {
            this.getDialogmoteById(hendelseId)
            return true
        } catch (e) {
            return false
        }
    }

    public hasOppfolgingsplan(hendelseId: string): boolean {
        try {
            this.getOppfolgingsplanById(hendelseId)
            return true
        } catch (e) {
            return false
        }
    }

    private getSykmeldingById(sykmeldingId: string): [Sykmeldte, SykmeldingDeduplicated] {
        const sykmeldingTuple: [Sykmeldte, SykmeldingDeduplicated] | undefined = entries(this._sykmeldinger)
            .flatMap(([navn, sykmeldinger]) =>
                sykmeldinger.map((it): [Sykmeldte, SykmeldingDeduplicated] => [navn, it]),
            )
            .find(([, sykmelding]) => sykmelding.id === sykmeldingId)

        if (!sykmeldingTuple) {
            throw new Error(`404: Unable to find sykmelding with ID ${sykmeldingId} in mock test data`)
        }

        return sykmeldingTuple
    }

    private getSoknadById(soknadId: string): [Sykmeldte, PreviewSoknadApi] {
        const soknadTuple: [Sykmeldte, PreviewSoknadApi] | undefined = entries(this._soknader)
            .flatMap(([navn, soknader]) => soknader.map((it): [Sykmeldte, PreviewSoknadApi] => [navn, it]))
            .find(([, soknad]) => soknad.id === soknadId)

        if (!soknadTuple) {
            throw new Error(`404: Unable to find soknad with ID ${soknadId} in mock test data`)
        }

        return soknadTuple
    }

    private getDialogmoteById(hendelseId: string): [Sykmeldte, DialogmoteApi] {
        const hendelseTuple: [Sykmeldte, DialogmoteApi] | undefined = entries(this._dialogmoter)
            .flatMap(([navn, hendelser]) => hendelser.map((it): [Sykmeldte, DialogmoteApi] => [navn, it]))
            .find(([, hendelse]) => hendelse.hendelseId === hendelseId)

        if (!hendelseTuple) {
            throw new Error(`404: Unable to find hendelse with ID ${hendelseId} in mock test data`)
        }

        return hendelseTuple
    }

    private getOppfolgingsplanById(hendelseId: string): [Sykmeldte, OppfolgingsplanApi] {
        const hendelseTuple: [Sykmeldte, OppfolgingsplanApi] | undefined = entries(this._oppfolgingsplaner)
            .flatMap(([navn, hendelser]) => hendelser.map((it): [Sykmeldte, OppfolgingsplanApi] => [navn, it]))
            .find(([, hendelse]) => hendelse.hendelseId === hendelseId)

        if (!hendelseTuple) {
            throw new Error(`404: Unable to find hendelse with ID ${hendelseId} in mock test data`)
        }

        return hendelseTuple
    }

    private getAktivitetsvarselById(aktivitetsvarselId: string): [Sykmeldte, AktivitetsvarselApi] {
        const aktivitetsvarselTuple: [Sykmeldte, AktivitetsvarselApi] | undefined = entries(this._aktivitetsvarsler)
            .flatMap(([navn, aktivitetsvarsler]) =>
                aktivitetsvarsler.map((it): [Sykmeldte, AktivitetsvarselApi] => [navn, it]),
            )
            .find(([, aktivitetsvarsel]) => aktivitetsvarsel.hendelseId === aktivitetsvarselId)

        if (!aktivitetsvarselTuple) {
            throw new Error(`404: Unable to find aktivitetsvarsel with ID ${aktivitetsvarselId} in mock test data`)
        }

        return aktivitetsvarselTuple
    }
}

function toCompleteSykmelding(
    navn: Sykmeldte,
    sykmeldt: SykmeldtDeduplicated,
    sykmelding: SykmeldingDeduplicated,
): SykmeldingApi {
    return {
        ...sykmelding,
        navn,
        fnr: sykmeldt.fnr,
        arbeidsgiver: {
            navn: VirksomhetLiten.navn,
        },
        // Ikke faktisk tidligeste fom i miljøene, kun for testdata
        behandletTidspunkt: getEarliestFom(sykmelding.perioder),
    }
}

function toCompleteSoknad(navn: string, sykmeldt: SykmeldtDeduplicated, soknad: PreviewSendtSoknadApi): SoknadApi {
    return {
        ...soknad,
        navn,
        fnr: sykmeldt.fnr,
        fom: '2021-11-08',
        tom: '2021-11-10',
        perioder: soknad.perioder,
        korrigererSoknadId: soknad.korrigererSoknadId,
        sendtTilNavDato: '2021-11-22',
        sporsmal: [
            {
                id: '42',
                tag: SporsmalTagEnum.Ansvarserklaring,
                min: null,
                max: null,
                sporsmalstekst:
                    'Jeg vet at jeg kan miste retten til sykepenger hvis opplysningene jeg gir ikke er riktige eller fullstendige. Jeg vet også at NAV kan holde igjen eller kreve tilbake penger, og at å gi feil opplysninger kan være straffbart.',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.CheckboxPanel,
                kriterieForVisningAvUndersporsmal: null,
                svar: [{ verdi: PossibleSvarEnum.CHECKED }],
                undersporsmal: [],
            },
            {
                id: '43',
                tag: SporsmalTagEnum.PermittertNaa,
                sporsmalstekst: 'Var du permittert av arbeidsgiveren din da du ble sykmeldt 4. januar 2021?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Ja,
                svar: [{ verdi: PossibleSvarEnum.NEI }],
                undersporsmal: [
                    {
                        id: '44',
                        tag: SporsmalTagEnum.PermittertNaaNar,
                        sporsmalstekst: 'Velg første dag i permitteringen',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.Dato,
                        min: '2020-01-27',
                        max: '2020-06-11',
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                ],
            },
            {
                id: '45',
                tag: SporsmalTagEnum.PermittertPeriode,
                sporsmalstekst:
                    'Har du vært permittert av arbeidsgiveren din i mer enn 14 sammenhengende dager mellom 22. oktober - 22. november 2020?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Ja,
                svar: [{ verdi: PossibleSvarEnum.NEI }],
                undersporsmal: [
                    {
                        id: '46',
                        tag: SporsmalTagEnum.PermittertNaa,
                        sporsmalstekst: '',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.Periode,
                        min: '2020-10-22',
                        max: '2020-11-22',
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                ],
            },
            {
                id: '47',
                tag: SporsmalTagEnum.Friskmeldt,
                sporsmalstekst: 'Brukte du hele sykmeldingen fram til 11. juni 2020?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Nei,
                svar: [{ verdi: PossibleSvarEnum.JA }],
                undersporsmal: [
                    {
                        id: '48',
                        tag: SporsmalTagEnum.FriskmeldtStart,
                        sporsmalstekst: 'Fra hvilken dato trengte du ikke lenger sykmeldingen?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.Dato,
                        min: '2020-05-27',
                        max: '2020-06-11',
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                ],
            },
            {
                id: '49',
                tag: SporsmalTagEnum.AndreInntektskilder,
                sporsmalstekst: 'Har du hatt inntekt mens du har vært sykmeldt i perioden 27. mai - 11. juni 2020?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Ja,
                svar: [{ verdi: PossibleSvarEnum.NEI }],
                undersporsmal: [
                    {
                        id: '50',
                        tag: SporsmalTagEnum.HvilkeAndreInntektskilder,
                        sporsmalstekst: 'Hvilke inntektskilder har du hatt?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.CheckboxGruppe,
                        min: null,
                        max: null,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [
                            {
                                id: '51',
                                tag: SporsmalTagEnum.InntektskildeAndreArbeidsforhold,
                                sporsmalstekst: 'andre arbeidsforhold',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '52',
                                        tag: SporsmalTagEnum.InntektskildeAndreArbeidsforholdErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '53',
                                tag: SporsmalTagEnum.InntektskildeSelvstendig,
                                sporsmalstekst: 'selvstendig næringsdrivende',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '54',
                                        tag: SporsmalTagEnum.InntektskildeSelvstendigErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '55',
                                tag: SporsmalTagEnum.InntektskildeSelvstendigDagmamma,
                                sporsmalstekst: 'dagmamma',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '56',
                                        tag: SporsmalTagEnum.InntektskildeSelvstendigDagmammaErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '57',
                                tag: SporsmalTagEnum.InntektskildeJordbruker,
                                sporsmalstekst: 'jordbruk / fiske / reindrift',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '58',
                                        tag: SporsmalTagEnum.InntektskildeJordbrukerErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '59',
                                tag: SporsmalTagEnum.InntektskildeFrilanser,
                                sporsmalstekst: 'frilanser',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '60',
                                        tag: SporsmalTagEnum.InntektskildeFrilanserErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '61',
                                tag: SporsmalTagEnum.InntektskildeOmsorgslonn,
                                sporsmalstekst: 'omsorgslønn fra kommunen',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '62',
                                        tag: SporsmalTagEnum.InntektskildeOmsorgslonnErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '63',
                                tag: SporsmalTagEnum.InntektskildeFosterhjem,
                                sporsmalstekst: 'fosterhjemgodtgjørelse',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Checked,
                                svar: [],
                                undersporsmal: [
                                    {
                                        id: '64',
                                        tag: SporsmalTagEnum.InntektskildeFosterhjemErDuSykmeldt,
                                        sporsmalstekst: 'Er du sykmeldt fra dette?',
                                        undertekst: null,
                                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                                        min: null,
                                        max: null,
                                        kriterieForVisningAvUndersporsmal: null,
                                        svar: [],
                                        undersporsmal: [],
                                    },
                                ],
                            },
                            {
                                id: '65',
                                tag: SporsmalTagEnum.InntektskildeAnnet,
                                sporsmalstekst: 'annet',
                                undertekst: null,
                                svartype: SoknadSporsmalSvartypeEnum.Checkbox,
                                min: null,
                                max: null,
                                kriterieForVisningAvUndersporsmal: null,
                                svar: [],
                                undersporsmal: [],
                            },
                        ],
                    },
                ],
            },
            {
                id: '66',
                tag: SporsmalTagEnum.Utdanning,
                sporsmalstekst: 'Har du vært under utdanning i løpet av perioden 27. mai - 11. juni 2020?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Ja,
                svar: [{ verdi: PossibleSvarEnum.NEI }],
                undersporsmal: [
                    {
                        id: '67',
                        tag: SporsmalTagEnum.UtdanningStart,
                        sporsmalstekst: 'Når startet du på utdanningen?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.Dato,
                        min: null,
                        max: '2020-06-11',
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                    {
                        id: '68',
                        tag: SporsmalTagEnum.Fulltidsstudium,
                        sporsmalstekst: 'Er utdanningen et fulltidsstudium?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                        min: null,
                        max: null,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                ],
            },
            {
                id: '69',
                tag: SporsmalTagEnum.ArbeidsledigUtland,
                sporsmalstekst: 'Var du på reise utenfor EØS mens du var sykmeldt 27. mai - 11. juni 2020?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: SoknadSporsmalKriterierEnum.Ja,
                svar: [{ verdi: PossibleSvarEnum.NEI }],
                undersporsmal: [
                    {
                        id: '70',
                        tag: SporsmalTagEnum.UtlandNar,
                        sporsmalstekst: 'Når var du utenfor EØS?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.Periode,
                        min: '2020-05-27',
                        max: '2020-06-11',
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                    {
                        id: '71',
                        tag: SporsmalTagEnum.UtlandsoppholdSoktSykepenger,
                        sporsmalstekst: 'Har du søkt om å beholde sykepengene for disse dagene?',
                        undertekst: null,
                        svartype: SoknadSporsmalSvartypeEnum.JaNei,
                        min: null,
                        max: null,
                        kriterieForVisningAvUndersporsmal: null,
                        svar: [],
                        undersporsmal: [],
                    },
                ],
            },
            {
                id: '73',
                tag: SporsmalTagEnum.ArbeidUtenforNorge,
                sporsmalstekst: 'Har du arbeidet i utlandet i løpet av de siste 12 månedene?',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.JaNei,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: null,
                svar: [{ verdi: PossibleSvarEnum.NEI }],
                undersporsmal: [],
            },
            {
                id: '74',
                tag: SporsmalTagEnum.VaerKlarOverAt,
                sporsmalstekst: 'Viktig å være klar over:',
                undertekst:
                    '<ul><li>Du kan bare få sykepenger hvis det er din egen sykdom eller skade som hindrer deg i å jobbe. Sosiale eller økonomiske problemer gir ikke rett til sykepenger.</li><li>Du kan miste retten til sykepenger hvis du nekter å opplyse om din egen arbeidsevne, eller hvis du ikke tar imot behandling eller tilrettelegging.</li><li>Retten til sykepenger gjelder bare inntekt du har mottatt som lønn og betalt skatt av på sykmeldingstidspunktet.</li><li>NAV kan innhente opplysninger som er nødvendige for å behandle søknaden.</li><li>Du må melde fra til NAV hvis du satt i varetekt, sonet straff eller var under forvaring i sykmeldingsperioden.</li><li>Fristen for å søke sykepenger er som hovedregel 3 måneder</li></ul><p>Du kan lese mer om rettigheter og plikter på <a href="https://www.nav.no/sykepenger" target="_blank">nav.no/sykepenger</a>.</p>',
                svartype: SoknadSporsmalSvartypeEnum.IkkeRelevant,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: null,
                svar: [],
                undersporsmal: [],
            },
            {
                id: '75',
                tag: SporsmalTagEnum.BekreftOpplysninger,
                sporsmalstekst:
                    'Jeg har lest all informasjonen jeg har fått i søknaden og bekrefter at opplysningene jeg har gitt er korrekte.',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.CheckboxPanel,
                min: null,
                max: null,
                kriterieForVisningAvUndersporsmal: null,
                svar: [{ verdi: PossibleSvarEnum.CHECKED }],
                undersporsmal: [],
            },
            {
                id: '80',
                tag: SporsmalTagEnum.Kvitteringer,
                min: null,
                max: null,
                sporsmalstekst: 'Kvitteringer for reiseutgifter til jobben fra 1. - 24. april 2020.',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.Kvittering,
                kriterieForVisningAvUndersporsmal: null,
                svar: [
                    {
                        verdi: '{"blobId": "9a186e3c-aeeb-4566-a865-15aa9139d364","belop": 133700,"typeUtgift": "TAXI", "opprettet": ""}',
                    },
                    {
                        verdi: '{"blobId": "8653266-aeeb-4566-a865-15aa9139d364","belop": 43200,"typeUtgift": "PARKERING", "opprettet": ""}',
                    },
                    {
                        verdi: '{"blobId": "65326165-aeeb-4566-a865-15aa9139d364","belop": 64200,"typeUtgift": "OFFENTLIG_TRANSPORT", "opprettet": ""}',
                    },
                ],
                undersporsmal: [],
            },
            {
                id: '81',
                tag: SporsmalTagEnum.Kvitteringer,
                min: null,
                max: null,
                sporsmalstekst: 'Beløp',
                undertekst: null,
                svartype: SoknadSporsmalSvartypeEnum.Belop,
                kriterieForVisningAvUndersporsmal: null,
                svar: [{ verdi: '23500' }],
                undersporsmal: [],
            },
        ],
    }
}
