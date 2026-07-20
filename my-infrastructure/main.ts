import { App, TerraformStack } from 'cdktf';
import { GoogleProvider } from '@cdktf/provider-google/lib/provider';
import { SqlDatabaseInstance } from '@cdktf/provider-google/lib/sql-database-instance';
import { SqlDatabase } from '@cdktf/provider-google/lib/sql-database';
import { SqlUser } from '@cdktf/provider-google/lib/sql-user';
import { ContainerCluster } from '@cdktf/provider-google/lib/container-cluster';

class MyStack extends TerraformStack {
  constructor(app: App, id: string) {
    super(app, id);

    // Configure the Google provider
    new GoogleProvider(this, 'Google', {
      project: 'future-nuance-435407-c6',
      region: 'europe-north1', 
    });

    // Create a Cloud SQL instance
    const sqlInstance = new SqlDatabaseInstance(this, 'my-sql-instance', {
      name: 'my-sql-instance',
      databaseVersion: 'MYSQL_5_7', 
      region: 'europe-central2', 
      settings: {
        tier: 'db-f1-micro', 
        ipConfiguration: {
          authorizedNetworks: [
            {
              name: 'VPN Access 1',
              value: '10.26.32.12/32', 
            },
            {
              name: 'VPN Access 2',
              value: '19.104.105.29/32', 
            },
          ],
          ipv4Enabled: true,
        },
      },
    });

    // Create a database in the Cloud SQL instance
    new SqlDatabase(this, 'my-database', {
      name: 'mydatabase', 
      instance: sqlInstance.name,
    });

    // Create a Cloud SQL user
    new SqlUser(this, 'my-sql-user', {
      name: 'myuser', 
      instance: sqlInstance.name,
      password: 'mypassword', 
    });

    // Create a GKE cluster
    new ContainerCluster(this, 'my-gke-cluster', {
      name: 'my-gke-cluster',
      location: 'europe-central2', 
      initialNodeCount: 1,
      nodeConfig: {
        machineType: 'e2-micro', // Choose a machine type based on your needs
      },
    });
  }
}

const app = new App();
new MyStack(app, 'my-infrastructure');
app.synth();
