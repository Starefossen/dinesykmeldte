import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';

import { cleanIda } from '../../../utils/stringUtils';
import { formatDate } from '../../../utils/dateUtils';
import { notNull } from '../../../utils/tsUtils';

import { SporsmalVarianterProps } from './SporsmalVarianter';
import SporsmalListItem from './shared/SporsmalListItem';
import SporsmalList from './shared/SporsmalList';
import SporsmalListItemNested from './shared/SporsmalListItemNested';

function Dato({ sporsmal }: SporsmalVarianterProps): JSX.Element | null {
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
                    return (
                        <SporsmalListItemNested key={svarId}>
                            <BodyShort size="small">{formatDate(svar.verdi)}</BodyShort>
                        </SporsmalListItemNested>
                    );
                })}
            </SporsmalList>
        </SporsmalListItem>
    );
}

export default Dato;
