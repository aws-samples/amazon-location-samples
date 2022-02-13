import { useState, useEffect, useRef } from 'react';
import { Geo, Hub } from 'aws-amplify';
import { LocationClient, GetMapStyleDescriptorCommand } from '@aws-sdk/client-location';

// List of available languages for ESRI styles
const esriLangs = new Map([
  ['Local', '_name_local'],
  ['Global', '_name_global'],
  ['Arabic', '_name_ar'],
  ['Bosnian', '_name_bs'],
  ['Catalan', '_name_ca'],
  ['Chinese (Hong Kong)', '_name_zh_h'],
  ['Chinese (Modern)', '_name_zh_s'],
  ['Chinese (Taiwan)', '_name_zh_t'],
  ['Croatian', '_name_hr'],
  ['Czech', '_name_cs'],
  ['Danish', '_name_da'],
  ['Dutch', '_name_nl'],
  ['English', '_name_en'],
  ['Estonian', '_name_et'],
  ['Finnish', '_name_fi'],
  ['French', '_name_fr'],
  ['German', '_name_de'],
  ['Greek', '_name_el'],
  ['Hebrew', '_name_he'],
  ['Hindi', '_name_hi'],
  ['Hungarian', '_name_hu'],
  ['Indonesian', '_name_id'],
  ['Italian', '_name_it'],
  ['Japanese', '_name_ja'],
  ['Korean', '_name_ko'],
  ['Latvian', '_name_lv'],
  ['Lithuanian', '_name_lt'],
  ['Norwegian', '_name_no'],
  ['Polish', '_name_pl'],
  ['Portuguese (Brazil)', '_name_pt_b'],
  ['Portuguese (Portugal)', '_name_pt_p'],
  ['Romanian', '_name_ro'],
  ['Russian', '_name_ru'],
  ['Serbian', '_name_sr'],
  ['Slovak', '_name_sk'],
  ['Slovenian', '_name_sl'],
  ['Spanish', '_name_es'],
  ['Swedish', '_name_sv'],
  ['Thai', '_name_th'],
  ['Turkish', '_name_tr'],
  ['Vietnamese', '_name_vi'],
  ['Ukranian', '_name_uk'],
]);

// List of available languages for HERE style
const hereLangs = new Map([
  ['Default', 'name'],
  ['Short', 'name:short'],
  ['Arabic', 'name:ar'],
  ['Belarusian', 'name:be'],
  ['Bulgarian', 'name:bg'],
  ['Bosnian', 'name:bs'],
  ['Catalan', 'name:ca'],
  ['Czech', 'name:cs'],
  ['Welsh', 'name:cy'],
  ['Danish', 'name:da'],
  ['German', 'name:de'],
  ['Greek', 'name:el'],
  ['English', 'name:en'],
  ['Spanish', 'name:es'],
  ['Estonian', 'name:et'],
  ['Basque', 'name:eu'],
  ['Finnish', 'name:fi'],
  ['Faroese', 'name:fo'],
  ['French', 'name:fr'],
  ['Irish', 'name:ga'],
  ['Galician', 'name:gl'],
  ['Hindi', 'name:hi'],
  ['Croatian', 'name:hr'],
  ['Hungarian', 'name:hu'],
  ['Indonesian', 'name:id'],
  ['Icelandic', 'name:is'],
  ['Italian', 'name:it'],
  ['Japanese', 'name:ja'],
  ['Kazakh', 'name:kk'],
  ['Korean', 'name:ko'],
  ['Lithuanian', 'name:lt'],
  ['Latvian', 'name:lv'],
  ['Malayalam', 'name:mk'],
  ['Maltese', 'name:mt'],
  ['Dutch', 'name:nl'],
  ['Norwegian', 'name:no'],
  ['Polish', 'name:pl'],
  ['Portuguese', 'name:pt'],
  ['Romanian', 'name:ro'],
  ['Russian', 'name:ru'],
  ['Slovak', 'name:sk'],
  ['Slovenian', 'name:sl'],
  ['Albanian', 'name:sq'],
  ['Serbian', 'name:sr'],
  ['Swedish', 'name:sv'],
  ['Thai', 'name:th'],
  ['Turkish', 'name:tr'],
  ['Ukrainian', 'name:uk'],
  ['Chinese', 'name:zh'],
  ['Chinese (Hant)', 'name:zh-Hant']
]);

// React hook for getting the style descriptor and applying the language using the appropriate transformer based on style
const useLocalizedStyleDescriptor = (amplifyMapLibre, language) => {
  const locationClient = useRef();
  const languagesList = useRef();
  const languageSelected = useRef();
  const textEncoder = useRef(new TextDecoder("utf-8"));
  const [styleDescriptor, setstyleDescriptor] = useState();

  useEffect(() => {
    const getTracerLocations = async () => {
      if (amplifyMapLibre) {
        // If the transformer is ready, create a new LocationClient instance if one doesn't exist
        if (!locationClient.current) {
          // create a new LocationClient instance and save it in a ref
          // so it persists re-renders and takes care of renewing the AWS credentials
          locationClient.current = new LocationClient({
            region: (Geo.getDefaultMap()).region,
            credentials: amplifyMapLibre.credentials,
          });
        }
        if (languageSelected.current !== language) {
          try {
            const res = await locationClient.current.send(new GetMapStyleDescriptorCommand({
              MapName: Geo.getDefaultMap().mapName,
            }));
            if (res.Blob.length === 0) {
              throw new Error("No style descriptor found");
            }
            const styleDescriptorJson = JSON.parse(textEncoder.current.decode(res.Blob));
            if (Geo.getDefaultMap().style.toUpperCase().indexOf('ESRI') > -1) {
              languagesList.current = esriLangs;
            } else {
              languagesList.current = hereLangs;
            }
            styleDescriptorJson.layers = styleDescriptorJson.layers.map((layer) => {
              if (
                layer.layout &&
                layer.layout["text-field"] &&
                ["{_name_global}", "{_name}"].includes(layer.layout["text-field"])
              ) {
                return {
                  ...layer,
                  layout: {
                    ...layer.layout,
                    "text-field": [
                      "coalesce",
                      ["get", language],
                      ["get", layer.layout["text-field"].replace(/[{}]/g, "")]
                    ]
                  }
                };
              }

              return layer;
            });
            languageSelected.current = language;
            setstyleDescriptor(styleDescriptorJson);
          } catch (error) {
            console.error('Unable to get map\'s style descriptor', error);
            Hub.dispatch('errors', {
              data: `Unable to get Map's style descriptor from Amazon Location Service.
              Try refreshing the page, if the error persists check the browser console for more details`
            });
          }
        }
      }
    }

    getTracerLocations();
  }, [styleDescriptor, amplifyMapLibre, language]);

  return [styleDescriptor, languagesList.current];
};

export default useLocalizedStyleDescriptor;