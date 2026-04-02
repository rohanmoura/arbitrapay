import { fetchAdminAccountActivations } from "@/services/adminAccountActivationsService";
import { fetchAdminBankAccountsData } from "@/services/adminBankAccountsService";
import { fetchAdminLiveDepositHistory } from "@/services/adminLiveDepositHistoryService";
import { fetchAdminSecurityDeposits } from "@/services/adminSecurityDepositsService";
import { fetchAdminSettings } from "@/services/adminSettingsService";
import { fetchAdminUsersSummary } from "@/services/adminUsersService";
import { fetchAdminWithdrawals } from "@/services/adminWithdrawalsService";

export type AdminDashboardInsights = {
  totalUsers: number;
  totalBankAccounts: number;
  totalActivationRequests: number;
  usersWithLiveDeposits: number;
  totalSecurityDeposits: number;
  totalWithdrawalRequests: number;
};

export type AdminDashboardBalance = {
  defaultBalance: number;
  approvedSecurityDeposits: number;
  approvedWithdrawals: number;
  liveDepositCredit: number;
  liveDepositDebit: number;
  currentBalance: number;
};

export type AdminDashboardData = {
  balance: AdminDashboardBalance;
  insights: AdminDashboardInsights;
};

export function calculateAdminDashboardBalance(input: Omit<AdminDashboardBalance, "currentBalance">) {
  return (
    input.defaultBalance +
    input.approvedSecurityDeposits -
    input.approvedWithdrawals -
    input.liveDepositCredit +
    input.liveDepositDebit
  );
}

function isApprovedStatus(status?: string | null) {
  return !status || status === "approved";
}

export async function fetchAdminDashboardData(): Promise<AdminDashboardData> {
  const [
    adminSettings,
    usersSummary,
    bankAccountsData,
    activationsData,
    liveDepositHistoryData,
    securityDeposits,
    withdrawals,
  ] = await Promise.all([
    fetchAdminSettings(),
    fetchAdminUsersSummary(),
    fetchAdminBankAccountsData(),
    fetchAdminAccountActivations(),
    fetchAdminLiveDepositHistory(),
    fetchAdminSecurityDeposits(),
    fetchAdminWithdrawals(),
  ]);

  const approvedSecurityDeposits = securityDeposits.reduce((sum, deposit) => {
    return deposit.status === "approved" ? sum + deposit.amount : sum;
  }, 0);

  const approvedWithdrawals = withdrawals.reduce((sum, withdrawal) => {
    return withdrawal.status === "approved" ? sum + withdrawal.amount : sum;
  }, 0);

  const liveDepositCredit = liveDepositHistoryData.records.reduce((sum, record) => {
    return record.type === "credit" && isApprovedStatus(record.status)
      ? sum + record.amount
      : sum;
  }, 0);

  const liveDepositDebit = liveDepositHistoryData.records.reduce((sum, record) => {
    return record.type === "debit" && isApprovedStatus(record.status)
      ? sum + record.amount
      : sum;
  }, 0);

  const balance = {
    defaultBalance: adminSettings.adminBalance,
    approvedSecurityDeposits,
    approvedWithdrawals,
    liveDepositCredit,
    liveDepositDebit,
    currentBalance: calculateAdminDashboardBalance({
      defaultBalance: adminSettings.adminBalance,
      approvedSecurityDeposits,
      approvedWithdrawals,
      liveDepositCredit,
      liveDepositDebit,
    }),
  } satisfies AdminDashboardBalance;

  return {
    balance,
    insights: {
      totalUsers: usersSummary.totalUsers,
      totalBankAccounts: bankAccountsData.summary.totalBankAccounts,
      totalActivationRequests: activationsData.summary.total,
      usersWithLiveDeposits: liveDepositHistoryData.summary.totalUsersWithDeposits,
      totalSecurityDeposits: securityDeposits.length,
      totalWithdrawalRequests: withdrawals.length,
    },
  };
}
