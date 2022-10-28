import React, { Ref } from 'react'
import { Cell, Heading } from '@navikt/ds-react'

import { PreviewSykmeldtFragment } from '../../../graphql/queries/graphql.generated'
import ExpandableSykmeldtPanel from '../../shared/SykmeldtPanel/ExpandableSykmeldtPanel'
import { useExpanded, useExpandSykmeldte } from '../useExpandSykmeldte'
import { DateTitle } from '../../../utils/sortByNotifying'
import { formatDate } from '../../../utils/dateUtils'

interface Props {
    sykmeldte: PreviewSykmeldtFragment[]
    focusSykmeldtId: string | null
    notification?: boolean
    listLength?: number | undefined
    lastItemRef?: Ref<HTMLDivElement> | undefined
    showDateHeading: boolean
    notifyingDatesAndText: DateTitle[]
}

function Sykmeldte({
    sykmeldte,
    focusSykmeldtId,
    notification = false,
    listLength,
    lastItemRef,
    showDateHeading,
    notifyingDatesAndText,
}: Props): JSX.Element {
    const { expandedSykmeldte, expandedSykmeldtPerioder } = useExpanded()
    const handleSykmeldtClick = useExpandSykmeldte(focusSykmeldtId, expandedSykmeldte)

    return (
        <>
            {sykmeldte.map((it, index) => (
                <Cell
                    ref={listLength && index === listLength && listLength - 1 ? lastItemRef : undefined}
                    key={it.narmestelederId}
                    xs={12}
                >
                    {showDateHeading && (
                        <Heading size="xsmall" level="3" spacing>
                            {formatDate(notifyingDatesAndText[index].latestDateAndText.date)}
                        </Heading>
                    )}
                    <ExpandableSykmeldtPanel
                        sykmeldt={it}
                        notifyingText={notifyingDatesAndText[index].latestDateAndText.text}
                        notification={notification}
                        expanded={expandedSykmeldte.includes(it.narmestelederId)}
                        periodsExpanded={expandedSykmeldtPerioder.includes(it.narmestelederId)}
                        onClick={handleSykmeldtClick}
                        focusSykmeldtId={focusSykmeldtId}
                    />
                </Cell>
            ))}
        </>
    )
}

export default Sykmeldte
