import React from 'react'
import { Heading } from '@navikt/ds-react'

import styles from './OrgHeading.module.css'

interface Props {
    orgname: string
}

function OrgHeading({ orgname }: Props): JSX.Element {
    return (
        <Heading className={styles.orgnavn} size="xsmall" level="3" spacing>
            {orgname}
        </Heading>
    )
}

export default OrgHeading
