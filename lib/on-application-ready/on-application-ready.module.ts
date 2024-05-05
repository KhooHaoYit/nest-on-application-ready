import { Module } from "@nestjs/common";
import { OnApplicationReadyService } from "./on-application-ready.service";

@Module({
  providers: [
    OnApplicationReadyService
  ]
})
export class OnApplicationReadyModule { }
