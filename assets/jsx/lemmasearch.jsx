import { h, Fragment } from 'preact';
import { AsyncFetchData } from './fetchdata';

function SimilarWordSegment({ tokens, highlightedTokenNumber, 
	highlightedTokenLemma, firstTokenIncluded, lastTokenIncluded }) {

	const highlightedToken = tokens.find(t => t.location.tokenNumber === highlightedTokenNumber);
	const { chapterNumber, verseNumber, tokenNumber } = highlightedToken?.location || {};

	return(
	<Fragment>
		{/* As... */}
		<div >
			{highlightedTokenLemma && (
				<Fragment>
					<span style={{textDecoration:'underline'}}>As the word</span>
					<span class="highlighted arabic_word">
						{' '}{highlightedTokenLemma}{' '}
					</span>
				</Fragment>
			)}
			{highlightedToken && (
				<span style={{textDecoration:'underline'}}>
				 in {chapterNumber}:{verseNumber}, word {tokenNumber}:
				</span>
			)}
		</div>
		{/* Arabic verse segment */}
		<div class="arabic_word">
			{!firstTokenIncluded && '... '}
			{tokens.map((token, i) => {
				if (token.location.tokenNumber === highlightedTokenNumber) {
					return(<span class='highlighted'>{token.arabic}{' '}</span>)
				}
				return(<span>{token.arabic}{' '}</span>)
			})}
			{!lastTokenIncluded && '... '}
		</div>
		{/* Word by word translation of segment */}
		<div>
			{!firstTokenIncluded && '... '}
			{tokens.map((token, i) => {
				if (token.location.tokenNumber === highlightedTokenNumber) {
					return(<span class='highlighted'>{token.translation}{' '}</span>)
				}
				return(<span>{token.translation}{' '}</span>)
			})}
			{!lastTokenIncluded && '... '}
		</div>
	</Fragment>
	)
}

function LemmaSearch({ location }) {
	const _FETCH_DOMAIN = 'https://quran-word-api-991bb13e306b.herokuapp.com';

	return (
		<AsyncFetchData url={`${_FETCH_DOMAIN}/morphology/lemmasearch?location=${location}`}>
			{(data) => {
				const { search, matchingSegments } = data;

				const titleText = 
					matchingSegments == null ? 'is unique to this verse!' :
					matchingSegments[1] == null ? 'also appears in this verse:' :
					'also appears in these verses:'; 

				return (
				<div class="search_segments">
					<big>
						<span>The word </span>
						<span class="highlighted arabic_word">{search}</span>
						<span> {titleText}</span>
					</big>
						
					{matchingSegments &&
					matchingSegments.map((segment, idx) => (
						<Fragment>
							<hr/>
							<SimilarWordSegment key={idx} {...segment}/>
						</Fragment>
					))}

				</div>
				)
			}}
		</AsyncFetchData>
	);
}

function RootSearch({ location }) {
	const _FETCH_DOMAIN = 'https://quran-word-api-991bb13e306b.herokuapp.com';

	return (
		<AsyncFetchData url={`${_FETCH_DOMAIN}/morphology/rootsearch?location=${location}`}>
			{(data) => {
				const { search, matchingSegments } = data;

				if (!search) return (
					<div class="search_segments">
						<big>This word does not have a root.</big>
					</div>
				)

				const titleText = 
					matchingSegments == null ? 'is unique to this word form!' :
					matchingSegments[1] == null ? 'also takes this form:' :
					'also takes these forms:'; 

				return (
				<div class="search_segments">
					<big>
						<span>The root </span>
						<span class="highlighted arabic_word">{search.split('').join(' ')}</span>
						<span> {titleText}</span>
					</big>
						
					{matchingSegments &&
					matchingSegments.map((segment, idx) => (
						<Fragment>
							<hr style={{marginBottom:'0px'}}/>
							<SimilarWordSegment key={idx} {...segment}/>
						</Fragment>
					))}

				</div>
				)
			}}
		</AsyncFetchData>
	);
}

export {LemmaSearch, RootSearch};
