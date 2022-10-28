import { Grid, Heading } from '@navikt/ds-react'
import { useSelector } from 'react-redux'
import cn from 'classnames'

import { RootState } from '../../../state/store'
import { PreviewSykmeldtFragment } from '../../../graphql/queries/graphql.generated'
import useSortedSykmeldteNotifying from '../useSortedSykmeldteNotifying'

import Sykmeldte from './Sykmeldte'
import SortBy from './SortBy'
import styles from './SykmeldteNotifying.module.css'

interface Props {
    sykmeldte: PreviewSykmeldtFragment[]
    focusSykmeldtId: string
    nonNotifyingCount: number
}

function SykmeldteNotifying({ sykmeldte, focusSykmeldtId, nonNotifyingCount }: Props): JSX.Element {
    const sortByNotifying = useSelector((state: RootState) => state.sortByNotifying)
    const { sortedSykmeldte, notifyingDatesAndText } = useSortedSykmeldteNotifying(sykmeldte)
    const showDateHeading = sortByNotifying.sortBy === 'latest'

    return (
        <>
            <SortBy />
            {sykmeldte.length > 0 && (
                <section
                    aria-labelledby="sykmeldte-nye-varsler-liste"
                    className={cn({
                        [styles.notifyingSectionHasFollwingSection]: nonNotifyingCount > 0,
                    })}
                >
                    <Heading id="sykmeldte-nye-varsler-liste" size="small" level="2" spacing>
                        Varslinger
                    </Heading>
                    <Grid>
                        {sortedSykmeldte.length > 0 && (
                            <Sykmeldte
                                sykmeldte={sortedSykmeldte}
                                focusSykmeldtId={focusSykmeldtId}
                                notification
                                showDateHeading={showDateHeading}
                                notifyingDatesAndText={notifyingDatesAndText}
                            />
                        )}
                    </Grid>
                </section>
            )}
        </>
    )
}

export default SykmeldteNotifying
