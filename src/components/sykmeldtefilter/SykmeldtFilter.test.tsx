import userEvent from '@testing-library/user-event'
import { useSelector } from 'react-redux'

import { render, screen } from '../../utils/test/testUtils'
import { createInitialQuery, createPreviewSykmeldt, createVirksomhet } from '../../utils/test/dataCreators'
import {
    MineSykmeldteDocument,
    PreviewSykmeldtFragment,
    VirksomheterDocument,
} from '../../graphql/queries/graphql.generated'
import { RootState } from '../../state/store'

import SykmeldteFilter from './SykmeldteFilter'

const AssertableFilterValues = (): JSX.Element => {
    const filter = useSelector((state: RootState) => state.filter)
    return (
        <>
            <div data-testid="name-output">{filter.name}</div>
            <div data-testid="show-output">{filter.show}</div>
            <div data-testid="sortBy-output">{filter.sortBy}</div>
        </>
    )
}

describe('SykmeldtFilter', () => {
    function setup(sykmeldte: PreviewSykmeldtFragment[]): void {
        const initialState = [
            createInitialQuery(MineSykmeldteDocument, { __typename: 'Query', mineSykmeldte: sykmeldte }),
            createInitialQuery(VirksomheterDocument, { __typename: 'Query', virksomheter: [createVirksomhet()] }),
        ]

        render(
            <>
                <AssertableFilterValues />
                <SykmeldteFilter />
            </>,
            { initialState },
        )
    }

    it('should update context with new values', async () => {
        setup([
            createPreviewSykmeldt({ fnr: '1', orgnummer: '123456789' }),
            createPreviewSykmeldt({ fnr: '2', orgnummer: '123456789' }),
            createPreviewSykmeldt({ fnr: '3', orgnummer: '123456789' }),
            createPreviewSykmeldt({ fnr: '4', orgnummer: '123456789' }),
            createPreviewSykmeldt({ fnr: '5', orgnummer: '123456789' }),
        ])

        const name = screen.getByRole('textbox', { name: 'Søk på navn' })
        const display = screen.getByRole('combobox', { name: 'Vis' })
        const sortBy = screen.getByRole('combobox', { name: 'Sorter etter sykmeldte uten varsel' })

        await userEvent.type(name, 'Hello Filter')
        await userEvent.selectOptions(display, ['Sykmeldte'])
        await userEvent.selectOptions(sortBy, ['Navn'])

        expect(name).toHaveValue('Hello Filter')
        expect(display).toHaveValue('sykmeldte')
        expect(sortBy).toHaveValue('name')
    })
})
