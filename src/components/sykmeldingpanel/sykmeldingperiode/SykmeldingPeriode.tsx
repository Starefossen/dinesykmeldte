import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';

import { SykmeldingPeriodeFragment } from '../../../graphql/queries/graphql.generated';
import { formatDatePeriod } from '../../../utils/dateUtils';
import { getSykmeldingPeriodDescription } from '../../../utils/sykmeldingPeriodUtils';
import { cleanIda } from '../../../utils/stringUtils';

import styles from './SykmeldingPeriode.module.css';

interface Props {
    perioder: SykmeldingPeriodeFragment[];
}

function SykmeldingPeriode({ perioder }: Props): JSX.Element {
    const listItemId = cleanIda('Søknaden gjelder for perioden');

    return (
        <li className={styles.sykmeldingPeriode} aria-labelledby={listItemId}>
            <Heading id={listItemId} size="small" className={styles.heading} level="3">
                Perioden det gjelder (f.o.m. - t.o.m.)
            </Heading>
            {perioder.map((periode: SykmeldingPeriodeFragment, index: number) => {
                return (
                    <div key={index}>
                        {periode.fom && periode.tom && (
                            <BodyShort>{formatDatePeriod(periode.fom, periode.tom)}</BodyShort>
                        )}
                        <BodyShort>{getSykmeldingPeriodDescription(periode)}</BodyShort>
                    </div>
                );
            })}
        </li>
    );
}

export default SykmeldingPeriode;
