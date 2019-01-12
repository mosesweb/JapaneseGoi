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
import { searchResponse } from '../model/searchResponse.model';// Stores the currently-being-typechecked object for error messages.
// Stores the currently-being-typechecked object for error messages.
let obj: any = null;
export class searchResponseProxy {
  public readonly meta: MetaProxy;
  public readonly data: DataEntityProxy[] | null;
  public static Parse(d: string): searchResponseProxy {
    return searchResponseProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): searchResponseProxy {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    d.meta = MetaProxy.Create(d.meta, field + ".meta");
    checkArray(d.data, field + ".data");
    if (d.data) {
      for (let i = 0; i < d.data.length; i++) {
        d.data[i] = DataEntityProxy.Create(d.data[i], field + ".data" + "[" + i + "]");
      }
    }
    if (d.data === undefined) {
      d.data = null;
    }
    return new searchResponseProxy(d);
  }
  private constructor(d: any) {
    this.meta = d.meta;
    this.data = d.data;
  }
}

export class MetaProxy {
  public readonly status: number;
  public static Parse(d: string): MetaProxy {
    return MetaProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): MetaProxy {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkNumber(d.status, false, field + ".status");
    return new MetaProxy(d);
  }
  private constructor(d: any) {
    this.status = d.status;
  }
}

export class DataEntityProxy {
  public readonly is_common: boolean;
  public readonly tags: (string | null)[] | null;
  public readonly japanese: JapaneseEntityProxy[] | null;
  public readonly senses: SensesEntityProxy[] | null;
  public readonly attribution: AttributionProxy;
  public static Parse(d: string): DataEntityProxy {
    return DataEntityProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): DataEntityProxy {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }

    if(d.is_common === undefined)
    d.is_common = false;

    checkBoolean(d.is_common, false, field + ".is_common");
    checkArray(d.tags, field + ".tags");
    if (d.tags) {
      for (let i = 0; i < d.tags.length; i++) {
        checkString(d.tags[i], true, field + ".tags" + "[" + i + "]");
        if (d.tags[i] === undefined) {
          d.tags[i] = null;
        }
      }
    }
    if (d.tags === undefined) {
      d.tags = null;
    }
    checkArray(d.japanese, field + ".japanese");
    if (d.japanese) {
      for (let i = 0; i < d.japanese.length; i++) {
        d.japanese[i] = JapaneseEntityProxy.Create(d.japanese[i], field + ".japanese" + "[" + i + "]");
      }
    }
    if (d.japanese === undefined) {
      d.japanese = null;
    }
    checkArray(d.senses, field + ".senses");
    if (d.senses) {
      for (let i = 0; i < d.senses.length; i++) {
        d.senses[i] = SensesEntityProxy.Create(d.senses[i], field + ".senses" + "[" + i + "]");
      }
    }
    if (d.senses === undefined) {
      d.senses = null;
    }
    d.attribution = AttributionProxy.Create(d.attribution, field + ".attribution");
    return new DataEntityProxy(d);
  }
  private constructor(d: any) {
    this.is_common = d.is_common;
    this.tags = d.tags;
    this.japanese = d.japanese;
    this.senses = d.senses;
    this.attribution = d.attribution;
  }
}

export class JapaneseEntityProxy {
  public readonly word: string | null;
  public readonly reading: string;
  public static Parse(d: string): JapaneseEntityProxy {
    return JapaneseEntityProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): JapaneseEntityProxy {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkString(d.word, true, field + ".word");
    if (d.word === undefined) {
      d.word = null;
    }
    if(d.reading === undefined)
    d.reading = "";
    
    checkString(d.reading, false, field + ".reading");
    return new JapaneseEntityProxy(d);
  }
  private constructor(d: any) {
    this.word = d.word;
    this.reading = d.reading;
  }
}

export class SensesEntityProxy {
  public readonly english_definitions: string[] | null;
  public readonly parts_of_speech: (string | null)[] | null;
  public readonly links: (LinksEntityProxy | null)[] | null;
  public readonly tags: (string | null)[] | null;
  public readonly restrictions: null[] | null;
  public readonly see_also: (string | null)[] | null;
  public readonly antonyms: null[] | null;
  public readonly source: null[] | null;
  public readonly info: (string | null)[] | null;
  public readonly sentences: null[] | null;
  public static Parse(d: string): SensesEntityProxy {
    return SensesEntityProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): SensesEntityProxy {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkArray(d.english_definitions, field + ".english_definitions");
    if (d.english_definitions) {
      for (let i = 0; i < d.english_definitions.length; i++) {
        checkString(d.english_definitions[i], false, field + ".english_definitions" + "[" + i + "]");
      }
    }
    if (d.english_definitions === undefined) {
      d.english_definitions = null;
    }
    checkArray(d.parts_of_speech, field + ".parts_of_speech");
    if (d.parts_of_speech) {
      for (let i = 0; i < d.parts_of_speech.length; i++) {
        checkString(d.parts_of_speech[i], true, field + ".parts_of_speech" + "[" + i + "]");
        if (d.parts_of_speech[i] === undefined) {
          d.parts_of_speech[i] = null;
        }
      }
    }
    if (d.parts_of_speech === undefined) {
      d.parts_of_speech = null;
    }
    checkArray(d.links, field + ".links");
    if (d.links) {
      for (let i = 0; i < d.links.length; i++) {
        d.links[i] = LinksEntityProxy.Create(d.links[i], field + ".links" + "[" + i + "]");
        if (d.links[i] === undefined) {
          d.links[i] = null;
        }
      }
    }
    if (d.links === undefined) {
      d.links = null;
    }
    checkArray(d.tags, field + ".tags");
    if (d.tags) {
      for (let i = 0; i < d.tags.length; i++) {
        checkString(d.tags[i], true, field + ".tags" + "[" + i + "]");
        if (d.tags[i] === undefined) {
          d.tags[i] = null;
        }
      }
    }
    if (d.tags === undefined) {
      d.tags = null;
    }
    checkArray(d.restrictions, field + ".restrictions");
    if (d.restrictions) {
      for (let i = 0; i < d.restrictions.length; i++) {
        d.restrictions[i] = null;

        checkNull(d.restrictions[i], field + ".restrictions" + "[" + i + "]");
        if (d.restrictions[i] === undefined) {
          d.restrictions[i] = null;
        }
      }
    }
    if (d.restrictions === undefined) {
      d.restrictions = null;
    }
    checkArray(d.see_also, field + ".see_also");
    if (d.see_also) {
      for (let i = 0; i < d.see_also.length; i++) {
        checkString(d.see_also[i], true, field + ".see_also" + "[" + i + "]");
        if (d.see_also[i] === undefined) {
          d.see_also[i] = null;
        }
      }
    }
    if (d.see_also === undefined) {
      d.see_also = null;
    }
    checkArray(d.antonyms, field + ".antonyms");
    if (d.antonyms) {
      for (let i = 0; i < d.antonyms.length; i++) {
        checkNull(d.antonyms[i], field + ".antonyms" + "[" + i + "]");
        if (d.antonyms[i] === undefined) {
          d.antonyms[i] = null;
        }
      }
    }
    if (d.antonyms === undefined) {
      d.antonyms = null;
    }
    checkArray(d.source, field + ".source");
    if (d.source) {
      for (let i = 0; i < d.source.length; i++) {
        d.source[i] = null;
        
        checkNull(d.source[i], field + ".source" + "[" + i + "]");
        if (d.source[i] === undefined) {
          d.source[i] = null;
        }
      }
    }
    if (d.source === undefined) {
      d.source = null;
    }
    checkArray(d.info, field + ".info");
    if (d.info) {
      for (let i = 0; i < d.info.length; i++) {
        checkString(d.info[i], true, field + ".info" + "[" + i + "]");
        if (d.info[i] === undefined) {
          d.info[i] = null;
        }
      }
    }
    if (d.info === undefined) {
      d.info = null;
    }
    checkArray(d.sentences, field + ".sentences");
    if (d.sentences) {
      for (let i = 0; i < d.sentences.length; i++) {
        checkNull(d.sentences[i], field + ".sentences" + "[" + i + "]");
        if (d.sentences[i] === undefined) {
          d.sentences[i] = null;
        }
      }
    }
    if (d.sentences === undefined) {
      d.sentences = null;
    }
    return new SensesEntityProxy(d);
  }
  private constructor(d: any) {
    this.english_definitions = d.english_definitions;
    this.parts_of_speech = d.parts_of_speech;
    this.links = d.links;
    this.tags = d.tags;
    this.restrictions = null;
    this.see_also = d.see_also;
    this.antonyms = d.antonyms;
    this.source = d.source;
    this.info = d.info;
    this.sentences = d.sentences;
  }
}

export class LinksEntityProxy {
  public readonly text: string;
  public readonly url: string;
  public static Parse(d: string): LinksEntityProxy | null {
    return LinksEntityProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): LinksEntityProxy | null {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      return null;
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, true);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, true);
    }
    checkString(d.text, false, field + ".text");
    checkString(d.url, false, field + ".url");
    return new LinksEntityProxy(d);
  }
  private constructor(d: any) {
    this.text = d.text;
    this.url = d.url;
  }
}

export class AttributionProxy {
  public readonly jmdict: boolean;
  public readonly jmnedict: boolean;
  public readonly dbpedia: boolean | string;
  public static Parse(d: string): AttributionProxy {
    return AttributionProxy.Create(JSON.parse(d));
  }
  public static Create(d: any, field: string = 'root'): AttributionProxy {
    if (!field) {
      obj = d;
      field = "root";
    }
    if (d === null || d === undefined) {
      throwNull2NonNull(field, d);
    } else if (typeof(d) !== 'object') {
      throwNotObject(field, d, false);
    } else if (Array.isArray(d)) {
      throwIsArray(field, d, false);
    }
    checkBoolean(d.jmdict, false, field + ".jmdict");
    checkBoolean(d.jmnedict, false, field + ".jmnedict");
    // This will be refactored in the next release.
    try {
      checkBoolean(d.dbpedia, false, field + ".dbpedia");
    } catch (e) {
      try {
        checkString(d.dbpedia, false, field + ".dbpedia");
      } catch (e) {
        throw e;
      }
    }
    return new AttributionProxy(d);
  }
  private constructor(d: any) {
    this.jmdict = d.jmdict;
    this.jmnedict = d.jmnedict;
    this.dbpedia = d.dbpedia;
  }
}

function throwNull2NonNull(field: string, d: any): never {
  return errorHelper(field, d, "non-nullable object", false);
}
function throwNotObject(field: string, d: any, nullable: boolean): never {
  return errorHelper(field, d, "object", nullable);
}
function throwIsArray(field: string, d: any, nullable: boolean): never {
  return errorHelper(field, d, "object", nullable);
}
function checkArray(d: any, field: string): void {
  if (!Array.isArray(d) && d !== null && d !== undefined) {
    errorHelper(field, d, "array", true);
  }
}
function checkNumber(d: any, nullable: boolean, field: string): void {
  if (typeof(d) !== 'number' && (!nullable || (nullable && d !== null && d !== undefined))) {
    errorHelper(field, d, "number", nullable);
  }
}
function checkBoolean(d: any, nullable: boolean, field: string): void {
  if (typeof(d) !== 'boolean' && (!nullable || (nullable && d !== null && d !== undefined))) {
    errorHelper(field, d, "boolean", nullable);
  }
}
function checkString(d: any, nullable: boolean, field: string): void {
  if (typeof(d) !== 'string' && (!nullable || (nullable && d !== null && d !== undefined))) {
    errorHelper(field, d, "string", nullable);
  }
}
function checkNull(d: any, field: string): void {
  if (d !== null && d !== undefined) {
    errorHelper(field, d, "null or undefined", false);
  }
}
function errorHelper(field: string, d: any, type: string, nullable: boolean): never {
  if (nullable) {
    type += ", null, or undefined";
  }
  throw new TypeError('Expected ' + type + " at " + field + " but found:\n" + JSON.stringify(d) + "\n\nFull object:\n" + JSON.stringify(obj));
}
