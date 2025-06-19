import { Fragment, h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import habitat from 'preact-habitat';
import { InfoPopup } from 'jsx/popup';
import MorphAnalysis from 'jsx/morphology';
import {LemmaSearch, RootSearch} from 'jsx/lemmasearch';

// Helpr functions

function toArabicNumerals(str) {
  const arabicDigits = ("٠١٢٣٤٥٦٧٨٩").split('');
  return str.replace(/\d/g, (digit) => arabicDigits[parseInt(digit)]);
}

function rubSummaryText(rubNumber) {
  const juz = Math.ceil(rubNumber / 8);
  const percent = ((rubNumber - 1) / 240 * 100).toFixed(1);
  const part = (rubNumber - 1) % 8;
  const labels = ['Beginning', '1/8', '1/4', '3/8', '1/2', '5/8', '3/4', '7/8'];
  const label = labels[part];

  return (
    <Fragment>
      <div><strong>Rub el-Hizb {rubNumber}/240</strong></div>
      <div><small>{label} of Juz {juz}</small></div>
      <div><small>{percent}% through Quran</small></div>
    </Fragment>
  );
}

function sajdahSummaryText(sajdahNumber) {
  // const mandatory = [10, 12, 13, 15].includes(sajdahNumber);
  return (
    <Fragment>
      <div><strong>Sajdah {sajdahNumber}/15</strong></div>
      <div><small>
        This symbol indicates a <br/>
        verse of <em> sajdat al-tilāwah </em> <br/>
        (prostration of recitation).
      </small></div>
    </Fragment>
  );
}

// Main VerseText Component

function VerseText({ surah_data, verse_number, tokens }) {
  const [location, setLocation] = useState(null);

  const rubelhizb = surah_data.rub_marker[verse_number] ?? null;
  const sajdah = surah_data.sajdah_marker[verse_number] ?? null;

  const components = {
    "MOR": MorphAnalysis,
    "LEM": LemmaSearch,
    "ROO": RootSearch
  };

  const [selectedKey, setSelectedKey] = useState("MOR");
  const SelectedComponent = components[selectedKey];

  return (
    <Fragment>
      {/* Verse Text */}
      <div class="verse-text" dir="rtl" lang="ar">

        {/* Rub El Hizb */}
        {rubelhizb && 
          <InfoPopup popupMessage={rubSummaryText(rubelhizb)}>
            {({ toggle, visible }) => (
              <span onClick={toggle} class={visible ? 'highlighted' : ''}>
                ۞
              </span>
            )}
          </InfoPopup>
        }

        {/* Clickable Words */}
        {tokens.map((token, index) => {
          const tokenId = `${surah_data.surah_number}:${verse_number}:${index + 1}`;
          return (
            <span
              key={tokenId}
              onClick={() => setLocation(location == tokenId ? null : tokenId)}
              className={location == tokenId ? "highlighted" : ""}>
              {token}
            </span>
          );
        })}

        {/* Sajdah */}
        {sajdah && 
          <InfoPopup popupMessage={sajdahSummaryText(sajdah)}>
            {({ toggle, visible }) => (
              <span onClick={toggle} class={visible ? 'highlighted' : ''}>
                ۩
              </span>
            )}
          </InfoPopup>
        }

        {/* Arabic Verse Number */}
        <InfoPopup popupMessage={<strong>{`(${verse_number})`}</strong>}>
          {({ toggle, visible }) => (
            <span onClick={toggle} class={visible ? 'highlighted' : ''}>
              {toArabicNumerals(String(verse_number))}
            </span>
          )}
        </InfoPopup>

      </div>

      {/* Component Popup */}
      {location && (
        <div class="popup-container">

          {/* Sidebar Buttons */}
          <div class="popup-sidebar">

            {/* Close Button */}
            <button onClick={() => setLocation(null)}>×</button>

            {/* Component Buttons */}
            {Object.keys(components).map(key => (
              <button 
                onClick={() => setSelectedKey(key)}
                class={key === selectedKey ? "active" : ""}
              >
                <small>{key}</small> 
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div class="popup-content">
            <SelectedComponent location={location}/>
          </div>

        </div>
      )}

    </Fragment>
  );
}

export default (() => {
  // Mount the VerseText Component on Import
  habitat(VerseText).render({selector:'.verse-text-mount', clean:true});
})();
