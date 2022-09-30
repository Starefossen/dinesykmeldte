import React from 'react';
import { Heading } from '@navikt/ds-react';
import parser from 'html-react-parser';

import { cleanIda } from '../../../utils/stringUtils';

import { SporsmalVarianterProps } from './SporsmalVarianter';
import SporsmalListItem from './shared/SporsmalListItem';
import styles from './Undertekst.module.css';

function Undertekst({ sporsmal }: SporsmalVarianterProps): JSX.Element | null {
    if (!sporsmal.undertekst) return null;

    const listItemId = cleanIda(sporsmal.id);

    return (
        <SporsmalListItem listItemId={listItemId}>
            <Heading id={listItemId} size="small" level="3">
                {sporsmal.sporsmalstekst}
            </Heading>
            <div className={styles.nestedHtml}>{parser(sporsmal.undertekst)}</div>
        </SporsmalListItem>
    );
}

export default Undertekst;
