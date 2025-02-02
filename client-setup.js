import React, { Component } from 'react';
import { connect } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ClientsPermissionsView from './Clients-permissions';
import ReportSettingsView from './Report-settings';
import iconRight from '../../../../assets/images/Icon-arrow-right.png'
import SettingSetupView from './Settings';
import { Tooltip } from 'react-tooltip';
import {
  getCompanyPermissions,
  syncCompanyData,
  refreshUserAction,
  getCostCenterParents,
  getCompanyEarningCodes,
  loginAsUser
} from "../../../../store/actions";
class RightSidebarView extends Component {

  constructor() {
    super();
    this.state = {
    loading: false,
    toolTipMessage: `<p>Sync Earning codes</p>
    <p>Sync Deduction Codes</p>
    <p>Sync Cost Centers</p>
    <p>Sync Payrolls</p>
    <p>Sync EINs</p>`,
    selectedTabIndex: 0
    };
  }

  handleTabSelect = (index) => {
    //if index is not a number, return. 
    // Because each change in the tab will trigger this function with the event object,
    // and event while typing in the input.
    if(typeof index !== 'number') return;

    this.setState({ selectedTabIndex: index });
  }



  async componentDidMount() {
    await this.props.getCompanyEarningCodes(this.props.ClientDataReducer._id);
    await this.props.getCostCenterParents(this.props.ClientDataReducer._id);
  }

  login = ($e, enableBackToAdmin) => {
    //$e.preventDefault();

    const { role, company, permissions } = this.props.UserReducer;
    let { _id, companyId, companyName, companyShortName } = this.props.ClientDataReducer;

    this.setState({ loading: true });
    /* this.props.UserReducer.LOGIN_AS = enableBackToAdmin;
    this.props.UserReducer.prevRole = role;
    this.props.UserReducer.role = 'Client';
    this.props.UserReducer.prevCompany = company;
    this.props.UserReducer.company = companyShortName;
    this.props.UserReducer.companyId = _id;
    this.props.UserReducer.compSystemId = companyId;
    this.props.UserReducer.companyName = companyName;
    this.props.UserReducer.prevPermissions = permissions;
    this.props.UserReducer.permissions = this.props.CLIENT_PERMISSIONS; */
    let loginProps = {
      LOGIN_AS: enableBackToAdmin,
      prevRole: role,
      role: 'Client',
      prevCompany: company,
      company: companyShortName,
      companyId: _id,
      compSystemId: companyId,
      companyName,
      prevPermissions: permissions,
      permissions: [...(this.props.CLIENT_PERMISSIONS || [])]
    };
    localStorage.setItem('USER', JSON.stringify({ ...this.props.UserReducer, ...loginProps }));
    this.props.refreshUserAction();
    this.props.history.push(`/`);
  }

  loginAsUser = async (e) => {
    let username = prompt("username?");
    if (!username) return;
    let { companyName, companyShortName } = this.props.ClientDataReducer;
    //let company = companyShortName;
    //this.props.UserReducer.companyName = companyName;
    localStorage.setItem('USER', JSON.stringify({ ...this.props.UserReducer, company: companyShortName, companyName }));
    await this.props.loginAsUser({ username, companyShortName });
    this.login(e);
  }

  isRolePermission(key) {
    return this.props.UserReducer.permissions?.find(p => p.key === key);
  }

  syncAll = async () => {
    this.setState({
      loading: true
    })
    const { companyShortName, _id, isHR } = this.props.ClientDataReducer
    await this.props.syncCompanyData(companyShortName, _id, isHR);

    this.setState({
      loading: false
    })
  }
  render() {
    let { loading } = this.state;
    return (
      <div className="rightSidebar">
        <div className="top_header_popup d-flex align-items-center justify-content-between">
          {this.props.selectedRowData?.companyName}
          <div className="iconRight" onClick={this.props.closeSidebar}>
            <img src={iconRight} alt="" ></img>
          </div>
        </div>

        <div className="overlay-pop" onClick={this.props.closeSidebar}></div>
        <Tabs selectedIndex={this.state.selectedTabIndex} onSelect={this.handleTabSelect}>
          <div className="tabNav d-flex align-items-center justify-content-between">
            {this.isRolePermission("EDIT_SETTING_OR_PERMISSION") && (
               <TabList>
               <Tab>Products</Tab>
               <Tab>Settings</Tab>
               <Tab>Report Settings</Tab>
             </TabList>)}
            {this.isRolePermission("LOGIN_AS_USER") && (
              <div className="iconRight">
                <button className="btn reportBtn orange" onClick={this.loginAsUser} disabled={this.state.loading}>Login as User</button>
              </div>
            )}
            {this.isRolePermission("LOGIN_SA") && (
              <div className="iconRight">
                <button className="btn reportBtn" onClick={(e) => this.login(e, true)} disabled={this.state.loading}>Login as SA</button>
              </div>
            )}
          </div>
          <div className="tabContent">
            <TabPanel>
              <ClientsPermissionsView />
            </TabPanel>
            <TabPanel>
              <SettingSetupView />
            </TabPanel>
            <TabPanel>
              <ReportSettingsView />
            </TabPanel>

            <div className="footer">

              <div className="df align-items-end justify-content-between flex-row-reverse mt-4 mb-3">
                {loading ? <span className="btn">Loading data.... </span> :
                  <>
                    <a
                      id="syncAllData"
                      data-tooltip-html={
                        `<p>Sync Earning codes</p>
                    <p>Sync Deduction Codes</p>
                    <p>Sync Cost Centers</p>
                    <p>Sync Payrolls</p>
                    <p>Sync EINs</p>`}
                    >
                      <button className="primary" onClick={this.syncAll} disabled={loading}>Sync All Data</button>
                    </a>
                    <Tooltip
                      anchorSelect="#syncAllData"
                      place="left"
                      style={{
                        backgroundColor: '#f5f5f9',
                        color: 'rgba(0, 0, 0, 0.87)',
                        maxWidth: 220,
                        border: '1px solid #dadde9',
                        fontSize: '12px',
                        textAlign: 'left'
                      }} />
                  </>}

              </div>
            </div>
          </div>
        </Tabs>
      </div>
    );
  }
}
const mapStateToProps = ({ UserReducer, ClientDataReducer, PermissionReducer, DirectDepositReducer, CostCenterReducer }) => {
  const { CLIENT_PERMISSIONS } = PermissionReducer;
  return { UserReducer, ClientDataReducer, CLIENT_PERMISSIONS, DirectDepositReducer, CostCenterReducer }
};
export default connect(mapStateToProps, {
  refreshUserAction,
  syncCompanyData,
  getCompanyPermissions,
  getCostCenterParents,
  getCompanyEarningCodes,
  loginAsUser
})(RightSidebarView);
