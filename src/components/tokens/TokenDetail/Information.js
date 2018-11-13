import React from "react";
import {tu} from "../../../utils/i18n";
import {FormattedDate, FormattedNumber, FormattedTime } from "react-intl";
import {AddressLink, ExternalLink} from "../../common/Links";
import {Link} from "react-router-dom";
import {toLower} from "lodash";


export function Information({token}) {

  let social_display = 0;
  let lowerText = token.reputation? toLower(token.reputation) + '_active.png': '';

  token && token['social_media'] && token['social_media'].map((media, index) => {
    if (media.url) {
      social_display++;
    }
  })

  const tokenList = [
    { 
      name: 'total_supply', 
      content: <FormattedNumber value={token.totalSupply}/>
    },{ 
      name: 'reputation', 
      content:  <Link to={`/rating`} style={{display: 'flex', alignItems: 'center'}}>
                  {tu(token.reputation)}
                  <img src={require('../../../images/state/' + lowerText)} className="ml-1 faceico"/>
                </Link>
    },{ 
      name: 'circulating_supply', 
      content: <FormattedNumber value={token.issued}/>
    },{ 
      name: 'website', 
      content: <ExternalLink url={token.url}/>
    },{ 
      name: 'token_holders', 
      content: <FormattedNumber value={token.nrOfTokenHolders}/>
    },{ 
      name: 'issuer', 
      content: <AddressLink address={token.ownerAddress}/>
    },{ 
      name: 'nr_of_Transfers', 
      content: <FormattedNumber value={token.totalTransactions}/>
    },{ 
      name: 'white_paper', 
      content:  token.white_paper !== 'no_message'?
                <ExternalLink url={token.white_paper && tu(token.white_paper)} _url={token.white_paper}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },{ 
      name: 'created', 
      content:  <div>
                  <FormattedDate value={token.dateCreated}/>
                  {' '}
                  <FormattedTime value={token.dateCreated}/>
                </div>
    },{ 
      name: 'GitHub', 
      content:  token.github !== 'no_message' ?
                <ExternalLink url={token.github && tu(token.github)} _url={token.github}/> :
                <span style={{color: '#d8d8d8'}}>-</span>
    },{ 
      name: 'contract_address', 
      content:  <span style={{color: '#d8d8d8'}}>-</span>
    },{ 
      name: 'social_link', 
      content:  <div className="d-flex">
                  {token['social_media'] && token['social_media'].map((media, index) => {
                    return (media.url !== "" && <div key={index} style={{marginRight: '10px'}}>
                      <a href={media.url}>
                        <img  src={require('../../../images/' + media.name + '.png')}/>
                      </a>
                    </div>)
                  })}
                  { !social_display && <span style={{color: '#d8d8d8'}}>-</span> }
                </div>
    }]

    return (
      <div className="information-bg">{
        tokenList.map((item,index) => {
          return(
            <div className={index%2 == 0? 'information-bg-item': 'information-bg-item ml'}>
              <span>{tu(item.name)}</span>
              <p>{item.content}</p>
            </div>)
        })
      }</div>
    );
}