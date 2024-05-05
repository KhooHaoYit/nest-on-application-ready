# @khoohaoyit/nest-on-application-ready
🚀 A Nest module for executing tasks post initialization

## Installation
```bash
npm install @khoohaoyit/nest-on-application-ready
```

## Usage
Implement `OnApplicationReady`
```ts
// api.service.ts
@Injectable()
class ApiService implements OnApplicationReady {
  onApplicationReady() {
    // Add your initialization code here
    console.log('Application is ready. Starting execution...');
  }
}
```
Imports `OnApplicationReadyModule`
```ts
@Module({
  imports: [
    OnApplicationReadyModule
  ],
  providers: [
    ApiService
  ]
})
export class AppModule { }
```
Your code will now execute once Nest has completed its initialization process

## Technical Explaination
Behind the scenes, the `OnApplicationReadyModule` retrieves the underlying HTTP server and attaches a listener. This listener is triggered once the HTTP server successfully binds to a TCP port. Subsequently, it calls all modules, controllers, and providers that implement the `OnApplicationReady` interface.
