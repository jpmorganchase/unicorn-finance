import React, { useEffect, useState } from 'react';
import AccountInfo from '../components/accountInformationPanel/index';
import TransactionInfo from '../components/transactionInformationPanel/index';
import usePostBalanceData from '../hooks/usePostBalanceData';
import Spinner from '../components/spinner';
import { AppContext } from '../context/AppContext';
import balanceMockDataUntyped from '../mockedJson/uf-balances.json';
import transactionMockDataUntyped from '../mockedJson/uf-transactions.json';
import { config } from '../config';
import { AccountType } from '../types/accountTypes';
import { TransactionType } from '../types/transactionTypes';
import useTransactionGet from '../hooks/useTransactionGet';

const balanceMockData: AccountType[] = balanceMockDataUntyped as AccountType[];
const transactionMockData: TransactionType[] = transactionMockDataUntyped as TransactionType[];

function AccountPage() {
  const { accountsConfig } = config;
  const [selectedAccount, setSelectedAccount] = useState({});
  const { displayingMockedData } = React.useContext(AppContext);

  const balanceResults = usePostBalanceData(
    accountsConfig.apiDetails[0].backendPath,
    accountsConfig.apiDetails[0].cacheKey,
    accountsConfig.apiDetails[0].refreshInterval,
    JSON.stringify(accountsConfig.apiDetails[0].body),
    displayingMockedData,
  );

  const transactionResults = useTransactionGet(
    accountsConfig.apiDetails[1].backendPath,
    accountsConfig.apiDetails[1].cacheKey,
    accountsConfig.apiDetails[1].refreshInterval,
    displayingMockedData,
  );

  useEffect(() => {
    setSelectedAccount({});
  }, [displayingMockedData, setSelectedAccount]);

  const displayAccountPanel = (data: AccountType[]) => (
    <AccountInfo
      data={data}
      selectedAccount={selectedAccount}
      setSelectedAccount={setSelectedAccount}
    />
  );

  const displayTransactionPanel = (data : TransactionType[]) => (
    <TransactionInfo
      transactions={data}
      selectedAccount={selectedAccount}
    />
  );

  const displayPanels = () => {
    if (displayingMockedData) {
      return (
        <div className="flex flex-wrap">
          {displayAccountPanel(balanceMockData)}
          {displayTransactionPanel(transactionMockData)}
        </div>
      );
    } if (balanceResults.isError || transactionResults.isError) {
      return (
        <div className="text-center pt-24" data-cy="errorMessage">
          Error gathering information from API. Toggle on mocked data below to see example information
        </div>
      );
    } if (!displayingMockedData && balanceResults.data && transactionResults.data) {
      return (
        <div className="flex flex-wrap">
          {displayAccountPanel(balanceResults?.data)}
          {displayTransactionPanel(transactionResults?.data)}
        </div>
      );
    }
    return (
      <div className="text-center pt-24">
        <Spinner />
      </div>
    );
  };

  return (
    <>
      {displayPanels()}
    </>
  );
}

export default AccountPage;
