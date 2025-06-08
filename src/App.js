import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Card from './Card';

function App() {
  const [advertisements, setAdvertisements] = useState([])
  const [displayAds, setDisplayAds] = useState([])
  const [filteredAds, setFilteredAds] = useState([])
  const [sortState, setSortState] = useState('none')
  const [searchTerm, setSearchTerm] = useState('')




  const normalizeAd = (rawAdObj) => {
    const rawAdset =
      rawAdObj.media_buy_name ||
      rawAdObj.ad_group ||
      rawAdObj.ad_squad_name ||
      rawAdObj.utm_medium;
    const firstWordAdset = rawAdset ? rawAdset.split(' ')[0] : null;
    // normalize adset, split first word so that ads in the same set with slightly different wording are given the correct google results
    const rawCreative =
      rawAdObj.ad_name ||
      rawAdObj.image_name ||
      rawAdObj.creative_name ||
      rawAdObj.utm_content;

    const firstWordCreative = rawCreative ? rawCreative.split(' ')[0] : null;
    // normalize creative, split first word so that ads in the same set with slightly different wording are given the correct google results



    return {
      campaign: rawAdObj.campaign_name || rawAdObj.utm_campaign || rawAdObj.campaign,
      adset: firstWordAdset,
      creative: firstWordCreative,
      spend: rawAdObj.spend ?? rawAdObj.cost ?? 0,
      impressions: rawAdObj.impressions ?? 0,
      clicks: rawAdObj.clicks ?? rawAdObj.post_clicks ?? 0,
      results: rawAdObj.results ?? 0,
    }
  }
  // Use this helper function to normalize ad objects from different platforms


  useEffect(() => {
    fetch('http://localhost:3000/fakeDataSet')
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then((rawAdData) => {
        const allAds = [
          ...(rawAdData.facebook_ads || []),
          ...(rawAdData.twitter_ads || []),
          ...(rawAdData.snapchat_ads || [])

        ]
        const normalizedList = allAds.map(normalizeAd);
        // create an array without google analytics, map array to normalize data

        normalizedList.forEach(ad => {
          const match = rawAdData.google_analytics.find(google =>
            google.utm_campaign === ad.campaign &&
            google.utm_medium.split(' ')[0] === ad.adset &&
            google.utm_content.split(' ')[0] === ad.creative
          );
          if (match) {
            ad.results = match.results;
          }
        });
        // Go through each ad and assign results from matching google analytics 


        const uniqueNormalized = normalizedList.filter((ad, index, self) => {
          return index === self.findIndex(t => (
            t.campaign === ad.campaign &&
            t.adset === ad.adset &&
            t.creative === ad.creative
          ))
        })
        // remove duplicates from normalized list
        setAdvertisements(uniqueNormalized);
        setDisplayAds(uniqueNormalized)
        setFilteredAds(uniqueNormalized)
        // set advertisements state to normalized, unique list
      })
      .catch((errObj) => {
        console.error('Error:', errObj);
      });
  }, []);

  const toggleSort = () => {
    let nextState
    if (sortState === 'none') nextState = 'desc'
    else if (sortState === 'desc') nextState = 'asc'
    else nextState = 'none'

    setSortState(nextState)
    applySort(filteredAds, nextState)

  }
  // Change sort state to next , use apply sort helper function to filtered ads list

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = advertisements.filter(ad =>
      ad.campaign.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredAds(filtered)
    applySort(filtered, sortState)

  }
  // Use input from search bar, normalizing for upper case letters to filter for cards with matching campaign name

  const applySort = (ads, state) => {
    if (state === 'none') {
      setDisplayAds(ads);
    } else {
      const sorted = [...ads].sort((a, b) =>
        state === 'desc' ? b.spend - a.spend : a.spend - b.spend
      );
      setDisplayAds(sorted);
    }
  }
  // Use this function to sort by ad spend, depending on the sortState as well as the filtered list of ad


  return (
    <>
      <input
        type="text"
        placeholder="Search by campaign..."
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <button onClick={toggleSort}> Sort by Spend: {sortState === 'none' ? 'Off' : sortState === 'desc' ? 'Descending' : 'Ascending'} </button>
      <div className="App">
        {displayAds.map(ad => <Card key={`${ad.campaign}-${ad.adset}-${ad.creative}`} {...ad} />)}
      </div>
    </>
  );
}

export default App;


