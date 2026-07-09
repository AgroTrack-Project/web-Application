import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../shared/infrastructure/base-response';
import { CropResource } from './crop-response';
import { CropAssembler } from './crop-assembler';
import { Crop } from '../domain/model/crop.entity';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CropApiEndpoint extends BaseApiEndpoint<Crop, CropResource, BaseResponse, CropAssembler> {
  constructor(private httpClient: HttpClient, assembler: CropAssembler) {
    super(httpClient, `${environment.apiBaseUrl}${environment.cropsEndpointPath}`, assembler);
  }

  harvest(id: string, harvestDate: string): Observable<Crop> {
    return this.httpClient
      .put<CropResource>(`${this.endpointUrl}/${id}/harvest`, { harvest_date: harvestDate })
      .pipe(map(resource => this.assembler.toEntityFromResource(resource)));
  }
}
