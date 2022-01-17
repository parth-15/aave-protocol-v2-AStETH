import { expect } from 'chai';
import { ProtocolErrors, RateMode } from '../../helpers/types';
import { wei } from './helpers';
import { setup } from './__setup.spec';

describe('AStETH Borrowing', function () {
  it('Variable borrowing disabled: must revert with correct message', async () => {
    const { lenderA, lenderB } = setup.lenders;
    await lenderA.depositStEth(wei(10));
    await expect(
      lenderB.lendingPool.borrow(
        lenderB.stETH.address,
        wei(1),
        RateMode.Variable,
        '0',
        lenderB.address
      )
    ).to.revertedWith(ProtocolErrors.VL_BORROWING_NOT_ENABLED);
  });
  it('Stable borrowing disabled: must revert with correct message', async () => {
    const { lenderA, lenderB } = setup.lenders;
    await lenderA.depositStEth(wei(10));
    await expect(
      lenderB.lendingPool.borrow(
        lenderB.stETH.address,
        wei(1),
        RateMode.Stable,
        '0',
        lenderB.address
      )
    ).to.revertedWith(ProtocolErrors.VL_BORROWING_NOT_ENABLED);
  });
  it('Variable borrowing enabled: must revert with correct message', async () => {
    const { lenderA, lenderB } = setup.lenders;
    await setup.aave.lendingPoolConfigurator.enableBorrowingOnReserve(lenderA.stETH.address, false);

    await lenderA.depositStEth(wei(10));
    await lenderB.depositWeth(wei(10));

    await expect(
      lenderB.lendingPool.borrow(
        lenderB.stETH.address,
        wei(1),
        RateMode.Variable,
        '0',
        lenderB.address
      )
    ).to.revertedWith('CONTRACT_NOT_ACTIVE');
  });
  it('Stable borrowing enabled: must revert with correct message', async () => {
    const { lenderA, lenderB } = setup.lenders;
    await setup.aave.lendingPoolConfigurator.enableBorrowingOnReserve(lenderA.stETH.address, true);

    await lenderA.depositStEth(wei(10));
    await lenderB.depositWeth(wei(10));

    await expect(
      lenderB.lendingPool.borrow(
        lenderB.stETH.address,
        wei(1),
        RateMode.Stable,
        '0',
        lenderB.address
      )
    ).to.revertedWith('CONTRACT_NOT_ACTIVE');
  });
});