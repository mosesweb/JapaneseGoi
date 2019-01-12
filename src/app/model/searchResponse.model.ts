export interface searchResponse {
    meta: Meta;
    data?: (DataEntity)[] | null;
  }
  export interface Meta {
    status: number;
  }
  export interface DataEntity {
    is_common: boolean;
    tags?: (string | null)[] | null;
    japanese?: (JapaneseEntity)[] | null;
    senses?: (SensesEntity)[] | null;
    attribution: Attribution;    
}
   
  export interface JapaneseEntity {
    word?: string | null;
    reading: string;
  }
  export interface SensesEntity {
    english_definitions?: (string)[] | null;
    parts_of_speech?: (string | null)[] | null;
    links?: (LinksEntity | null)[] | null;
    tags?: (string | null)[] | null;
    restrictions?: (null)[] | null;
    see_also?: (string | null)[] | null;
    antonyms?: (null)[] | null;
    source?: (null)[] | null;
    info?: (string | null)[] | null;
    sentences?: (null)[] | null;
  }
  export interface LinksEntity {
    text: string;
    url: string;
  }
  export interface Attribution {
    jmdict: boolean;
    jmnedict: boolean;
    dbpedia: boolean | string;
  }
  