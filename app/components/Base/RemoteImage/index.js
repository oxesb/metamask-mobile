import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  ViewPropTypes,
  View,
  StyleSheet,
  PixelRatio,
} from 'react-native';
import FadeIn from 'react-native-fade-in-image';
// eslint-disable-next-line import/default
import resolveAssetSource from 'react-native/Libraries/Image/resolveAssetSource';
import { SvgUri } from 'react-native-svg';
import isUrl from 'is-url';
import ComponentErrorBoundary from '../../UI/ComponentErrorBoundary';
import useIpfsGateway from '../../hooks/useIpfsGateway';
import { util } from '@metamask/controllers';
import Identicon from '../../UI/Identicon';
import { WebView } from 'react-native-webview';
import { base64Decode } from '../../../util/general';

const createStyles = () =>
  StyleSheet.create({
    svgContainer: {
      overflow: 'hidden',
    },
  });

const RemoteImage = (props) => {
  const [error, setError] = useState(undefined);
  // Avoid using this component with animated SVG
  const source = resolveAssetSource(props.source);
  const isImageUrl = isUrl(props?.source?.uri);
  const ipfsGateway = useIpfsGateway();
  const styles = createStyles();
  const resolvedIpfsUrl = useMemo(() => {
    try {
      const url = new URL(props.source.uri);
      if (url.protocol !== 'ipfs:') return false;
      const ipfsUrl = util.getFormattedIpfsUrl(
        ipfsGateway,
        props.source.uri,
        false,
      );
      return ipfsUrl;
    } catch {
      return false;
    }
  }, [props.source.uri, ipfsGateway]);

  const uri = resolvedIpfsUrl || source.uri;

  const onError = ({ nativeEvent: { error } }) => setError(error);

  if (error && props.address) {
    return <Identicon address={props.address} customStyle={props.style} />;
  }

  if (uri && uri.includes('data:image/svg+xml;base64')) {
    const xmlSvg = base64Decode(uri.split('data:image/svg+xml;base64,')[1]);

    if (xmlSvg.includes('<style>')) {
      const filterStyles = props.style.filter(
        (a) => a && (a.width || a.height),
      )[0];

      const firstSvgTag = '<svg';
      const indexOfFirstSvgTag = xmlSvg.indexOf(firstSvgTag);

      const firstStr = xmlSvg.slice(0, indexOfFirstSvgTag);
      const lastStr = xmlSvg.slice(
        indexOfFirstSvgTag + firstSvgTag.length,
        xmlSvg.length,
      );
      // Adding the styles to the svg code to fit on the webview
      const finalSvg =
        firstStr +
        `<svg ${
          filterStyles?.width
            ? `width="${filterStyles.width * PixelRatio.get()}"`
            : ''
        } ${
          filterStyles?.height
            ? `height="${filterStyles.height * PixelRatio.get()}"`
            : ''
        }` +
        lastStr;

      const htmlPage = `<html><head>
     <script type="text/javascript" src="https://unpkg.com/dompurify@2.3.10/dist/purify.js"></script>
   </head>
   <body>
     <div id="render-svg"></div>
     <script>
       var svg = ${JSON.stringify(finalSvg)};
       const clean = DOMPurify.sanitize(svg,{USE_PROFILES: {svg: true, svgFilters: true},ADD_TAGS: ['animate'], FORBID_ATTR: ['style']});
       console.log("clean", clean);
       document.getElementById("render-svg").innerHTML = clean;
     </script>
   </body>
   </html>`;

      return (
        <FadeIn>
          <WebView
            {...props}
            source={{ html: htmlPage }}
            javaScriptCanOpenWindowsAutomatically={false}
            domStorageEnabled={false}
          />
        </FadeIn>
      );
    }
  }

  if (
    source &&
    source.uri &&
    source.uri.match('.svg') &&
    (isImageUrl || resolvedIpfsUrl)
  ) {
    const style = props.style || {};
    if (source.__packager_asset && typeof style !== 'number') {
      if (!style.width) {
        style.width = source.width;
      }
      if (!style.height) {
        style.height = source.height;
      }
    }

    return (
      <ComponentErrorBoundary
        onError={props.onError}
        componentLabel="RemoteImage-SVG"
      >
        <View style={[...style, styles.svgContainer]}>
          <SvgUri {...props} uri={uri} width={'100%'} height={'100%'} />
        </View>
      </ComponentErrorBoundary>
    );
  }

  if (props.fadeIn) {
    return (
      <FadeIn placeholderStyle={props.placeholderStyle}>
        <Image {...props} source={{ uri }} onError={onError} />
      </FadeIn>
    );
  }
  return <Image {...props} source={{ uri }} onError={onError} />;
};

RemoteImage.propTypes = {
  /**
   * Flag that determines the fade in behavior
   */
  fadeIn: PropTypes.bool,
  /**
   * Source of the image
   */
  source: PropTypes.any,
  /**
   * Style for the image
   */
  style: ViewPropTypes.style,
  /**
   * Style for the placeholder (used for fadeIn)
   */
  placeholderStyle: ViewPropTypes.style,
  /**
   * Called when there is an error
   */
  onError: PropTypes.func,
  /**
   * This is set if we know that an image is remote
   */
  isUrl: PropTypes.bool,
  /**
   * Token address
   */
  address: PropTypes.string,
};

export default RemoteImage;
