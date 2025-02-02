import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import IconSettingClass from '../../../../../../components/settingsIcon';
import Select from 'react-select';
import { getAdminSettings, addUpdateAdminSettings, getCounters } from '../../../../../../store/actions';

const PPDAdminSettings = props => {
    const [costCenterList, setCostCenterList] = useState([]);
    const [selectedDepartmentCC, setSelectedDepartmentCC] = useState({});
    const [departmentCCIndex, setDepartmentCCIndex] = useState(null);
    const [selectedJobCC, setSelectedJobCC] = useState({});
    const [jobCCIndex, setJobCCIndex] = useState(null);
    const [selectedCounters, setSelectedCounters] = useState([]);
    const [countersList, setCountersList] = useState([]);

    useEffect(() => {
        getSettings(props.ClientDataReducer.companyShortName);
        setDepartmentCCIndex(props.PPD_ADMIN_SETTINGS_GET?.departmentCCIndex);
        setJobCCIndex(props.PPD_ADMIN_SETTINGS_GET?.jobCCIndex);
        let costCenters = Array.isArray(props.PARENT_COST_CENTERS) && props.PARENT_COST_CENTERS.map(cc => ({ ...cc, value: cc.treeIndex, label: cc.treeName }));
        setCostCenterList(costCenters || []);
        let selectedDepartment = costCenterList.find(el => el.value === departmentCCIndex);
        if (selectedDepartment) setSelectedDepartmentCC(selectedDepartment);
        let selectedJob = costCenterList.find(el => el.value === jobCCIndex);
        if (selectedJob) setSelectedJobCC(selectedJob);
    }, [costCenterList.length]);

    useEffect(() => {
        getCounters(props.ClientDataReducer.companyShortName);
        let counters = Array.isArray(props.COUNTERS) && props.COUNTERS.map(c => ({ label: c.counterName, value: c.counterName }))
        setCountersList(counters || []);
        setSelectedCounters(countersList.filter(counter => props.PPD_ADMIN_SETTINGS_GET?.counters?.includes(counter.value)));
    }, [countersList.length]);

    async function getSettings(companyShortName) {
        await props.getAdminSettings(companyShortName);
    };

    async function getCounters(companyShortName) {
        await props.getCounters(companyShortName);
    };

    async function updateSettings() {
        await props.addUpdateAdminSettings({
            companyShortName: props.ClientDataReducer.companyShortName,
            departmentCCIndex: selectedDepartmentCC.treeIndex,
            jobCCIndex: selectedJobCC.treeIndex,
            counters: selectedCounters.map(c => c.value)
        });
    };

    function onSelectDepartment(selected) {
        setSelectedDepartmentCC(selected);
    };

    function onSelectJob(selected) {
        setSelectedJobCC(selected);
    };

    function onSelectCounter(selected) {
        setSelectedCounters(selected);
    };

    function onMenuOpen() {
        return;
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<IconSettingClass />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography className="reportTitle">PPD Admin Settings</Typography>
            </AccordionSummary>

            <AccordionDetails>
                <div className="reportListAccording mar-0">
                    <div className="df align-items-center justify-content-between margin-top-10">
                        <button
                            className="btn reportBtn"
                            onClick={updateSettings}
                        >
                            Save
                        </button>
                    </div>
                    <div className="ec_setup_contact reg ">
                        <div className="SavedReports reportId df align-items-center justify-content-between margin-top-10">
                            <div className="input_line ssD_fiels">
                                <label>Department Tree Index</label>
                                <Select
                                    options={costCenterList}
                                    onChange={onSelectDepartment}
                                    onMenuOpen={onMenuOpen}
                                    value={selectedDepartmentCC}
                                    placeholder="Select Department Tree Index"
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="SavedReports reportId df align-items-center justify-content-between margin-top-10">
                            <div className="input_line ssD_fiels">
                                <label>Job Tree Index</label>
                                <Select
                                    options={costCenterList}
                                    onChange={onSelectJob}
                                    value={selectedJobCC}
                                    placeholder="Select Job Tree Index"
                                >
                                </Select>
                            </div>
                        </div>
                        <div className="SavedReports reportId df align-items-center justify-content-between margin-top-10">
                            <div className="input_line ssD_fiels">
                                <label>Counters</label>
                                <Select
                                    options={countersList}
                                    isMulti={true}
                                    onChange={onSelectCounter}
                                    value={selectedCounters}
                                    placeholder="Select Counters"
                                >
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </AccordionDetails>
        </Accordion>
    )
};

const mapStateToProps = ({ UserReducer, ClientDataReducer, PPDReducer, CostCenterReducer }) => {
    const { PPD_ADMIN_SETTINGS, PPD_ADMIN_SETTINGS_GET, COUNTERS } = PPDReducer;
    const { PARENT_COST_CENTERS } = CostCenterReducer;
    return { UserReducer, ClientDataReducer, PPD_ADMIN_SETTINGS, PPD_ADMIN_SETTINGS_GET, PARENT_COST_CENTERS, COUNTERS };
};

export default connect(mapStateToProps, {
    getAdminSettings, addUpdateAdminSettings, getCounters
})(PPDAdminSettings);
