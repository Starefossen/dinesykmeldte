import userEvent from '@testing-library/user-event'
import { waitForElementToBeRemoved, within } from '@testing-library/react'
import { Cache } from '@apollo/client'
import { MockedResponse } from '@apollo/client/testing'
import mockRouter from 'next-router-mock'

import { render, screen } from '../../utils/test/testUtils'
import {
    MineSykmeldteDocument,
    PreviewSykmeldtFragment,
    VirksomheterDocument,
} from '../../graphql/queries/graphql.generated'
import {
    createInitialQuery,
    createMock,
    createSykmelding,
    createPreviewSykmeldt,
    createVirksomhet,
} from '../../utils/test/dataCreators'

import SykmeldteList from './SykmeldteList'

describe('SykmeldteList', () => {
    beforeEach(() => {
        mockRouter.setCurrentUrl('/sykmeldt/null')
    })

    function setup(
        initialState: Cache.WriteQueryOptions<unknown, unknown>[] = [
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
        ],
        mocks: MockedResponse[] = [],
    ): void {
        render(
            <>
                <SykmeldteList />
            </>,
            {
                initialState,
                mocks,
            },
        )
    }

    it('should show loading spinner', async () => {
        const mockMineSykmeldte = createMock({
            request: { query: MineSykmeldteDocument },
            result: { data: { __typename: 'Query', mineSykmeldte: [] } },
        })

        setup(undefined, [mockMineSykmeldte])

        expect(screen.getByTitle('Laster dine ansatte')).toBeInTheDocument()
        await waitForElementToBeRemoved(() => screen.queryByTitle('Laster dine ansatte'))
    })

    it('should show error when unable to fetch', async () => {
        const mockMineSykmeldte = createMock({
            request: { query: MineSykmeldteDocument },
            error: new Error('Something went wrong'),
        })

        setup(undefined, [mockMineSykmeldte])

        expect(await screen.findByText('Klarte ikke å hente dine sykmeldte')).toBeInTheDocument()
    })

    it('should list sykmeldte on successful fetch', async () => {
        const mockMineSykmeldte = createMock({
            request: { query: MineSykmeldteDocument },
            result: {
                data: {
                    __typename: 'Query',
                    mineSykmeldte: [
                        createPreviewSykmeldt({ navn: 'Kari Normann', fnr: '1' }),
                        createPreviewSykmeldt({ navn: 'Ola Normann', fnr: '2' }),
                    ],
                },
            },
        })

        setup(undefined, [mockMineSykmeldte])

        expect(await screen.findByText('Kari Normann')).toBeInTheDocument()
        expect(await screen.findByText('Ola Normann')).toBeInTheDocument()
    })

    it('should expand and close the panel when clicked', async () => {
        setup([
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
            createInitialQuery(MineSykmeldteDocument, {
                __typename: 'Query',
                mineSykmeldte: [createPreviewSykmeldt()],
            }),
        ])

        await userEvent.click(screen.getByRole('button', { name: /Ola Normann/ }))

        expect(screen.getByRole('link', { name: /Sykmeldinger/ })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Søknader/ })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Dialogmøter/ })).toBeInTheDocument()

        await userEvent.click(screen.getByRole('button', { name: /Ola Normann/ }))

        expect(screen.queryByRole('link', { name: /Sykmeldinger/ })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Søknader/ })).not.toBeInTheDocument()
        expect(screen.queryByRole('link', { name: /Dialogmøter/ })).not.toBeInTheDocument()
    })

    it('should expand sykmelding periode summary and show content', async () => {
        setup([
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
            createInitialQuery(MineSykmeldteDocument, {
                __typename: 'Query',
                mineSykmeldte: [createPreviewSykmeldt()],
            }),
        ])

        await userEvent.click(screen.getByRole('button', { name: /Ola Normann/ }))
        await userEvent.click(screen.getByRole('button', { name: /Olas sykmeldingshistorikk/ }))

        const table = within(screen.getByRole('table'))
        const cells = table.getAllByRole('cell')

        expect(cells[0]).toHaveTextContent('8. - 15. august 2021')
        expect(cells[1]).toHaveTextContent('100%')
        expect(cells[2]).toHaveTextContent('Ferdig')
    })

    it('should filter by the active virksomhet', async () => {
        setup([
            createInitialQuery(VirksomheterDocument, {
                __typename: 'Query',
                virksomheter: [
                    createVirksomhet({ navn: 'Org 1', orgnummer: 'org-1' }),
                    createVirksomhet({ navn: 'Org 2', orgnummer: 'org-2' }),
                ],
            }),
            createInitialQuery(MineSykmeldteDocument, {
                __typename: 'Query',
                mineSykmeldte: [
                    createPreviewSykmeldt({ fnr: '1', navn: 'Mr. Show', orgnummer: 'org-1' }),
                    createPreviewSykmeldt({ fnr: '2', navn: 'Ms. Hide', orgnummer: 'org-2' }),
                ],
            }),
        ])

        await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Velg virksomhet' }), 'Org 1')

        expect(screen.getByRole('heading', { name: 'Mr. Show' })).toBeInTheDocument()
        expect(screen.queryByRole('heading', { name: 'Ms. Hide' })).not.toBeInTheDocument()
    })

    it('should group sykmeldte by notifying status', () => {
        const sykmeldte: PreviewSykmeldtFragment[] = [
            createPreviewSykmeldt({
                fnr: '1',
                navn: 'Mr. Notifying',
                sykmeldinger: [createSykmelding({ id: 'sykme-1', lest: false })],
            }),
            createPreviewSykmeldt({
                fnr: '2',
                navn: 'Ms. Read',
                sykmeldinger: [createSykmelding({ id: 'sykme-2', lest: true })],
            }),
        ]
        setup([
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
            createInitialQuery(MineSykmeldteDocument, { __typename: 'Query', mineSykmeldte: sykmeldte }),
        ])

        const notifyingSection = within(screen.getByRole('region', { name: 'Varslinger' }))
        expect(notifyingSection.getAllByRole('button')).toHaveLength(1)
        expect(notifyingSection.getByRole('button', { name: /Mr. Notifying/ })).toBeInTheDocument()

        const nonNotifyingSection = within(screen.getByRole('region', { name: 'Sykmeldte uten varsel' }))
        expect(nonNotifyingSection.getAllByRole('button')).toHaveLength(1)
        expect(nonNotifyingSection.getByRole('button', { name: /Ms. Read/ })).toBeInTheDocument()
    })

    it('should automatically expand focused sykmeldt based on URL', async () => {
        mockRouter.setCurrentUrl('/sykmeldt/focus-id')

        const sykmeldte: PreviewSykmeldtFragment[] = [
            createPreviewSykmeldt({
                fnr: '1',
                navn: 'Not focused',
                narmestelederId: '837b4594-1903-406b-9b10-96ff6673f021',
                sykmeldinger: [createSykmelding({ id: 'sykme-1', lest: true })],
            }),
            createPreviewSykmeldt({
                fnr: '2',
                navn: 'F. Ocused',
                narmestelederId: 'focus-id',
                sykmeldinger: [createSykmelding({ id: 'sykme-2', lest: true })],
            }),
        ]
        setup([
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
            createInitialQuery(MineSykmeldteDocument, { __typename: 'Query', mineSykmeldte: sykmeldte }),
        ])

        const nonNotifyingSection = within(screen.getByRole('region', { name: 'Sykmeldte uten varsel' }))
        expect(await nonNotifyingSection.findByRole('button', { name: /Sykmeldt Not focused/ })).toHaveAttribute(
            'aria-expanded',
            'false',
        )
        expect(await nonNotifyingSection.findByRole('button', { name: /Sykmeldt F. Ocused/ })).toHaveAttribute(
            'aria-expanded',
            'true',
        )
    })

    it('should automatically set URL to root when closing focused sykmeldt', async () => {
        mockRouter.setCurrentUrl('/sykmeldt/focus-id')

        const sykmeldte: PreviewSykmeldtFragment[] = [
            createPreviewSykmeldt({
                fnr: '1',
                navn: 'Not focused',
                narmestelederId: '837b4594-1903-406b-9b10-96ff6673f021',
                sykmeldinger: [createSykmelding({ id: 'sykme-1', lest: true })],
            }),
            createPreviewSykmeldt({
                fnr: '2',
                navn: 'F. Ocused',
                narmestelederId: 'focus-id',
                sykmeldinger: [createSykmelding({ id: 'sykme-2', lest: true })],
            }),
        ]
        setup([
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
            createInitialQuery(MineSykmeldteDocument, { __typename: 'Query', mineSykmeldte: sykmeldte }),
        ])

        const nonNotifyingSection = within(screen.getByRole('region', { name: 'Sykmeldte uten varsel' }))
        await userEvent.click(nonNotifyingSection.getByRole('button', { name: /Sykmeldt F. Ocused/ }))
        expect(await nonNotifyingSection.findByRole('button', { name: /Sykmeldt F. Ocused/ })).toHaveAttribute(
            'aria-expanded',
            'false',
        )
    })
})
