import { Cell, Grid, Heading, Modal } from '@navikt/ds-react';
import { Task } from '@navikt/ds-icons';
import React, { useState } from 'react';

import { PreviewSoknadFragment } from '../../../graphql/queries/graphql.generated';
import LinkPanel, { ButtonPanel } from '../../shared/links/LinkPanel';
import { formatDateRange } from '../../../utils/dateUtils';
import {
    getSoknadSykmeldingPeriodDescription,
    isPreviewSoknadNotification,
    soknadByDateDesc,
} from '../../../utils/soknadUtils';
import { cleanIda } from '../../../utils/stringUtils';

import SoknadModalContent from './soknadmodal/SoknadModalContent';
import SoknadTag from './SoknadTag';
import styles from './SoknaderListSection.module.css';

interface Props {
    title: string;
    sykmeldtId: string;
    soknader: PreviewSoknadFragment[];
}

function SoknaderListSection({ title, soknader, sykmeldtId }: Props): JSX.Element | null {
    if (soknader.length === 0) return null;

    return (
        <section aria-labelledby={`soknader-list-${cleanIda(title)}-header`} className={styles.sectionRoot}>
            <Heading
                id={`soknader-list-${cleanIda(title)}-header`}
                size="medium"
                level="2"
                className={styles.listHeader}
            >
                {title}
            </Heading>
            <Grid>
                {soknader.sort(soknadByDateDesc).map((it) => (
                    <Cell key={it.id} xs={12}>
                        <SoknadPanel sykmeldtId={sykmeldtId} soknad={it} />
                    </Cell>
                ))}
            </Grid>
        </section>
    );
}

function SoknadPanel({ sykmeldtId, soknad }: { sykmeldtId: string; soknad: PreviewSoknadFragment }): JSX.Element {
    const [open, setIsOpen] = useState(false);
    const notification = soknad.__typename !== 'PreviewNySoknad' && isPreviewSoknadNotification(soknad);

    const commonProps = {
        detail: soknad.fom && soknad.tom ? formatDateRange(soknad.fom, soknad.tom) : undefined,
        Icon: Task,
        tag: <SoknadTag soknad={soknad} />,
        description: soknad.perioder.map((it) => getSoknadSykmeldingPeriodDescription(it)).join(', '),
        notify: notification,
    };

    if (soknad.__typename === 'PreviewSendtSoknad') {
        return (
            <LinkPanel href={`/sykmeldt/${sykmeldtId}/soknad/${soknad.id}`} {...commonProps}>
                Søknad om sykepenger
            </LinkPanel>
        );
    }

    return (
        <>
            <ButtonPanel onClick={() => setIsOpen(true)} {...commonProps}>
                Søknad om sykepenger
            </ButtonPanel>
            {open && (
                <Modal open onClose={() => setIsOpen(false)} aria-labelledby={`soknad-modal-label-${soknad.id}`}>
                    <SoknadModalContent
                        soknad={soknad}
                        labelId={`soknad-modal-label-${soknad.id}`}
                        onOk={() => setIsOpen(false)}
                    />
                </Modal>
            )}
        </>
    );
}

export default SoknaderListSection;
