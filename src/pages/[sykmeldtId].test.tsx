import preloadAll from 'jest-next-dynamic';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import mockRouter from 'next-router-mock';

import { render, screen } from '../utils/test/testUtils';
import {
    createAktivitetIkkeMuligPeriode,
    createGradertPeriode,
    createInitialQuery,
    createSykmelding,
    createPreviewSykmeldt,
    createVirksomhet,
} from '../utils/test/dataCreators';
import {
    MineSykmeldteDocument,
    PreviewSykmeldtFragment,
    VirksomheterDocument,
} from '../graphql/queries/graphql.generated';

import Index from './[sykmeldtId].page';

describe('Index page', () => {
    beforeEach(async () => {
        mockRouter.setCurrentUrl('/sykmeldt/null');
        return await preloadAll();
    });

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
        ];

        render(<Index />, { initialState });
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
            ]);

            await userEvent.selectOptions(screen.getAllByRole('combobox', { name: 'Velg virksomhet' })[0], 'Right org');

            expect(screen.queryByRole('combobox', { name: 'Vis' })).not.toBeInTheDocument();
            expect(screen.queryByRole('combobox', { name: 'Sorter etter' })).not.toBeInTheDocument();
        });

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
            ]);

            expect(screen.getByRole('textbox', { name: 'Søk på navn' })).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'Vis' })).toBeInTheDocument();
            expect(screen.getByRole('combobox', { name: 'Sorter etter' })).toBeInTheDocument();
        });
    });

    describe('when the filter changes', () => {
        describe('specifically names', () => {
            const sykmeldte = [
                createPreviewSykmeldt({ fnr: '1', navn: 'Marcelina Decker' }),
                createPreviewSykmeldt({ fnr: '2', navn: 'Daanyaal Butler' }),
                createPreviewSykmeldt({ fnr: '3', navn: 'Kaitlin Dotson' }),
                createPreviewSykmeldt({ fnr: '4', navn: 'Lacy Carty' }),
                createPreviewSykmeldt({ fnr: '5', navn: 'Kelly Iles' }),
            ];

            it('should filter by name', async () => {
                setup(sykmeldte);

                await userEvent.type(screen.getByRole('textbox', { name: 'Søk på navn' }), 'Kaitlin Dotson');

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Kaitlin Dotson']);
            });

            it('should also filter fuzzily', async () => {
                setup(sykmeldte);

                await userEvent.type(screen.getByRole('textbox', { name: 'Søk på navn' }), 'Facy Sharty');

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Lacy Carty']);
            });

            it('should prioritize sorting by fuzzy weight over date', async () => {
                setup([
                    createPreviewSykmeldt({
                        fnr: '6',
                        navn: 'Jarl Garbsson',
                        sykmeldinger: [
                            createSykmelding({
                                id: '3',
                                perioder: [createAktivitetIkkeMuligPeriode({ fom: '2021-02-01', tom: '2021-02-15' })],
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
                            }),
                        ],
                    }),
                    ...sykmeldte,
                ]);

                await userEvent.type(screen.getByRole('textbox', { name: 'Søk på navn' }), 'Karl');

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Karl Borgersson', 'Jarl Garbsson', 'Carl Fergusson']);
            });

            it('should sort by names when changing sort', async () => {
                setup(sykmeldte);

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter' }), ['Navn']);

                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Sorter etter' })).toHaveValue('name'));

                await waitFor(() =>
                    expect(
                        screen
                            .getAllByRole('heading')
                            .slice(2)
                            .map((it) => it.textContent),
                    ).toEqual(['Daanyaal Butler', 'Kaitlin Dotson', 'Kelly Iles', 'Lacy Carty', 'Marcelina Decker']),
                );
            });
        });

        it('should sort correctly on date on initial sort', () => {
            const earliestSykmeldt = createPreviewSykmeldt({
                navn: 'Middle',
                fnr: '1',
                sykmeldinger: [
                    createSykmelding({
                        id: 'de68eb8f-7484-4363-ad5d-2373e2e3b957',
                        perioder: [createAktivitetIkkeMuligPeriode({ fom: '2012-04-01', tom: '2012-05-01' })],
                    }),
                ],
            });
            const middleSykmeldt = createPreviewSykmeldt({
                navn: 'First',
                fnr: '2',
                sykmeldinger: [
                    createSykmelding({
                        id: '5bb36ee6-d068-4294-9612-03409ab6b961',
                        perioder: [createAktivitetIkkeMuligPeriode({ fom: '2012-01-01', tom: '2012-02-01' })],
                    }),
                ],
            });
            const lastSykmeldt = createPreviewSykmeldt({
                navn: 'Last',
                fnr: '3',
                sykmeldinger: [
                    createSykmelding({
                        id: 'e1715d94-ff12-44f7-b310-fa8e8814da21',
                        perioder: [createAktivitetIkkeMuligPeriode({ fom: '2012-06-01', tom: '2012-07-01' })],
                    }),
                ],
            });
            setup([earliestSykmeldt, middleSykmeldt, lastSykmeldt]);

            expect(
                screen
                    .getAllByRole('heading')
                    .slice(2)
                    .map((it) => it.textContent),
            ).toEqual(['Last', 'Middle', 'First']);
        });

        it('should sort by date when changing "Sorter Etter" to date', async () => {
            setup([
                createPreviewSykmeldt({
                    fnr: '1',
                    navn: 'Second',
                    sykmeldinger: [
                        createSykmelding({
                            id: '1',
                            perioder: [createAktivitetIkkeMuligPeriode({ tom: '2021-09-02' })],
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
                        }),
                    ],
                }),
            ]);

            await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter' }), ['Dato']);

            await waitFor(() => expect(screen.getByRole('combobox', { name: 'Sorter etter' })).toHaveValue('date'));

            await waitFor(() =>
                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Fifth', 'Fourth', 'Third', 'Second', 'First']),
            );
        });

        describe('spesifically "vis" filter', () => {
            const sykmeldte = [
                createPreviewSykmeldt({ fnr: '1', navn: 'Frisky A.', friskmeldt: true }),
                createPreviewSykmeldt({ fnr: '2', navn: 'Sicky A.', friskmeldt: false }),
                createPreviewSykmeldt({ fnr: '3', navn: 'Sicky B.', friskmeldt: false }),
                createPreviewSykmeldt({ fnr: '5', navn: 'Frisky B.', friskmeldt: true }),
                createPreviewSykmeldt({ fnr: '4', navn: 'Sicky C.', friskmeldt: false }),
            ];

            it('should filter by sykmeldt when changing "Vis" to sykmeldt', async () => {
                setup(sykmeldte);

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), ['Sykmeldte']);
                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte'));

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Sicky A.', 'Sicky B.', 'Sicky C.']);
            });

            it('should filter by friskmeldt when changing "Vis" to friskmeldt', async () => {
                setup(sykmeldte);

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), ['Tidligere sykmeldte']);

                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('friskmeldte'));

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Frisky A.', 'Frisky B.']);
            });

            it('should filter by graderte when changing "Vis" to Graderte', async () => {
                const sykmeldte = [
                    createPreviewSykmeldt({ fnr: '1', navn: 'Frisky A.' }),
                    createPreviewSykmeldt({
                        fnr: '2',
                        navn: 'Sicky A.',
                        sykmeldinger: [
                            createSykmelding({
                                id: 'sykmelding-1',
                                perioder: [createGradertPeriode({ grad: 20, fom: '2021-07-15', tom: '2021-07-28' })],
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
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({ fnr: '4', navn: 'Sicky C.' }),
                    createPreviewSykmeldt({ fnr: '5', navn: 'Frisky B.' }),
                ];

                setup(sykmeldte);

                await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), ['Graderte']);

                await waitFor(() => expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('graderte'));

                expect(
                    screen
                        .getAllByRole('heading')
                        .slice(2)
                        .map((it) => it.textContent),
                ).toEqual(['Sicky A.', 'Sicky B.']);
            });

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
                            }),
                        ],
                    }),
                    createPreviewSykmeldt({
                        fnr: '5',
                        navn: 'Frisky B.',
                        orgnummer: '964432212',
                        orgnavn: 'Virksomhet AS',
                        friskmeldt: true,
                    }),
                ];

                it('should filter sykmeldte and sort them by virksomhet then by date when changing "Vis" to Sykmeldte per virksomhet', async () => {
                    setup(sykmeldte);

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), [
                        'Sykmeldte per virksomhet',
                    ]);

                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte-per-virksomhet'),
                    );

                    expect(
                        screen
                            .getAllByRole('heading')
                            .slice(2)
                            .map((it) => it.textContent),
                    ).toEqual(['Bedrift AS', 'Sicky B.', 'Sicky C.', 'Frisky A.', 'Firma AS', 'Sicky A.']);
                });

                it('should only display orgnavn as heading once if there is more than one sykmeldt per org', async () => {
                    setup(sykmeldte);

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), [
                        'Sykmeldte per virksomhet',
                    ]);

                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte-per-virksomhet'),
                    );

                    expect(screen.getAllByRole('heading', { name: 'Bedrift AS' })).toHaveLength(1);
                    expect(screen.getAllByRole('heading', { name: 'Firma AS' })).toHaveLength(1);
                    expect(screen.queryByRole('heading', { name: 'Virksomhet AS' })).not.toBeInTheDocument();
                });

                it('should filter sykmeldte and sort them by virksomhet then by name when changing "Sorter etter" to Navn', async () => {
                    setup(sykmeldte);

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Vis' }), [
                        'Sykmeldte per virksomhet',
                    ]);
                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Vis' })).toHaveValue('sykmeldte-per-virksomhet'),
                    );

                    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Sorter etter' }), ['Navn']);
                    await waitFor(() =>
                        expect(screen.getByRole('combobox', { name: 'Sorter etter' })).toHaveValue('name'),
                    );

                    expect(
                        screen
                            .getAllByRole('heading')
                            .slice(2)
                            .map((it) => it.textContent),
                    ).toEqual(['Bedrift AS', 'Frisky A.', 'Sicky B.', 'Sicky C.', 'Firma AS', 'Sicky A.']);
                });
            });
        });
    });
});
