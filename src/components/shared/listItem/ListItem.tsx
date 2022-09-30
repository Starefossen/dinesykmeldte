import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';

import { cleanIda } from '../../../utils/stringUtils';

import styles from './ListItem.module.css';

interface ListItemProps {
    title: string;
    text: string | string[];
    headingLevel?: '1' | '2' | '3' | '4' | '5' | '6';
}

export function ListItem({ title, text, headingLevel }: ListItemProps): JSX.Element {
    const listItemId = cleanIda(title);

    return (
        <li className={styles.root} aria-labelledby={listItemId}>
            <Heading id={listItemId} size="small" className={styles.heading} level={headingLevel ?? '3'}>
                {title}
            </Heading>
            {Array.isArray(text) ? (
                text.map((it) => (
                    <BodyShort size="small" className={styles.bodyShort} key={it}>
                        {it}
                    </BodyShort>
                ))
            ) : (
                <BodyShort size="small" className={styles.bodyShort}>
                    {text}
                </BodyShort>
            )}
        </li>
    );
}
