import {Relevance} from '../model/Relevance';
import {Visibility} from '../model/Visibility';

export class AppSettings {
  public static IDP_ENDPOINT = 'http://0.0.0.0:4004/idp/eval';
  public static SPECIFICATION_URL = 'assets/specification.idp';
  public static META_URL = 'assets/info.json';
  public static DEFAULT_VISIBILITY = Visibility.CORE;
  public static DEFAULT_RELEVANCE = Relevance.PROPAGATED;
  public static DEFAULT_TITLE = 'Untitled Configuration Problem';
  public static DEFAULT_TIMEOUT = 3;
}
