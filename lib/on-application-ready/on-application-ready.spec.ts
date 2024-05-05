import { Test, TestingModule } from '@nestjs/testing';
import { OnApplicationReadyModule } from './on-application-ready.module';
import { Controller, INestApplication, Injectable, Module, NestApplicationOptions, RequestMethod, VersioningOptions } from '@nestjs/common';
import { OnApplicationReady } from './on-application-ready.interface';
import { Server as HttpServer } from 'http';
import { Server as HttpsServer } from 'https';
import { AbstractHttpAdapter } from '@nestjs/core';
import { VersionValue } from '@nestjs/common/interfaces';
import { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface';

describe(OnApplicationReadyModule, () => {
  let testModule: TestingModule;
  let app: INestApplication | undefined;

  let provider: ProviderClass;
  let controller: ControllerClass;
  let module: ModuleClass;

  let providerCallback: jest.SpyInstance;
  let controllerCallback: jest.SpyInstance;
  let moduleCallback: jest.SpyInstance;

  beforeEach(async () => {
    testModule = await Test.createTestingModule({
      imports: [
        OnApplicationReadyModule,
        ModuleClass,
      ],
    }).compile();

    provider = testModule.get(ProviderClass);
    controller = testModule.get(ControllerClass);
    module = testModule.get(ModuleClass);

    providerCallback = jest.spyOn(provider, 'onApplicationReady');
    controllerCallback = jest.spyOn(controller, 'onApplicationReady');
    moduleCallback = jest.spyOn(module, 'onApplicationReady');
  });

  afterEach(async () => {
    await app?.close();
    jest.resetAllMocks();
  });

  it('should call onApplicationReady', async () => {
    app = testModule.createNestApplication();

    await app.listen(0);

    expect(providerCallback).toHaveBeenCalled();
    expect(controllerCallback).toHaveBeenCalled();
    expect(moduleCallback).toHaveBeenCalled();
  });

  it('should works on http server', async () => {
    app = testModule.createNestApplication();

    await app.listen(0);

    expect(app.getHttpServer()).toBeInstanceOf(HttpServer)
  });

  it('should works on https server', async () => {
    app = testModule.createNestApplication({ httpsOptions: {} });

    await app.listen(0);

    expect(app.getHttpServer()).toBeInstanceOf(HttpsServer)
  });

  it('should throw if unknown server', async () => {
    const adapter = new StubHttpAdapter();
    app = testModule.createNestApplication(adapter);

    await expect(app.listen(0))
      .rejects.toThrow(new Error('Unknown http server'))
  });
});

@Injectable()
class ProviderClass implements OnApplicationReady {
  onApplicationReady() { }
}

@Controller()
class ControllerClass implements OnApplicationReady {
  onApplicationReady() { }
}

@Module({
  imports: [OnApplicationReadyModule],
  controllers: [ControllerClass],
  providers: [ProviderClass]
})
class ModuleClass implements OnApplicationReady {
  onApplicationReady() { }
}

class StubHttpAdapter extends AbstractHttpAdapter {
  close() { }
  initHttpServer(options: NestApplicationOptions) { }
  useStaticAssets(...args: any[]) { }
  setViewEngine(engine: string) { }
  getRequestHostname(request: any) { }
  getRequestMethod(request: any) { }
  getRequestUrl(request: any) { }
  status(response: any, statusCode: number) { }
  reply(response: any, body: any, statusCode?: number | undefined) { }
  end(response: any, message?: string | undefined) { }
  render(response: any, view: string, options: any) { }
  redirect(response: any, statusCode: number, url: string) { }
  setErrorHandler(handler: Function, prefix?: string | undefined) { }
  setNotFoundHandler(handler: Function, prefix?: string | undefined) { }
  isHeadersSent(response: any) { }
  getHeader?(response: any, name: string) { }
  setHeader(response: any, name: string, value: string) { }
  appendHeader?(response: any, name: string, value: string) { }
  registerParserMiddleware(prefix?: string | undefined, rawBody?: boolean | undefined) { }
  enableCors(options: CorsOptions | CorsOptionsDelegate<any>, prefix?: string | undefined) { }
  createMiddlewareFactory(requestMethod: RequestMethod): ((path: string, callback: Function) => any) | Promise<(path: string, callback: Function) => any> {
    return () => { }
  }
  getType(): string {
    return '';
  }
  applyVersionFilter(handler: Function, version: VersionValue, versioningOptions: VersioningOptions): (req: any, res: any, next: () => void) => Function {
    return () => () => { }
  }
}
