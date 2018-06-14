import {Client} from "../services/api";
import {setTokenBalances} from "./account";
import {pkToAddress} from "@tronscan/client/src/utils/crypto";
import PrivateKeySigner from "@tronscan/client/src/signer/privateKeySigner";
import LedgerSigner from "../hw/ledger/LedgerSigner";

export const SET_ACTIVE_WALLET = 'SET_ACTIVE_WALLET';

export const setActiveWallet = (wallet) => ({
  type: SET_ACTIVE_WALLET,
  wallet,
});

export const loadWalletFromAddress = (address) => async (dispatch) => {
  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  wallet.type = 'address';
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
  Client.setSigner(null);
};

export const loadWalletFromAddressReadOnly = (address) => async (dispatch) => {
  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  wallet.type = 'readonly';
  wallet.readonly = true;
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
  Client.setSigner(null);
};

export const loadWalletFromLedger = (address) => async (dispatch) => {
  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  wallet.type = 'ledger';
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
  Client.setSigner(new LedgerSigner());
};

export const loadWalletWithPrivateKey = (privateKey) => async (dispatch) => {
  let address = pkToAddress(privateKey);
  let {balances, frozen, ...wallet} = await Client.getAccountByAddress(address);
  wallet.frozenTrx = frozen.total;
  wallet.key = privateKey;
  wallet.type = 'pk';
  dispatch(setActiveWallet(wallet));
  dispatch(setTokenBalances(balances, frozen));
  Client.setSigner(new PrivateKeySigner(privateKey));
};

export const reloadWallet = () => async (dispatch, getState) => {

  let {wallet} = getState();

  if (wallet.isOpen) {
    let {balances, frozen, ...walletProps} = await Client.getAccountByAddress(wallet.current.address);
    walletProps.frozenTrx = frozen.total;
    dispatch(setActiveWallet(walletProps));
    dispatch(setTokenBalances(balances, frozen));
  }
};