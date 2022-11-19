import { Linking } from 'react-native';
import isUrl from 'is-url';

/**
 * Returns a sanitized url
 *
 * @param url - String corresponding to url
 * @param defaultProtocol - Protocol string to append to URLs that have none
 * @returns - String corresponding to sanitized input depending if it's a search or url
 */
export const sanitizeUrl = (url: string, defaultProtocol = 'https://') => {
  const hasProtocol = /^[a-z]*:\/\//.test(url);
  const sanitizedURL = hasProtocol ? url : `${defaultProtocol}${url}`;
  return sanitizedURL;
}

/**
 * Returns a sanitized url, which could be a search engine url if
 * a keyword is detected instead of a url
 *
 * @param input - String corresponding to url input
 * @param searchEngine - Protocol string to append to URLs that have none
 * @param defaultProtocol - Protocol string to append to URLs that have none
 * @returns - String corresponding to sanitized input depending if it's a search or url
 */
export default function onUrlSubmit(
  input: string,
  searchEngine = 'Google',
  defaultProtocol = 'https://',
) {
  //Check if it's a url or a keyword
  const regEx = new RegExp(
    /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!&',;=.+]+$/g,
  );
  if (!isUrl(input) && !regEx.test(input)) {
    // Add exception for localhost
    if (
      !input.startsWith('http://localhost') &&
      !input.startsWith('localhost')
    ) {
      // In case of keywords we default to google search
      let searchUrl = 'https://www.google.com/search?q=' + escape(input);
      if (searchEngine === 'DuckDuckGo') {
        searchUrl = 'https://duckduckgo.com/?q=' + escape(input);
      }
      return searchUrl;
    }
  }
  return sanitizeUrl(input, defaultProtocol);
}

/**
 * Return an URL object from url string
 *
 * @param url - String containing url
 * @returns - URL object
 */
export function getUrlObj(url: string) {
  return new URL(url);
}

/**
 * Return host from url string
 *
 * @param url - String containing url
 * @param defaultProtocol
 * @returns - String corresponding to host
 */
export function getHost(url: string, defaultProtocol = 'https://') {
  const isValidUrl = isUrl(url);
  if (!isValidUrl) return url;

  const sanitizedUrl = sanitizeUrl(url, defaultProtocol);
  const { hostname } = getUrlObj(sanitizedUrl);

  const result = hostname === '' ? url : hostname;

  return result;
}

/**
 * This function verify if the hostname is a TLD
 * @param hostname - Represents the hostname of the URL
 * @param error - Represents the error of handleIpfsContent
 * @returns - True if its a TLD, false if it's not
 */
export const isTLD = (hostname: string, error: any) =>
  (hostname.slice(-4) !== '.eth' &&
    error.toString().indexOf('is not standard') !== -1) ||
  hostname.slice(-4) === '.xyz' ||
  hostname.slice(-5) === '.test';

export const protocolWhitelist = ['about:', 'http:', 'https:'];

export const getAlertMessage = (
  protocol: string,
  i18nService: (id: string) => void,
) => {
  switch (protocol) {
    case 'tel:':
      return i18nService('browser.protocol_alerts.tel');
    case 'mailto:':
      return i18nService('browser.protocol_alerts.mailto');
    default:
      return i18nService('browser.protocol_alerts.generic');
  }
};

export const allowLinkOpen = (url: string) =>
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      }
      console.warn(`Can't open url: ${url}`);
      return null;
    })
    .catch((e) => {
      console.warn(`Error opening URL: ${e}`);
    });