import { Fragment, h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import habitat from 'preact-habitat';

// See data/SaheehInternational.json for the format of the translation

function Translation({t,f}) {
	const [footnoteID, setFootnoteID] = useState(null);
	const numberOfFootnotes = Object.keys(f).length;

	return (
		<Fragment>
			{/* Translation Text & Footnotes */}
			<div class="verse-translation">
				<p>{t.map((text,idx) => {
					// Even index: Text, Odd index: Footnote
					// Render Text
					if (idx % 2 === 0) {
						return (<span>{text}</span>);
					}
					// Render Clickable Footnote          
					return (
						<sup onClick={() => setFootnoteID((idx+1)/2)}>
							{(idx+1)/2}
						</sup>
					)
				})}</p>
			</div>
			{/* Footnote text in a Popup */}
			{footnoteID && (
			<div class='footnote-box'>
				{numberOfFootnotes > 1 && (
				<div class='footnote-navigation'>

					<div>
						{footnoteID > 1 && (
						<div class='footnote-arrow' onClick={() => setFootnoteID(footnoteID-1)}>
							←
						</div>
						)}
					</div>

					<div>
						{footnoteID}/{numberOfFootnotes}
					</div>

					<div>
						{footnoteID < numberOfFootnotes && (
						<div class='footnote-arrow' onClick={() => setFootnoteID(footnoteID+1)}>
							→
						</div>
						)}
					</div>

				</div>
				)}

				<div>
					{f[footnoteID]}
				</div>

				<div onClick={() => setFootnoteID(null)} class="footnote-close"> × </div>

			</div>
			)}
		</Fragment>
	);
}

export default (() => {
	// Mount the Translation component
  habitat(Translation).render({selector:'.verse-translation-mount', clean:true});
})();
