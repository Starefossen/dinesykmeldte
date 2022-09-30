import React from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';

import { formatDate, formatDatePeriod } from '../../../utils/dateUtils';
import { cleanIda } from '../../../utils/stringUtils';
import CheckboxExplanation from '../../shared/checkboxexplanation/CheckboxExplanation';
import { SoknadSporsmalSvarFragment } from '../../../graphql/queries/graphql.generated';
import { notNull } from '../../../utils/tsUtils';

import { SporsmalVarianterProps } from './SporsmalVarianter';
import SporsmalListItem from './shared/SporsmalListItem';
import SporsmalList from './shared/SporsmalList';
import SporsmalListItemNested from './shared/SporsmalListItemNested';

const datoEllerIkkeTilBehandling = (svar: SoknadSporsmalSvarFragment): string => {
    if (svar.verdi === '' || svar.verdi === 'Ikke til behandling') {
        return 'Ikke til behandling';
    }
    return formatDate(svar.verdi);
};

function Behandlingsdager({ sporsmal }: SporsmalVarianterProps): JSX.Element | null {
    if (!sporsmal.undersporsmal || sporsmal.undersporsmal?.length === 0) return null;

    const listItemId = cleanIda(sporsmal.id);

    return (
        <SporsmalListItem listItemId={listItemId}>
            <Heading id={listItemId} size="small" level="3">
                {sporsmal.sporsmalstekst}
            </Heading>
            <SporsmalList>
                {sporsmal.undersporsmal.filter(notNull).map((underspm) => {
                    const undersporsmalId = cleanIda(underspm.id);
                    return (
                        <SporsmalListItemNested listItemId={undersporsmalId} key={undersporsmalId}>
                            {underspm.min && underspm.max && (
                                <BodyShort id={undersporsmalId} size="small">
                                    {formatDatePeriod(underspm.min, underspm.max)}
                                </BodyShort>
                            )}
                            {underspm.svar && underspm.svar[0] && (
                                <CheckboxExplanation text={datoEllerIkkeTilBehandling(underspm.svar[0])} />
                            )}
                        </SporsmalListItemNested>
                    );
                })}
            </SporsmalList>
        </SporsmalListItem>
    );
}

export default Behandlingsdager;
