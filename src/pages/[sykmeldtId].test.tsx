import preloadAll from 'jest-next-dynamic'
import userEvent from '@testing-library/user-event'
import { waitFor, within } from '@testing-library/react'
import mockRouter from 'next-router-mock'

import { render, screen } from '../utils/test/testUtils'
import {
    createAktivitetIkkeMuligPeriode,
    createBeskjeder,
    createDialogmote,
    createGradertPeriode,
    createInitialQuery,
    createOppfolgingsplan,
    createSykmelding,
    createPreviewNySoknad,
    createPreviewSendtSoknad,
    createPreviewSykmeldt,
    createVirksomhet,
} from '../utils/test/dataCreators'
import {
    MineSykmeldteDocument,
    PreviewSykmeldtFragment,
    VirksomheterDocument,
} from '../graphql/queries/graphql.generated'

import Index from './[sykmeldtId].page'

describe('Index page', () => {
    beforeEach(async () => {
        mockRouter.setCurrentUrl('/sykmeldt/null')
        return await preloadAll()
    })

    function setup(sykmeldte: PreviewSykmeldtFragment[]): void {
        const initialState = [
            createInitialQuery(MineSykmeldteDocument, { __typename: 'Query', mineSykmeldte: sykmeldte }),
            createInitialQuery(VirksomheterDocument, {
                __typename: 'Query',
                virksomheter: [
                    createVirksomhet({
                        navn: 'Right org',
                        orgnummer: '123456789',
                    }),
                    createVirksomhet({
                        navn: 'Wrong org',
                        orgnummer: 'wrong-org',
                    }),
                ],
            }),
        ]

        render(<Index />, { initialState })
    }

    describe('given more or less than 5 people in org', () => {
        it('should not display filter when there is less than 5 sykmeldte in an org', async () => {
            setup([
                // In org
                createPreviewSykmeldt({ fnr: '1', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '2', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '3', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '4', orgnummer: '123456789' }),
                // Not in org
                createPreviewSykmeldt({ fnr: '5', orgnummer: 'wrong-org' }),
                createPreviewSykmeldt({ fnr: '6', orgnummer: 'wrong-org' }),
            ])

            await userEvent.selectOptions(screen.getAllByRole('combobox', { name: 'Velg virksomhet' })[0], 'Right org')

            expect(screen.queryByRole('combobox', { name: 'Vis' })).not.toBeInTheDocument()
            expect(
                screen.queryByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' }),
            ).not.toBeInTheDocument()
        })

        it('should display filters when there are 5 or more in an org', async () => {
            setup([
                // In org
                createPreviewSykmeldt({ fnr: '1', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '2', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '3', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '4', orgnummer: '123456789' }),
                createPreviewSykmeldt({ fnr: '5', orgnummer: '123456789' }),
                // Not in org
                createPreviewSykmeldt({ fnr: '6', orgnummer: 'wrong-org' }),
            ])

            expect(screen.getByRole('textbox', { name: 'Søk på navn' })).toBeInTheDocument()
            expect(screen.getByRole('combobox', { name: 'Vis' })).toBeInTheDocument()
            expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' })).toBeInTheDocument()
        })
    })

    describe('when the filter changes for sykmeldte without notifications', () => {
        describe('specifically names', () => {
            const sykmeldte = [
                createPreviewSykmeldt({
                    fnr: '1',
                    navn: 'Marcelina Decker',
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '2',
                    navn: 'Daanyaal Butler',
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '3',
                    navn: 'Kaitlin Dotson',
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '4',
                    navn: 'Lacy Carty',
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '5',
                    navn: 'Kelly Iles',
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
            ]

            it('should filter by name', async () => {
                setup(sykmeldte)

                await userEvent.type(screen.getByRole('textbox', { name: 'Søk på navn' }), 'Kaitlin Dotson')

                const nonNotifyingSection = screen.getByRole('region', { name: 'Sykmeldte uten varsel' })
                expect(nonNotifyingSection).toBeInTheDocument()

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Kaitlin Dotson'])
            })

            it('should also filter fuzzily', async () => {
                setup(sykmeldte)

                await userEvent.type(screen.getByRole('textbox', { name: 'Søk på navn' }), 'Facy Sharty')

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Lacy Carty'])
            })

            it('should prioritize sorting by fuzzy weight over date', async () => {
                setup([
                    createPreviewSykmeldt({
                        fnr: '6',
                        navn: 'Jarl Garbsson',
                        sykmeldinger: [
                            createSykmelding({
                                id: '3',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2021-02-01', tom: '2021-02-15' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '7',
                        navn: 'Carl Fergusson',
                        sykmeldinger: [
                            createSykmelding({
                                id: '2',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2021-03-01', tom: '2021-04-01' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '8',
                        navn: 'Karl Borgersson',
                        sykmeldinger: [
                            createSykmelding({
                                id: '1',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2020-01-01', tom: '2020-01-15' })],
                                lest: true,
                            }),
                        ],
                    }),
                    ...sykmeldte,
                ])

                await userEvent.type(screen.getByRole('textbox', { name: 'Søk på navn' }), 'Karl')

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Karl Borgersson', 'Jarl Garbsson', 'Carl Fergusson'])
            })

            it('should sort by names when changing sort', async () => {
                setup(sykmeldte)

                await userEvent.selectOptions(
                    screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' }),
                    ['Navn'],
                )

                await waitFor(() =>
                    expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' })).toHaveValue(
                        'name',
                    ),
                )

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Daanyaal Butler', 'Kaitlin Dotson', 'Kelly Iles', 'Lacy Carty', 'Marcelina Decker'])
            })
        })

        it('should sort correctly on date on initial sort', () => {
            const earliestSykmeldt = createPreviewSykmeldt({
                navn: 'Middle',
                fnr: '1',
                sykmeldinger: [
                    createSykmelding({
                        id: 'de68eb8f-7484-4363-ad5d-2373e2e3b957',
                        perioder: [createAktivitetIkkeMuligPeriode({ fom: '2012-04-01', tom: '2012-05-01' })],
                        lest: true,
                    }),
                ],
            })
            const middleSykmeldt = createPreviewSykmeldt({
                navn: 'First',
                fnr: '2',
                sykmeldinger: [
                    createSykmelding({
                        id: '5bb36ee6-d068-4294-9612-03409ab6b961',
                        perioder: [createAktivitetIkkeMuligPeriode({ fom: '2012-01-01', tom: '2012-02-01' })],
                        lest: true,
                    }),
                ],
            })
            const lastSykmeldt = createPreviewSykmeldt({
                navn: 'Last',
                fnr: '3',
                sykmeldinger: [
                    createSykmelding({
                        id: 'e1715d94-ff12-44f7-b310-fa8e8814da21',
                        perioder: [createAktivitetIkkeMuligPeriode({ fom: '2012-06-01', tom: '2012-07-01' })],
                        lest: true,
                    }),
                ],
            })
            setup([earliestSykmeldt, middleSykmeldt, lastSykmeldt])

            expect(
                screen
                    .getAllByRole('heading')
                    .slice(1)
                    .map((it) => it.textContent),
            ).toEqual(['Last', 'Middle', 'First'])
        })

        it('should sort by date when changing "Sorter Etter" to date', async () => {
            setup([
                createPreviewSykmeldt({
                    fnr: '1',
                    navn: 'Second',
                    sykmeldinger: [
                        createSykmelding({
                            id: '1',
                            perioder: [createAktivitetIkkeMuligPeriode({ tom: '2021-09-02' })],
                            lest: true,
                        }),
                    ],
                }),
                createPreviewSykmeldt({
                    fnr: '2',
                    navn: 'Third',
                    sykmeldinger: [
                        createSykmelding({
                            id: '2',
                            perioder: [createAktivitetIkkeMuligPeriode({ tom: '2021-09-03' })],
                            lest: true,
                        }),
                    ],
                }),
                createPreviewSykmeldt({
                    fnr: '3',
                    navn: 'First',
                    sykmeldinger: [
                        createSykmelding({
                            id: '3',
                            perioder: [createAktivitetIkkeMuligPeriode({ tom: '2021-09-01' })],
                            lest: true,
                        }),
                    ],
                }),
                createPreviewSykmeldt({
                    fnr: '5',
                    navn: 'Fifth',
                    sykmeldinger: [
                        createSykmelding({
                            id: '4',
                            perioder: [createAktivitetIkkeMuligPeriode({ tom: '2021-09-05' })],
                            lest: true,
                        }),
                    ],
                }),
                createPreviewSykmeldt({
                    fnr: '4',
                    navn: 'Fourth',
                    sykmeldinger: [
                        createSykmelding({
                            id: '5',
                            perioder: [createAktivitetIkkeMuligPeriode({ tom: '2021-09-04' })],
                            lest: true,
                        }),
                    ],
                }),
            ])

            await userEvent.selectOptions(
                screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' }),
                ['Dato'],
            )

            await waitFor(() =>
                expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' })).toHaveValue(
                    'date',
                ),
            )

            expect(
                screen
                    .getAllByRole('heading')
                    .slice(1)
                    .map((it) => it.textContent),
            ).toEqual(['Fifth', 'Fourth', 'Third', 'Second', 'First'])
        })

        describe('spesifically "vis" filter, for sykmeldte without notifications', () => {
            const sykmeldte = [
                createPreviewSykmeldt({
                    fnr: '1',
                    navn: 'Frisky A.',
                    friskmeldt: true,
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '2',
                    navn: 'Sicky A.',
                    friskmeldt: false,
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '3',
                    navn: 'Sicky B.',
                    friskmeldt: false,
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '5',
                    navn: 'Frisky B.',
                    friskmeldt: true,
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
                createPreviewSykmeldt({
                    fnr: '4',
                    navn: 'Sicky C.',
                    friskmeldt: false,
                    sykmeldinger: [createSykmelding({ lest: true })],
                }),
            ]

            it('should filter by sykmeldt when changing "Vis" to sykmeldt', async () => {
                setup(sykmeldte)

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), ['Sykmeldte'])
                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte'))

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Sicky A.', 'Sicky B.', 'Sicky C.'])
            })

            it('should filter by friskmeldt when changing "Vis" to friskmeldt', async () => {
                setup(sykmeldte)

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), ['Tidligere sykmeldte'])

                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('friskmeldte'))

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Frisky A.', 'Frisky B.'])
            })

            it('should filter by graderte when changing "Vis" to Graderte', async () => {
                const sykmeldte = [
                    createPreviewSykmeldt({
                        fnr: '1',
                        navn: 'Frisky A.',
                        sykmeldinger: [createSykmelding({ lest: true })],
                    }),
                    createPreviewSykmeldt({
                        fnr: '2',
                        navn: 'Sicky A.',
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-1',
                                perioder: [createGradertPeriode({ grad: 20, fom: '2021-07-15', tom: '2021-07-28' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '3',
                        navn: 'Sicky B.',
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-1',
                                perioder: [createGradertPeriode({ grad: 50, fom: '2022-04-01', tom: '2022-05-15' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '4',
                        navn: 'Sicky C.',
                        sykmeldinger: [createSykmelding({ lest: true })],
                    }),
                    createPreviewSykmeldt({
                        fnr: '5',
                        navn: 'Frisky B.',
                        sykmeldinger: [createSykmelding({ lest: true })],
                    }),
                ]

                setup(sykmeldte)

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), ['Graderte'])

                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('graderte'))

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(1)
                        .map((it) => it.textContent),
                ).toEqual(['Sicky A.', 'Sicky B.'])
            })

            describe('filter sykmeldte-per-virksomhet', () => {
                const sykmeldte = [
                    createPreviewSykmeldt({
                        fnr: '1',
                        navn: 'Frisky A.',
                        orgnummer: '123456789',
                        orgnavn: 'Bedrift AS',
                        friskmeldt: false,
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-1',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2021-06-14', tom: '2021-07-12' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '2',
                        navn: 'Sicky A.',
                        orgnummer: '432532223',
                        orgnavn: 'Firma AS',
                        friskmeldt: false,
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-2',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2022-04-01', tom: '2022-04-13' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '4',
                        navn: 'Sicky C.',
                        orgnummer: '123456789',
                        orgnavn: 'Bedrift AS',
                        friskmeldt: false,
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-4',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2022-06-11', tom: '2022-06-20' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '3',
                        navn: 'Sicky B.',
                        orgnummer: '123456789',
                        orgnavn: 'Bedrift AS',
                        friskmeldt: false,
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-3',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2022-08-10', tom: '2022-08-20' })],
                                lest: true,
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '5',
                        navn: 'Frisky B.',
                        orgnummer: '964432212',
                        orgnavn: 'Virksomhet AS',
                        friskmeldt: true,
                        sykmeldinger: [createSykmelding({ lest: true })],
                    }),
                ]

                it('should filter sykmeldte and sort them by virksomhet then by date when changing "Vis" to Sykmeldte per virksomhet', async () => {
                    setup(sykmeldte)

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), [
                        'Sykmeldte per virksomhet',
                    ])

                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte-per-virksomhet'),
                    )

                    expect(
                        screen
                            .getAllByRole('heading')
                            .slice(1)
                            .map((it) => it.textContent),
                    ).toEqual(['Bedrift AS', 'Sicky B.', 'Sicky C.', 'Frisky A.', 'Firma AS', 'Sicky A.'])
                })

                it('should only display orgnavn as heading once if there is more than one sykmeldt per org', async () => {
                    setup(sykmeldte)

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), [
                        'Sykmeldte per virksomhet',
                    ])

                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte-per-virksomhet'),
                    )

                    expect(screen.getAllByRole('heading', { name: 'Bedrift AS' })).toHaveLength(1)
                    expect(screen.getAllByRole('heading', { name: 'Firma AS' })).toHaveLength(1)
                    expect(screen.queryByRole('heading', { name: 'Virksomhet AS' })).not.toBeInTheDocument()
                })

                it('should filter sykmeldte and sort them by virksomhet then by name when changing "Sorter etter" to Navn', async () => {
                    setup(sykmeldte)

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), [
                        'Sykmeldte per virksomhet',
                    ])
                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte-per-virksomhet'),
                    )

                    await userEvent.selectOptions(
                        screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' }),
                        ['Navn'],
                    )
                    await waitFor(() =>
                        expect(
                            screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' }),
                        ).toHaveValue('name'),
                    )

                    expect(
                        screen
                            .getAllByRole('heading')
                            .slice(1)
                            .map((it) => it.textContent),
                    ).toEqual(['Bedrift AS', 'Frisky A.', 'Sicky B.', 'Sicky C.', 'Firma AS', 'Sicky A.'])
                })
            })
        })
    })

    describe('sort by names for sykmeldte with notifications', () => {
        const sykmeldte = [
            createPreviewSykmeldt({
                fnr: '1',
                navn: 'First Name',
            }),
            createPreviewSykmeldt({
                fnr: '2',
                navn: 'Fifth Name',
            }),
            createPreviewSykmeldt({
                fnr: '3',
                navn: 'Second Name',
            }),
            createPreviewSykmeldt({
                fnr: '4',
                navn: 'Fourth Name',
            }),
            createPreviewSykmeldt({
                fnr: '5',
                navn: 'Third Name',
            }),
        ]

        it('should sort by names when changing to Navn', async () => {
            setup(sykmeldte)

            await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' }), [
                'Navn',
            ])

            await waitFor(() =>
                expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' })).toHaveValue('name'),
            )

            expect(
                screen
                    .getAllByRole('heading')
                    .slice(2)
                    .map((it) => it.textContent),
            ).toEqual(['Fifth Name', 'First Name', 'Fourth Name', 'Second Name', 'Third Name'])
        })

        it('should show nofifiation text in front', async () => {
            setup(sykmeldte)

            await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' }), [
                'Navn',
            ])

            await waitFor(() =>
                expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' })).toHaveValue('name'),
            )

            const notifyingSection = within(screen.getByRole('region', { name: 'Varslinger' }))
            expect(await notifyingSection.findAllByText('Ulest sykmelding')).toHaveLength(5)
        })
    })

    describe('sort by latest date for sykmeldte with notifications', () => {
        const sykmeldte = [
            createPreviewSykmeldt({
                fnr: '1',
                navn: 'Gul Gulrot',
                sykmeldinger: [
                    createSykmelding({
                        id: '1',
                        lest: false,
                        sendtTilArbeidsgiverDato: '2021-06-01',
                    }),
                ],
                previewSoknader: [
                    createPreviewNySoknad({
                        id: '2',
                        ikkeSendtSoknadVarsel: true,
                        ikkeSendtSoknadVarsletDato: '2021-02-05',
                    }),
                ],
            }),
            createPreviewSykmeldt({
                fnr: '2',
                navn: 'Stor Kopp',
                previewSoknader: [
                    createPreviewSendtSoknad({
                        id: '1',
                        lest: false,
                        sendtDato: '2022-07-02',
                    }),
                ],
            }),
            createPreviewSykmeldt({
                fnr: '3',
                navn: 'Liten Kake',
                aktivitetsvarsler: [
                    createBeskjeder({
                        hendelseId: '4',
                        lest: null,
                        mottatt: '2022-09-12',
                    }),
                ],
                oppfolgingsplaner: [
                    createOppfolgingsplan({
                        hendelseId: '6',
                        mottatt: '2022-11-11',
                        tekst: 'Oppfølgingsplan venter',
                    }),
                ],
            }),
            createPreviewSykmeldt({
                fnr: '5',
                navn: 'Snerten Kake',
                dialogmoter: [
                    createDialogmote({
                        hendelseId: '5',
                        mottatt: '2022-04-01',
                        tekst: 'Innkalling til dialogmøte',
                    }),
                ],
            }),
        ]

        it('should sort by and show latest date when changing to Nyeste', async () => {
            setup(sykmeldte)

            await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' }), [
                'Nyeste',
            ])

            await waitFor(() =>
                expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' })).toHaveValue(
                    'latest',
                ),
            )

            expect(
                screen
                    .getAllByRole('heading')
                    .slice(2)
                    .map((it) => it.textContent),
            ).toEqual([
                '11. november 2022',
                'Liten Kake',
                '2. juli 2022',
                'Stor Kopp',
                '1. april 2022',
                'Snerten Kake',
                '1. juni 2021',
                'Gul Gulrot',
            ])
        })

        it('should show nofifiation text in front', async () => {
            setup(sykmeldte)
            await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' }), [
                'Nyeste',
            ])

            await waitFor(() =>
                expect(screen.getByRole('combobox', { name: 'Sorter etter sykmeldte med varsel' })).toHaveValue(
                    'latest',
                ),
            )

            const notifyingSection = within(screen.getByRole('region', { name: 'Varslinger' }))
            expect(await notifyingSection.findByRole('button', { name: /Liten Kake/ })).toHaveTextContent(
                'Oppfølgingsplan venter',
            )
            expect(await notifyingSection.findByRole('button', { name: /Stor Kopp/ })).toHaveTextContent('Sendt søknad')
            expect(await notifyingSection.findByRole('button', { name: /Snerten Kake/ })).toHaveTextContent(
                'Innkalling til dialogmøte',
            )
            expect(await notifyingSection.findByRole('button', { name: /Gul Gulrot/ })).toHaveTextContent(
                'Ulest sykmelding',
            )
        })
    })
})
