import { h } from 'preact';
import { AsyncFetchData } from './fetchdata';

function MorphAnalysis({ location }) {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const _FETCH_DOMAIN = 'https://quran-word-api-991bb13e306b.herokuapp.com';

  return (
    <AsyncFetchData url={`${_FETCH_DOMAIN}/morphology/word?location=${location}`}>
      {(data) => {
        const { translation, segments } = data;

        return (
          <div class="morph_analysis_box">
            <div class="morph_arabic_word">
              {segments.map((seg, idx) => (
                <span key={idx} seg_name={seg.name}>{seg.arabic}</span>
              ))}
            </div>
            <div class="morph_transliteration">
              {segments.map((seg, idx) => (
                <span key={idx} seg_name={seg.name}>{seg.phonetic}&zwnj;</span>
              ))}
            </div>
            <div class="morph_translation">
              {translation}
            </div>
            {segments.map((seg, idx) => (
              <div class="morph_description" key={idx}>
                <strong seg_name={seg.name}>• {capitalize(seg.name)}:&nbsp;</strong>
                {capitalize(seg.description)}
              </div>
            ))}
          </div>
        );
      }}
    </AsyncFetchData>
  );
}

export default MorphAnalysis;
