import { App, TerraformStack, TerraformVariable } from 'cdktf';
import { GoogleProvider } from '@cdktf/provider-google/lib/provider';
import { SqlDatabaseInstance } from '@cdktf/provider-google/lib/sql-database-instance';
import { SqlDatabase } from '@cdktf/provider-google/lib/sql-database';
import { SqlUser } from '@cdktf/provider-google/lib/sql-user';
import { ContainerCluster } from '@cdktf/provider-google/lib/container-cluster';

class MyStack extends TerraformStack {
  constructor(app: App, id: string) {
    super(app, id);

    const projectId = new TerraformVariable(this, 'project_id', {
      type: 'string',
      description: 'Google Cloud project ID',
    });

    const databasePassword = new TerraformVariable(this, 'database_password', {
      type: 'string',
      description: 'Cloud SQL application user password',
      sensitive: true,
    });

    // Configure the Google provider
    new GoogleProvider(this, 'Google', {
      project: projectId.stringValue,
      region: 'europe-central2',
    });

    // Create a Cloud SQL instance
    const sqlInstance = new SqlDatabaseInstance(this, 'my-sql-instance', {
      name: 'my-sql-instance',
      databaseVersion: 'MYSQL_5_7', 
      region: 'europe-central2', 
      settings: {
        tier: 'db-f1-micro', 
        ipConfiguration: {
          ipv4Enabled: false,
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
      password: databasePassword.stringValue,
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
