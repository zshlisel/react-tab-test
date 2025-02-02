import React, { Component } from "react";
import { connect } from "react-redux";
import { updateClient, } from "../../../../../store/actions";
import './style.scss';
class ApiSetup extends Component {
  state = {
    editApiKey: false,
    companiesList: [],
  };

  async componentDidMount() {

    this.setState({ apiKey: this.props.ClientDataReducer.apiKey });
  }

  async componentDidUpdate(prevProps) {

  }

  updateApiInput = e => this.setState({ apiKey: e.target.value });

  render() {
    return (
      <div className="api_sec inner_wrpr">
        <div className="reportTitle">

          {!this.state.editApiKey ? (
            <div className="df align-items-center justify-content-between">
              <p className="api_val">
                API Key :  {this.props.client && this.props.client.apiKey}{" "}
              </p>

              <button className="btn reportBtn" onClick={() => this.setState({ editApiKey: true })}>Edit</button>
            </div>
          ) : (
            <div className="df align-items-center justify-content-between">
              <div className="api_val">
                <input
                  type="text"
                  value={this.state.apiKey}
                  onChange={this.updateApiInput}
                />
              </div>
              <button className="btn reportBtn" onClick={async () => {
                await this.props.updateClient({
                  apiKey: this.state.apiKey,
                  companyShortName: this.props.ClientDataReducer.companyShortName,
                  _id: this.props.ClientDataReducer._id
                });
                this.setState({ editApiKey: false });
              }}>Save</button>


            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ client, ClientDataReducer }) => ({ client, ClientDataReducer });
export default connect(mapStateToProps, { updateClient, })(ApiSetup);
