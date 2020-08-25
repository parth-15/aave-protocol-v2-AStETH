import {task} from '@nomiclabs/buidler/config';
import {checkVerification} from '../../helpers/etherscan-verification';
import {ConfigNames} from '../../helpers/configuration';

task('aave:dev', 'Deploy development enviroment')
  .addOptionalParam('verify', 'Verify contracts at Etherscan')
  .setAction(async ({verify}, localBRE) => {
    await localBRE.run('set-bre');

    // Prevent loss of gas verifying all the needed ENVs for Etherscan verification
    if (verify) {
      checkVerification();
    }

    console.log('Migration started\n');

    console.log('1. Deploy mock tokens');
    await localBRE.run('deploy-mock-tokens', {verify});

    console.log('2. Deploy address provider');
    await localBRE.run('deploy-address-provider', {verify});

    console.log('3. Deploy lending pool');
    await localBRE.run('deploy-lending-pool', {verify});

    console.log('4. Deploy oracles');
    await localBRE.run('deploy-oracles', {verify, pool: ConfigNames.Aave});

    console.log('5. Initialize lending pool');
    await localBRE.run('initialize-lending-pool', {verify});

    console.log('\nFinished migration');
  });
