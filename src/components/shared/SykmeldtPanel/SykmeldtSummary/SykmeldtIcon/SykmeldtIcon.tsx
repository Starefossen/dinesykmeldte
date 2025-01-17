import React from 'react'
import { Bandage, DialogReportFilled, Sandglass, SuccessStroke, Task } from '@navikt/ds-icons'
import cn from 'classnames'

import { PreviewSykmeldtFragment } from '../../../../../graphql/queries/graphql.generated'
import { getPeriodTime } from '../../../../../utils/sykmeldingPeriodUtils'
import { notificationCount } from '../../../../../utils/sykmeldtUtils'
import NotifcationDot from '../../../NotifcationDot/NotifcationDot'
import InfoIcon from '../../../icons/InfoIcon'

import styles from './SykmeldtIcon.module.css'

interface Props {
    sykmeldt: PreviewSykmeldtFragment
    notification: boolean
    notSentSoknad: boolean
}

function SykmeldtIcon({ sykmeldt, notification, notSentSoknad }: Props): JSX.Element {
    const iconVariant = getIconVariant(sykmeldt, notification, notSentSoknad)
    const notifications = notificationCount(sykmeldt)
    const tooltip = notifications > 1 ? `Du har ${notifications} uleste varsler` : `Du har 1 ulest varsel`

    return (
        <div
            className={cn(styles.listItemPeopleIconWrapper, {
                [styles.sykmeldt]: iconVariant === 'sykmeldt',
                [styles.notify]: iconVariant === 'notify',
                [styles.friskmeldt]: iconVariant === 'friskmeldt',
                [styles.future]: iconVariant === 'future',
                [styles.notSentSoknad]: iconVariant === 'notSentSoknad',
            })}
        >
            <SykmeldtCardIcon id={sykmeldt.narmestelederId} variant={iconVariant} />
            {notifications > 0 && <NotifcationDot notifications={notifications} tooltip={tooltip} absolute />}
        </div>
    )
}

type IconVariant = 'notify' | 'sykmeldt' | 'friskmeldt' | 'future' | 'notSentSoknad'

function getIconVariant(sykmeldt: PreviewSykmeldtFragment, notification: boolean, notSentSoknad: boolean): IconVariant {
    const time = getPeriodTime(sykmeldt.sykmeldinger)

    if (notification) {
        return 'notify'
    } else if (notSentSoknad) {
        return 'notSentSoknad'
    } else if (time === 'future') {
        return 'future'
    } else if (!sykmeldt.friskmeldt) {
        return 'sykmeldt'
    } else {
        return 'friskmeldt'
    }
}

function SykmeldtCardIcon({ id, variant }: { id: string; variant: IconVariant }): JSX.Element {
    switch (variant) {
        case 'notify':
            return (
                <DialogReportFilled
                    title="Sykmeldt med varsel"
                    titleId={`sykmeldt-${id}`}
                    fontSize="28px"
                    focusable={false}
                    color="var(--navds-color-red)"
                />
            )
        case 'sykmeldt':
            return <Bandage title="Sykmeldt" titleId={`sykmeldt-${id}`} fontSize="28px" focusable={false} />
        case 'friskmeldt':
            return <SuccessStroke title="Friskmeldt" titleId={`sykmeldt-${id}`} fontSize="28px" focusable={false} />
        case 'future':
            return <Sandglass title="Fremtidig sykmelding" titleId={`sykmeldt-${id}`} focusable={false} />
        case 'notSentSoknad':
            return <NotSentSoknadIcon id={id} />
    }
}

function NotSentSoknadIcon({ id }: { id: string }): JSX.Element {
    return (
        <div className={styles.notSentSoknadIcon}>
            <Task className={styles.taskIcon} title="Ikke sendt søknad" titleId={`sykmeldt-${id}`} focusable={false} />
            <InfoIcon className={styles.infoIcon} />
        </div>
    )
}

export default SykmeldtIcon
