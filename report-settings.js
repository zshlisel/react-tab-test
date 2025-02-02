import React, { Component } from 'react';
import { connect } from "react-redux";
import PHReportSettingsView from './patient-hours';
import WageParityReportSettings from './wage-parity';
import CertifiedPayrollReportSettings from './certified-payroll';
import NJCertifiedSettings from './nj-certified';
import PPDSettings from "./ppd";
class ReportSettingsView extends Component {

  isPermission(key) {
    return this.props.CLIENT_PERMISSIONS?.find(p => p.key === key && p.isActive);
  }

  render() {
    return (
      <>
        <div className="reportList">

          {this.isPermission('PatientReducer') && (
            <PHReportSettingsView></PHReportSettingsView>
          )}
          {this.isPermission('WAGE_PARITY') && (
            <WageParityReportSettings></WageParityReportSettings>
          )}
          {this.isPermission('CERTIFIED_PAYROLL') && (
            <CertifiedPayrollReportSettings></CertifiedPayrollReportSettings>
          )}
          {this.isPermission('NJ_CERTIFIED') && (
            <NJCertifiedSettings></NJCertifiedSettings>
          )}
          {this.isPermission('PPD_CENSUS_DATA') && (
            <PPDSettings></PPDSettings>
          )}
        </div>
      </>
    );
  }
};

const mapStateToProps = ({ UserReducer, ClientDataReducer, PatientReducer, PermissionReducer, SavedECReducer }) => {
  const { CLIENT_PERMISSIONS } = PermissionReducer;
  const { PHRS, EINS } = PatientReducer;
  return { UserReducer, ClientDataReducer, CLIENT_PERMISSIONS, PHRS, EINS, SavedECReducer };
};

export default connect(mapStateToProps, {
})(ReportSettingsView);




