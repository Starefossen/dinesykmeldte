import { useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { batch, useDispatch } from 'react-redux'

import { MineSykmeldteDocument } from '../../graphql/queries/graphql.generated'
import { partition } from '../../utils/tsUtils'
import { notificationCount } from '../../utils/sykmeldtUtils'
import PageFallbackLoader from '../shared/pagefallbackloader/PageFallbackLoader'
import ErrorBoundary from '../shared/errors/ErrorBoundary'
import PageError from '../shared/errors/PageError'
import useParam, { RouteLocation } from '../../hooks/useParam'
import expandedSlice from '../../state/expandedSlice'
import filterSlice from '../../state/filterSlice'
import useFocusRefetch from '../../hooks/useFocusRefetch'
import { previewNySoknaderRead } from '../../utils/soknadUtils'
import VirksomhetPicker from '../virksomhetpicker/VirksomhetPicker'

import SykmeldteNonNotifying from './SykmeldteNonNotifying/SykmeldteNonNotifying'
import SykmeldteNotifying from './SykmeldteNotifying/SykmeldteNotifying'
import styles from './SykmeldteList.module.css'

function SykmeldteList(): JSX.Element {
    const { loading, data, error, refetch } = useQuery(MineSykmeldteDocument)
    const { sykmeldtId: focusSykmeldtId } = useParam(RouteLocation.Root)
    const dispatch = useDispatch()

    useFocusRefetch(refetch)

    useEffect(() => {
        if (!focusSykmeldtId) return

        batch(() => {
            dispatch(filterSlice.actions.setName(''))
            dispatch(filterSlice.actions.setShow('all'))
            dispatch(expandedSlice.actions.setExpandSykmeldt(focusSykmeldtId))
        })
    }, [dispatch, focusSykmeldtId])

    if (loading && !data) {
        return <PageFallbackLoader text="Laster dine ansatte" />
    }

    if (error) {
        return <PageError text="Klarte ikke å hente dine sykmeldte" />
    }

    const [notifyingAndNotSendtSoknader, nonNotifying] = partition(
        (it) =>
            notificationCount(it) > 0 ||
            (notificationCount(it) === 0 && previewNySoknaderRead(it.previewSoknader).length > 0),
        data?.mineSykmeldte ?? [],
    )

    return (
        <ErrorBoundary>
            <div className={styles.virksomhetsPicker}>
                <VirksomhetPicker />
            </div>
            <SykmeldteNotifying
                sykmeldte={notifyingAndNotSendtSoknader}
                focusSykmeldtId={focusSykmeldtId}
                nonNotifyingCount={nonNotifying.length}
            />
            <SykmeldteNonNotifying sykmeldte={nonNotifying} focusSykmeldtId={focusSykmeldtId} />
        </ErrorBoundary>
    )
}

export default SykmeldteList
