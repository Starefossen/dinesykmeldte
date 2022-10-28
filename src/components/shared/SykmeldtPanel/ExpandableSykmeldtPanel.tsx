import { Accordion, BodyShort } from '@navikt/ds-react'
import React, { useEffect, useRef } from 'react'
import cn from 'classnames'

import { PreviewSoknadFragment, PreviewSykmeldtFragment } from '../../../graphql/queries/graphql.generated'
import { previewNySoknaderRead } from '../../../utils/soknadUtils'

import ExpandableSykmeldtPeriodSummary from './ExpandableSykmeldtPeriodSummary/ExpandableSykmeldtPeriodSummary'
import SykmeldtSummary from './SykmeldtSummary/SykmeldtSummary'
import SykmeldtContent from './SykmeldtContent/SykmeldtContent'
import styles from './ExpandableSykmeldtPanel.module.css'
import SykmeldtInfo from './SykmeldtInfo/SykmeldtInfo'
import { ManglerSoknadInfo } from './ManglerSoknadInfo/ManglerSoknadInfo'

interface Props {
    sykmeldt: PreviewSykmeldtFragment
    expanded: boolean
    periodsExpanded: boolean
    onClick: (id: string, where: 'root' | 'periods') => void
    notification: boolean
    focusSykmeldtId: string | null
    notifyingText?: string
}

function ExpandableSykmeldtPanel({
    sykmeldt,
    expanded,
    periodsExpanded,
    onClick,
    notification,
    focusSykmeldtId,
    notifyingText,
}: Props): JSX.Element {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (focusSykmeldtId !== sykmeldt.narmestelederId) return

        ref.current?.focus()
        ref.current?.scrollIntoView({ behavior: 'smooth' })
    }, [focusSykmeldtId, sykmeldt.narmestelederId])

    const nySoknaderReadWithWarning: PreviewSoknadFragment[] = previewNySoknaderRead(sykmeldt.previewSoknader)
    const notSentSoknaderWarning = !notification && nySoknaderReadWithWarning.length > 0

    return (
        <Accordion>
            <Accordion.Item
                ref={ref}
                open={expanded}
                className={cn(styles.accordionRoot, {
                    [styles.accordionRootNotification]: notification,
                    [styles.accordionRootExpanded]: expanded,
                    [styles.accordionRootFocused]: sykmeldt.narmestelederId === focusSykmeldtId,
                    [styles.accordionRootNySoknadReadWarning]: notSentSoknaderWarning,
                })}
            >
                <Accordion.Header
                    id={`sykmeldt-accordion-header-${sykmeldt.narmestelederId}`}
                    className={styles.accordionHeader}
                    onClick={() => {
                        onClick(sykmeldt.narmestelederId, 'root')
                    }}
                >
                    <SykmeldtSummary
                        sykmeldt={sykmeldt}
                        notification={notification}
                        notSentSoknad={notSentSoknaderWarning}
                        notifyingText={notifyingText}
                    />
                </Accordion.Header>
                <Accordion.Content className={styles.accordionContent}>
                    {nySoknaderReadWithWarning.length > 0 && (
                        <ManglerSoknadInfo
                            name={sykmeldt.navn}
                            soknader={nySoknaderReadWithWarning}
                            sykmeldtId={sykmeldt.narmestelederId}
                        />
                    )}
                    <ExpandableSykmeldtPeriodSummary
                        onClick={onClick}
                        expanded={periodsExpanded}
                        previewSykmeldt={sykmeldt}
                    />
                    <SykmeldtInfo sykmeldt={sykmeldt} />
                    <BodyShort className={styles.info} spacing size="small">
                        Av personvernhensyn vises dokumentene inntil fire måneder etter at medarbeideren har blitt
                        frisk. Du finner alle sykmeldinger i Altinn.
                    </BodyShort>
                    <SykmeldtContent sykmeldt={sykmeldt} notification={notification} />
                </Accordion.Content>
            </Accordion.Item>
        </Accordion>
    )
}

export default ExpandableSykmeldtPanel
