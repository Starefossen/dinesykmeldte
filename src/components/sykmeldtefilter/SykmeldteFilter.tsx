import { Cell, Grid, Select, TextField } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import VirksomhetPicker from '../virksomhetpicker/VirksomhetPicker';
import { RootState } from '../../state/store';

import { useIsMoreThan5SykmeldteInSelectedVirksomhet } from './useIsMoreThan5SykmeldteInSelectedVirksomhet';
import { useFilterChangeHandlers } from './useFilterChangeHandlers';
import styles from './SykmeldteFilter.module.css';

const SykmeldteFilter = (): JSX.Element => {
    const hasMoreThan5InOrg = useIsMoreThan5SykmeldteInSelectedVirksomhet();
    const filter = useSelector((state: RootState) => state.filter);
    const { handleNameFilterChange, handleShowChange, handleSortChange } = useFilterChangeHandlers();

    if (!hasMoreThan5InOrg)
        return (
            <Grid>
                <Cell xs={12} className={styles.virksomhetsPicker}>
                    <VirksomhetPicker />
                </Cell>
            </Grid>
        );

    return (
        <div className={styles.root}>
            <Grid>
                <Cell xs={12} className={styles.virksomhetsPicker}>
                    <VirksomhetPicker />
                </Cell>
                <Cell xs={12} md={4} className={styles.filterInputCell}>
                    <TextField
                        hideLabel
                        label=""
                        className={styles.filterInput}
                        placeholder="Søk på navn"
                        aria-label="Søk på navn"
                        value={filter.name ?? ''}
                        onChange={(event) => handleNameFilterChange(event.target.value)}
                    />
                </Cell>
                <Cell xs={6} md={5}>
                    <Select
                        className={styles.visSelect}
                        label="Vis"
                        value={filter.show}
                        onChange={(event) => handleShowChange(event.target.value)}
                    >
                        <option value="all">Alle</option>
                        <option value="sykmeldte">Sykmeldte</option>
                        <option value="sykmeldte-per-virksomhet">Sykmeldte per virksomhet</option>
                        <option value="friskmeldte">Tidligere sykmeldte</option>
                        <option value="graderte">Graderte</option>
                    </Select>
                </Cell>
                <Cell xs={6} md={3}>
                    <Select
                        className={styles.sortSelect}
                        label="Sorter etter"
                        value={filter.sortBy}
                        onChange={(event) => handleSortChange(event.target.value)}
                    >
                        <option value="date">Dato</option>
                        <option value="name">Navn</option>
                    </Select>
                </Cell>
            </Grid>
        </div>
    );
};

export default SykmeldteFilter;
