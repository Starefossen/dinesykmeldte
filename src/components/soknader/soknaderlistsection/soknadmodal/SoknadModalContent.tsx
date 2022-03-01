import React, { useEffect } from 'react';
import { Button, Modal } from '@navikt/ds-react';

import {
    PreviewSoknadFragment,
    useMarkSoknadReadMutation,
    useMineSykmeldteQuery,
} from '../../../../graphql/queries/react-query.generated';
import { getSoknadActivationDate } from '../../../../utils/soknadUtils';

import styles from './SoknadModalContent.module.css';

interface Props {
    soknad: PreviewSoknadFragment;
    labelId: string;
    onOk: () => void;
}

const SoknadModalContent = ({ soknad, labelId, onOk }: Props): JSX.Element => {
    switch (soknad.__typename) {
        case 'PreviewFremtidigSoknad':
            return <FremtidigSoknadModal id={labelId} tom={soknad.tom} onClick={onOk} />;
        case 'PreviewNySoknad':
            return <NySoknadModal id={labelId} soknadId={soknad.id} onClick={onOk} />;
        case 'PreviewKorrigertSoknad':
        case 'PreviewSendtSoknad':
            throw new Error('Korrigert and Sendt should not use this modal content');
    }
};

function NySoknadModal({ id, soknadId, onClick }: { id: string; soknadId: string; onClick: () => void }): JSX.Element {
    const { refetch } = useMineSykmeldteQuery();
    const { mutate: markSoknadRead } = useMarkSoknadReadMutation();

    useEffect(() => {
        (async () => {
            await markSoknadRead({ soknadId: soknadId });
            await refetch();
        })();
    }, [markSoknadRead, refetch, soknadId]);

    return (
        <Modal.Content>
            <p id={id} className={styles.firstParagraph}>
                Den ansatte har ikke sendt inn denne søknaden ennå.
            </p>
            <p>Du blir varslet så fort den er sendt.</p>
            <div className={styles.modalButtonWrapper}>
                <Button className={styles.okButton} variant="secondary" size="small" onClick={onClick}>
                    OK
                </Button>
            </div>
        </Modal.Content>
    );
}

function FremtidigSoknadModal({ id, tom, onClick }: { id: string; tom: string; onClick: () => void }): JSX.Element {
    return (
        <Modal.Content>
            <h2 id={id}>Søknad er ikke klar</h2>
            <p>
                Den ansatte får ikke fylle ut søknaden før sykefraværet er over: <b>{getSoknadActivationDate(tom)}</b>
            </p>
            <p>Du blir varslet så fort søknaden er utfylt og sendt inn.</p>
            <div className={styles.modalButtonWrapper}>
                <Button className={styles.okButton} variant="secondary" size="small" onClick={onClick}>
                    OK
                </Button>
            </div>
        </Modal.Content>
    );
}

export default SoknadModalContent;