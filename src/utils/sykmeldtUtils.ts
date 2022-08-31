import { compareDesc } from 'date-fns';

import { PreviewSykmeldtFragment } from '../graphql/queries/graphql.generated';

import { isPreviewSoknadNotification } from './soknadUtils';
import { toDate } from './dateUtils';
import { toLatestTom } from './sykmeldingPeriodUtils';

function appendPossesive(navn: string): string {
    return navn.endsWith('s') || navn.endsWith('x') ? `${navn}'` : `${navn}s`;
}

export function formatNamePossessive(navn: string | null | undefined, postfix: string): string {
    if (navn) {
        return `${appendPossesive(navn)} ${postfix}`;
    } else {
        return `Sykmeldtes ${postfix}`;
    }
}

export function formatFirstNamePossessive(name: string, postfix: string): string {
    return `${appendPossesive(name.split(' ')[0])} ${postfix}`;
}

export function formatNameSubjective(navn: string | null | undefined): string {
    if (navn) {
        return `${navn}`;
    } else {
        return `Den sykmeldte`;
    }
}

export function sortByDate(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    const latestA = a.sykmeldinger.flatMap((it) => it.perioder).reduce(toLatestTom);
    const latestB = b.sykmeldinger.flatMap((it) => it.perioder).reduce(toLatestTom);

    return compareDesc(toDate(latestA.tom), toDate(latestB.tom));
}

export function sortByName(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    return a.navn.localeCompare(b.navn);
}

export function sortByOrgName(a: PreviewSykmeldtFragment, b: PreviewSykmeldtFragment): number {
    return a.orgnavn.localeCompare(b.orgnavn);
}

export function notificationCount(sykmeldt: PreviewSykmeldtFragment): number {
    const sykmeldinger = sykmeldt.sykmeldinger.filter((it) => !it.lest).length;
    const soknader = sykmeldt.previewSoknader.filter((it) => isPreviewSoknadNotification(it)).length;
    const aktivitetsplaner = sykmeldt.aktivitetsvarsler.filter((it) => !it.lest).length;
    const dialogmoter = sykmeldt.dialogmoter.length;
    const oppfolgingsplaner = sykmeldt.oppfolgingsplaner.length;

    return sykmeldinger + soknader + dialogmoter + oppfolgingsplaner + aktivitetsplaner;
}
