import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { SoilRecord } from '../domain/model/soil-record.entity';
import { SoilRecordResource } from './soil-record-response';
import { SoilRecordAssembler } from './soil-record-assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SoilRecordApiEndpoint extends BaseApiEndpoint<
  SoilRecord,
  SoilRecordResource,
  BaseResponse,
  SoilRecordAssembler
> {
  constructor(http: HttpClient, assembler: SoilRecordAssembler) {
    super(
      http,
      `${environment.apiBaseUrl}${environment.soilRecordsEndpointPath}`,
      assembler
    );
  }
}
