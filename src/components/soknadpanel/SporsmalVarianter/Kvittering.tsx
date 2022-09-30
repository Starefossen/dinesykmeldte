import React from 'react';
import { Heading } from '@navikt/ds-react';
import { z } from 'zod';

import { cleanIda } from '../../../utils/stringUtils';
import { notNull } from '../../../utils/tsUtils';
import CheckboxExplanation from '../../shared/checkboxexplanation/CheckboxExplanation';
import { SoknadSporsmalSvarFragment } from '../../../graphql/queries/graphql.generated';

import { SporsmalVarianterProps } from './SporsmalVarianter';
import SporsmalListItem from './shared/SporsmalListItem';

enum UtgiftTyper {
    OFFENTLIG_TRANSPORT = 'OFFENTLIG_TRANSPORT',
    TAXI = 'TAXI',
    PARKERING = 'PARKERING',
    ANNET = 'ANNET',
}

const KvitteringSvarSchema = z.object({
    blobId: z.string(),
    belop: z.number(),
    typeUtgift: z.nativeEnum(UtgiftTyper),
    opprettet: z.string().nullable(),
});

function getSvarText(svarList: SoknadSporsmalSvarFragment[]): string {
    const antall = svarList.length;

    const svar = svarList.filter(notNull).map((svar) => {
        return KvitteringSvarSchema.parse(JSON.parse(svar.verdi));
    });
    const kr = svar.reduce((prev, cur) => prev + cur.belop, 0);
    const sum = kr / 100;

    if (svarList.length === 1) {
        return `Du lastet opp 1 utgift på ${sum} kr`;
    }
    return `Du lastet opp ${antall} utgifter på til sammen ${sum} kr`;
}

function Kvittering({ sporsmal }: SporsmalVarianterProps): JSX.Element | null {
    if (!sporsmal.svar || sporsmal.svar.length === 0) return null;

    const listItemId = cleanIda(sporsmal.id);
    const svarList = sporsmal.svar as SoknadSporsmalSvarFragment[];

    return (
        <SporsmalListItem listItemId={listItemId}>
            <Heading id={listItemId} size="small" level="3">
                {sporsmal.sporsmalstekst}
            </Heading>
            <div>
                <CheckboxExplanation text={getSvarText(svarList)} />
            </div>
        </SporsmalListItem>
    );
}

export default Kvittering;
