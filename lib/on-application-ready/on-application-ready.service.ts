import { Inject, OnApplicationBootstrap } from "@nestjs/common";
import { HttpAdapterHost, ModulesContainer } from "@nestjs/core";
import { Server as HttpsServer } from "https";
import { Server as HttpServer } from "http";
import { OnApplicationReady } from "./on-application-ready.interface";

export class OnApplicationReadyService implements OnApplicationBootstrap {

  constructor(
    @Inject(HttpAdapterHost)
    private readonly adapterHost: HttpAdapterHost,
    private readonly moduleContainer: ModulesContainer,
  ) { }

  onApplicationBootstrap() {
    const server = this.adapterHost.httpAdapter.getHttpServer();

    if (server instanceof HttpServer) { }
    else if (server instanceof HttpsServer) { }
    else throw new Error('Unknown http server');

    const callbacks: OnApplicationReady[] = [];
    for (const instance of this.listModulesControllersAndProviders()) {
      if (instance instanceof Object === false)
        continue;
      if ('onApplicationReady' in instance === false)
        continue;
      callbacks.push(instance as OnApplicationReady);
    }

    server.once('listening', () => {
      for (const callback of callbacks) {
        callback.onApplicationReady();
      }
    });
  }

  private *listModulesControllersAndProviders() {
    for (const module of this.moduleContainer.values()) {
      yield module.instance;
      for (const controller of module.controllers.values())
        yield controller.instance;
      for (const provider of module.providers.values())
        yield provider.instance;
    }
  }

}