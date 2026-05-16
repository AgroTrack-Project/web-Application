import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { CropResource } from './crop-response';
import { CropAssembler } from './crop-assembler';
import { Crop } from '../domain/model/crop.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CropApiEndpoint extends BaseApiEndpoint<Crop, CropResource, BaseResponse, CropAssembler> {
  constructor(http: HttpClient, assembler: CropAssembler) {
    super(http, `${environment.apiBaseUrl}${environment.cropsEndpointPath}`, assembler);
  }
}
