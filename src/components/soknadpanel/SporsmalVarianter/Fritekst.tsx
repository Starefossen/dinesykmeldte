import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';

import { cleanIda } from '../../../utils/stringUtils';

import { SporsmalVarianterProps } from './SporsmalVarianter';
import SporsmalListItem from './shared/SporsmalListItem';

function Fritekst({ sporsmal }: SporsmalVarianterProps): JSX.Element | null {
    if (!sporsmal.svar || !sporsmal.svar[0]) return null;

    const listItemId = cleanIda(sporsmal.id);

    return (
        <SporsmalListItem listItemId={listItemId}>
            <Heading id={listItemId} size="small" level="3">
                {sporsmal.sporsmalstekst}
            </Heading>
            <BodyShort size="small">{sporsmal.svar[0].verdi}</BodyShort>
        </SporsmalListItem>
    );
}

export default Fritekst;
