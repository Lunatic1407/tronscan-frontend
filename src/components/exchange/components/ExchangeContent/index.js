import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {Client} from "../../../../services/api";
import {Link} from "react-router-dom";
import {tu} from "../../../../utils/i18n";
import xhr from "axios/index";

import Kline from './Kline';
import Transaction from './Transaction';

import { Input } from 'antd';
const Search = Input.Search;


class ExchangeContent extends React.Component {

  constructor() {
    super();

    this.state = {
      
    };
  }

  componentDidMount() {
      
  }

  render() {
    const {dataSource } = this.state;
    return (
      <div className="exchange-content">
        {/* k 线 */}
        <Kline/>

        {/* transaction */}
        <Transaction/>

      </div>
    );
  }
}


export default injectIntl(ExchangeContent);
