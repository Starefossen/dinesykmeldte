import { useRouter } from 'next/router';

export enum RouteLocation {
    Sykmeldt,
    Sykmelding,
    Soknad,
}

interface SykmeldtRoute {
    sykmeldtId: string;
    location: RouteLocation.Sykmeldt;
}

interface SykmeldingRoute {
    sykmeldtId: string;
    sykmeldingId: string;
    location: RouteLocation.Sykmelding;
}

interface SoknadRoute {
    sykmeldtId: string;
    soknadId: string;
    location: RouteLocation.Soknad;
}

function useParam(location: RouteLocation.Sykmeldt): SykmeldtRoute;
function useParam(location: RouteLocation.Sykmelding): SykmeldingRoute;
function useParam(location: RouteLocation.Soknad): SoknadRoute;
function useParam(location: RouteLocation = RouteLocation.Sykmeldt): SykmeldtRoute | SykmeldingRoute | SoknadRoute {
    const router = useRouter();

    const sykmeldtId = router.query.sykmeldtId;
    if (typeof sykmeldtId !== 'string') {
        throw new Error(
            'Unable to find sykmeldtId in URL. Are you sure you are using this hook under the correct page?',
        );
    }

    switch (location) {
        case RouteLocation.Sykmeldt:
            return { sykmeldtId, location: RouteLocation.Sykmeldt };
        case RouteLocation.Sykmelding:
            const sykmeldingId = router.query.sykmeldingId;
            if (typeof sykmeldingId !== 'string') {
                throw new Error(
                    'Unable to find sykmeldingId in URL. Are you sure you are using this hook under the correct page?',
                );
            }
            return { sykmeldingId, sykmeldtId, location: RouteLocation.Sykmelding };
        case RouteLocation.Soknad:
            const soknadId = router.query.soknadId;
            if (typeof soknadId !== 'string') {
                throw new Error(
                    'Unable to find soknadId in URL. Are you sure you are using this hook under the correct page?',
                );
            }
            return { soknadId, sykmeldtId, location: RouteLocation.Soknad };
    }
}

export default useParam;