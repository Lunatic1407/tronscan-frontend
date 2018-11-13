/* eslint-disable no-undef */
import React from "react";
import {FormattedDate, FormattedNumber, FormattedTime, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {Client} from "../../services/api";
import {AddressLink} from "../common/Links";
import {Truncate} from "../common/text";
import SmartTable from "../common/SmartTable.js"
import {TronLoader} from "../common/loaders";
import {upperFirst} from "lodash";
import {loadTokens} from "../../actions/tokens";
import xhr from "axios/index";
import {API_URL} from "../../constants";
import {TRXPrice} from "../common/Price";
import { ONE_TRX} from "../../constants";
import { Tooltip } from 'antd'


function Nodetip({props, val}) {
  let {intl } = props;
  return (
    <span>
      {val.isLibrary && <img src={require("../../images/contract/book.png")} style={{height: '16px'}}/> }

      {val.isSetting &&
      <Tooltip placement="top" title={intl.formatMessage({id: 'Optimization_Enabled'})}>
        <img src={require("../../images/contract/linghst.png")} style={{height: '16px'}}/>
      </Tooltip>}

      {val.isParameter &&
      <Tooltip placement="top" title={intl.formatMessage({id: 'Constructor_Arguments_tip'})}>
        <img src={require("../../images/contract/tools.png")} style={{height: '16px'}}/>
      </Tooltip>}

      {(!val.isLibrary && !val.isSetting && !val.isParameter) && '-' }
    </span>)
}
class Contracts extends React.Component {

  constructor() {
    super();

    this.state = {
      contracts: [],
      total: 0,
      loading: true
    };
  }

  componentDidMount() {
    this.loadContracts();
  }

  componentDidUpdate() {
    // this.loadContracts();
  }

  search = () => {
    console.log("searching");
  }

  loadContracts = async (page = 1, pageSize = 20) => {
    this.setState({loading: true})
    await Client.getContracts({
      confirm: 0,
      sort: '-timestamp',
      limit: pageSize,
      start: (page - 1) * pageSize
    }).then(({data, total}) => {
      if (data) {
        this.setState({
          contracts: data,
          loading: false,
          total
        });
      }
    });
    
  };

  customizedColumn = () => {
    let {intl} = this.props;
    let column = [
      {
        title: upperFirst(intl.formatMessage({id: 'address'})),
        dataIndex: 'address',
        key: 'address',
        align: 'left',
        className: 'ant_table',
        width: '40%',
        render: (text, record, index) => {
          return <Truncate>
                    <AddressLink address={text} isContract={true}>{text}</AddressLink>
                 </Truncate>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'ContractName'})),
        dataIndex: 'name',
        key: 'name',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <span>{text || "-"}</span>
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'Compiler'})),
      //   dataIndex: 'compiler',
      //   key: 'compiler',
      //   align: 'left',
      //   render: (text, record, index) => {
      //     return <span>{text}</span>
      //   }
      // },
      {
        title: upperFirst(intl.formatMessage({id: 'balance'})),
        dataIndex: 'balance',
        key: 'balance',
        align: 'left',
        className: 'ant_table',
        render: (text, record, index) => {
          return <TRXPrice amount={parseInt(text) / ONE_TRX}/>
        }
      },
      {
        title: upperFirst(intl.formatMessage({id: 'TxCount'})),
        dataIndex: 'trxCount',
        key: 'trxCount',
        align: 'right',
        className: 'ant_table',
        render: (text, record, index) => {
          return <FormattedNumber value={text}/>
        }
      },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'Settings'})),
      //   dataIndex: 'isSetting',
      //   key: 'isSetting',
      //   align: 'left',
      //   width: '90px',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return <Nodetip props={this.props} val={record}/>
      //   }
      // },
      // {
      //   title: upperFirst(intl.formatMessage({id: 'DateVerified'})),
      //   dataIndex: 'dateVerified',
      //   key: 'dateVerified',
      //   align: 'right',
      //   width: '170px',
      //   className: 'ant_table',
      //   render: (text, record, index) => {
      //     return <div>
      //             <FormattedDate value={text}/>{' '}
      //             <FormattedTime value={text}/>
      //           </div>
      //   }
      // }
    ];
    return column;
  }

  render() {

    let {contracts, total, loading} = this.state;
    let {match, intl} = this.props;
    let column = this.customizedColumn();
    let tableInfo = intl.formatMessage({id: 'view_total'}) + ' ' + total + ' ' + intl.formatMessage({id: 'contract_source_codes_found'})

    return (
      <main className="container header-overlap pb-3 token_black">
      {loading && <div className="loading-style"><TronLoader/></div>}
      <div className="row">
        <div className="col-md-12 table_pos">
          {total ? <div className="table_pos_info" style={{left: 'auto'}}>{tableInfo}</div> : ''}
          <SmartTable bordered={true} loading={loading}
                      column={column} data={contracts} total={total}
                      onPageChange={(page, pageSize) => {
                        this.loadContracts(page, pageSize)
                      }}/>
        </div>
      </div>
    </main>
    )
  }
}

function mapStateToProps(state) {

  return {};
}

const mapDispatchToProps = {
  loadTokens,
};

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Contracts));
