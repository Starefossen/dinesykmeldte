import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import { z } from 'zod';

import { cleanIda } from '../../../utils/stringUtils';
import { notNull } from '../../../utils/tsUtils';
import { formatDateRange } from '../../../utils/dateUtils';
import { DateSchema } from '../../../services/minesykmeldte/schema/common';

import { SporsmalVarianterProps } from './SporsmalVarianter';
import SporsmalListItem from './shared/SporsmalListItem';
import SporsmalList from './shared/SporsmalList';
import SporsmalListItemNested from './shared/SporsmalListItemNested';

const PeriodeSvarSchema = z.object({
    fom: DateSchema,
    tom: DateSchema,
});

function Periode({ sporsmal }: SporsmalVarianterProps): JSX.Element | null {
    if (!sporsmal.svar || sporsmal.svar.length === 0) return null;

    const listItemId = cleanIda(sporsmal.id);

    return (
        <SporsmalListItem listItemId={listItemId}>
            <Heading id={listItemId} size="small" level="3">
                {sporsmal.sporsmalstekst}
            </Heading>
            <SporsmalList>
                {sporsmal.svar.filter(notNull).map((svar) => {
                    const svarId = cleanIda(svar.verdi);
                    const dates = PeriodeSvarSchema.parse(JSON.parse(svar.verdi));
                    return (
                        <SporsmalListItemNested key={svarId}>
                            <BodyShort size="small">{formatDateRange(dates.fom, dates.tom)}</BodyShort>
                        </SporsmalListItemNested>
                    );
                })}
            </SporsmalList>
        </SporsmalListItem>
    );
}

export default Periode;
