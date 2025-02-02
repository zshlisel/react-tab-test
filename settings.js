import React, { Component } from "react";
import { connect } from "react-redux";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ApiSetup from '../api-setup/ApiSetup'
import IconSettingClass from "../../../../../components/settingsIcon";
import DeductionsView from './deductions-tool';
import SohTool from "./soh-tool";
class SettingSetupView extends Component {
  state = {
    isPermission: false,
    openModal: false
  }

  render() {

    let permissions = [...(this.props.PermissionReducer.CLIENT_PERMISSIONS || [])];

    return (
      <>
        <div className="reportList">

          <Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">API Key</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="reportListAccording mar-0">
                <ApiSetup ></ApiSetup>
              </div>
            </AccordionDetails>
          </Accordion>
          {permissions?.find(p => p.key === "SOH_TOOL" && p.isActive) &&
            <Accordion>
              <AccordionSummary
                expandIcon={<IconSettingClass />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className="reportTitle">Spread of hours tool</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="reportListAccording mar-0">
                  <SohTool></SohTool>
                </div>
              </AccordionDetails>
            </Accordion>}
          {permissions?.find(p => p.key === "SCHEDULED_DEDUCTIONS" && p.isActive) && <Accordion>
            <AccordionSummary
              expandIcon={<IconSettingClass />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className="reportTitle">Automated Tasks</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <DeductionsView />
            </AccordionDetails>
          </Accordion>}
        </div>
      </>
    );
  }
}
const mapStateToProps = ({ UserReducer, PermissionReducer, ClientDataReducer, CostCenterReducer, CompanyEinsReducer, DeductionCodesReducer, PayPeriodProfilesReducer, earningsCodes }) =>
  ({ UserReducer, PermissionReducer, ClientDataReducer, CostCenterReducer, CompanyEinsReducer, DeductionCodesReducer, PayPeriodProfilesReducer, earningsCodes });
export default connect(mapStateToProps, {})(SettingSetupView);

