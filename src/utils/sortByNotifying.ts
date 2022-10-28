import { compareDesc, isAfter } from 'date-fns'

import {
    SykmeldingFragment,
    PreviewSykmeldtFragment,
    PreviewSoknadFragment,
    Dialogmote,
    Aktivitetsvarsel,
    Oppfolgingsplan,
} from '../graphql/queries/graphql.generated'

import { toDate } from './dateUtils'

interface DateAndText {
    date: Date | string
    text: string
}
interface NotifyingDates {
    sykmeldt: PreviewSykmeldtFragment
    datesAndText: DateAndText[]
}

interface LatestNotifyingDate {
    sykmeldt: PreviewSykmeldtFragment
    latestDateAndText: DateAndText
}

export interface DateTitle {
    latestDateAndText: DateAndText
}

function toDateAndText(date: string, text: string): DateAndText {
    return {
        date: date,
        text: text,
    }
}

function findAllNotifyingDates(sykmeldte: PreviewSykmeldtFragment[]): NotifyingDates[] {
    const sykmeldteWithNotifyingDatesAndText = sykmeldte.map((sykmeldt) => {
        const sykmeldingDates = sykmeldt.sykmeldinger?.map((sykmelding: SykmeldingFragment): DateAndText => {
            if (!sykmelding.lest && sykmelding.sendtTilArbeidsgiverDato) {
                return toDateAndText(sykmelding.sendtTilArbeidsgiverDato, 'Ulest sykmelding')
            }
            return toDateAndText('', '')
        })
        const soknaderDates = sykmeldt.previewSoknader?.map((soknad: PreviewSoknadFragment): DateAndText => {
            if (
                soknad.__typename === 'PreviewNySoknad' &&
                soknad.ikkeSendtSoknadVarsel &&
                soknad.ikkeSendtSoknadVarsletDato
            ) {
                return toDateAndText(soknad.ikkeSendtSoknadVarsletDato, 'Mangler søknad')
            }
            if (soknad.__typename === 'PreviewSendtSoknad' && !soknad.lest && soknad.sendtDato) {
                return toDateAndText(soknad.sendtDato, 'Sendt søknad')
            }
            return toDateAndText('', '')
        })
        const aktivitetsvarslDates = sykmeldt.aktivitetsvarsler?.map(
            (aktivitetsvarsl: Aktivitetsvarsel): DateAndText => {
                return !aktivitetsvarsl.lest && aktivitetsvarsl.mottatt
                    ? toDateAndText(aktivitetsvarsl.mottatt, 'Påminnelse om aktivitet')
                    : toDateAndText('', '')
            },
        )
        const dialogmoteDates = sykmeldt.dialogmoter?.map((dialogmote: Dialogmote): DateAndText => {
            return dialogmote.mottatt
                ? toDateAndText(dialogmote.mottatt, dialogmote.tekst ?? 'Dialogmøte')
                : toDateAndText('', '')
        })
        const oppfolgingsplaneDates = sykmeldt.oppfolgingsplaner?.map(
            (oppfolgingsplan: Oppfolgingsplan): DateAndText => {
                return oppfolgingsplan.mottatt
                    ? toDateAndText(oppfolgingsplan.mottatt, oppfolgingsplan.tekst ?? 'Oppfølgingsplan')
                    : toDateAndText('', '')
            },
        )

        const dateList = sykmeldingDates
            .concat(soknaderDates, aktivitetsvarslDates, dialogmoteDates, oppfolgingsplaneDates)
            .filter((it) => it.date !== '')

        return {
            sykmeldt: sykmeldt,
            datesAndText: dateList,
        }
    })

    return sykmeldteWithNotifyingDatesAndText
}

function sykmeldtWithLatestDate(sykmeldteDatesAndText: NotifyingDates[]): LatestNotifyingDate[] {
    return sykmeldteDatesAndText.map((sykmeldt) => {
        const latestDateAndText = sykmeldt.datesAndText.reduce(
            (previousValue: DateAndText, currentValue: DateAndText) => {
                return isAfter(toDate(previousValue.date), toDate(currentValue.date)) ? previousValue : currentValue
            },
        )
        return {
            sykmeldt: sykmeldt.sykmeldt,
            latestDateAndText: latestDateAndText,
        }
    })
}

function sortSykmeldteByLatestDate(sykmeldteWithLatestDate: LatestNotifyingDate[]): PreviewSykmeldtFragment[] {
    return sykmeldteWithLatestDate
        .sort((a: LatestNotifyingDate, b: LatestNotifyingDate) => {
            return compareDesc(toDate(a.latestDateAndText.date), toDate(b.latestDateAndText.date))
        })
        .map((it) => it.sykmeldt)
}

export function sortedByNotifyingDates(sykmeldte: PreviewSykmeldtFragment[]): PreviewSykmeldtFragment[] {
    const notifyingDates = findAllNotifyingDates(sykmeldte)
    const latestDate = sykmeldtWithLatestDate(notifyingDates)
    return sortSykmeldteByLatestDate(latestDate)
}

export function getLatestDates(sykmeldte: PreviewSykmeldtFragment[]): DateTitle[] {
    const notifyingDates = findAllNotifyingDates(sykmeldte)
    return sykmeldtWithLatestDate(notifyingDates).map((it) => {
        return {
            latestDateAndText: it.latestDateAndText,
        }
    })
}
