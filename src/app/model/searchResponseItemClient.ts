import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';
import * as appSettings from 'application-settings';
import {
  request,
  getFile,
  getImage,
  getJSON,
  getString,
  HttpRequestOptions,
  HttpResponse
} from 'tns-core-modules/http';
import { searchResponse, DataEntity } from '../model/searchResponse.model';// Stores the currently-being-typechecked object for error messages.

export interface searchResponseItemClient extends DataEntity
{
    AllJapaneseWord?: string,
    AllJapaneseReading?: string,

    MainJapaneseWord?: string,
    MainJapaneseReading?: string
} 