// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Testing } from "cdktf";
import { ContainerCluster } from "@cdktf/provider-google/lib/container-cluster";
import { SqlDatabase } from "@cdktf/provider-google/lib/sql-database";
import { SqlDatabaseInstance } from "@cdktf/provider-google/lib/sql-database-instance";
import { SqlUser } from "@cdktf/provider-google/lib/sql-user";
import { MyStack } from "../main";

describe("My CDKTF Application", () => {
  it("synthesizes the expected GCP resources", () => {
    const app = Testing.app();
    const stack = new MyStack(app, "test");
    const synthesized = Testing.synth(stack);

    expect(synthesized).toHaveResource(SqlDatabaseInstance);
    expect(synthesized).toHaveResource(SqlDatabase);
    expect(synthesized).toHaveResource(SqlUser);
    expect(synthesized).toHaveResource(ContainerCluster);
  });

  it("keeps Cloud SQL off the public IPv4 network", () => {
    const app = Testing.app();
    const stack = new MyStack(app, "test");
    const synthesized = JSON.parse(Testing.synth(stack));
    const instances = Object.values(
      synthesized.resource.google_sql_database_instance,
    ) as Array<{ settings: { ip_configuration: { ipv4_enabled: boolean } } }>;

    expect(instances).toHaveLength(1);
    expect(instances[0].settings.ip_configuration.ipv4_enabled).toBe(false);
  });

  // // All Unit tests test the synthesised terraform code, it does not create real-world resources
  // describe("Unit testing using assertions", () => {
  //   it("should contain a resource", () => {
  //     // import { Image,Container } from "./.gen/providers/docker"
  //     expect(
  //       Testing.synthScope((scope) => {
  //         new MyApplicationsAbstraction(scope, "my-app", {});
  //       })
  //     ).toHaveResource(Container);

  //     expect(
  //       Testing.synthScope((scope) => {
  //         new MyApplicationsAbstraction(scope, "my-app", {});
  //       })
  //     ).toHaveResourceWithProperties(Image, { name: "ubuntu:latest" });
  //   });
  // });

  // describe("Unit testing using snapshots", () => {
  //   it("Tests the snapshot", () => {
  //     const app = Testing.app();
  //     const stack = new TerraformStack(app, "test");

  //     new TestProvider(stack, "provider", {
  //       accessKey: "1",
  //     });

  //     new TestResource(stack, "test", {
  //       name: "my-resource",
  //     });

  //     expect(Testing.synth(stack)).toMatchSnapshot();
  //   });

  //   it("Tests a combination of resources", () => {
  //     expect(
  //       Testing.synthScope((stack) => {
  //         new TestDataSource(stack, "test-data-source", {
  //           name: "foo",
  //         });

  //         new TestResource(stack, "test-resource", {
  //           name: "bar",
  //         });
  //       })
  //     ).toMatchInlineSnapshot();
  //   });
  // });

  // describe("Checking validity", () => {
  //   it("check if the produced terraform configuration is valid", () => {
  //     const app = Testing.app();
  //     const stack = new TerraformStack(app, "test");

  //     new TestDataSource(stack, "test-data-source", {
  //       name: "foo",
  //     });

  //     new TestResource(stack, "test-resource", {
  //       name: "bar",
  //     });
  //     expect(Testing.fullSynth(app)).toBeValidTerraform();
  //   });

  //   it("check if this can be planned", () => {
  //     const app = Testing.app();
  //     const stack = new TerraformStack(app, "test");

  //     new TestDataSource(stack, "test-data-source", {
  //       name: "foo",
  //     });

  //     new TestResource(stack, "test-resource", {
  //       name: "bar",
  //     });
  //     expect(Testing.fullSynth(app)).toPlanSuccessfully();
  //   });
  // });
});
