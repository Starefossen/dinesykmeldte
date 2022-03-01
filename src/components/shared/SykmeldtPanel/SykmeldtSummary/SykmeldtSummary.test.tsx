import {
    createPreviewSendtSoknad,
    createPreviewSykmelding,
    createPreviewSykmeldt,
} from '../../../../utils/test/dataCreators';
import { render, screen } from '../../../../utils/test/testUtils';

import SykmeldtSummary from './SykmeldtSummary';

describe('SykmeldtCard', () => {
    it('should format new varsler when there is one unread sykmelding', () => {
        render(
            <SykmeldtSummary
                sykmeldt={createPreviewSykmeldt({
                    previewSykmeldinger: [createPreviewSykmelding({ lest: false })],
                })}
                notification
            />,
        );

        expect(screen.getByText('1 nytt varsel')).toBeInTheDocument();
    });

    it('should format new varsler when there is multiple unread', () => {
        render(
            <SykmeldtSummary
                sykmeldt={createPreviewSykmeldt({
                    previewSykmeldinger: [createPreviewSykmelding({ lest: false })],
                    previewSoknader: [createPreviewSendtSoknad({ lest: false })],
                })}
                notification
            />,
        );

        expect(screen.getByText('2 nye varsler')).toBeInTheDocument();
    });

    describe('given no new varslinger', () => {
        xit('should format periode text', () => {
            // TODO ref. TODO in Sykmeldte.card.tsx:47
        });
    });
});