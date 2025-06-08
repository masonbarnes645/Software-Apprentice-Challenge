import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Card from './Card';

function App() {
  const [advertisements, setAdvertisements] = useState([])

  const normalizeAd = (rawAdObj) => {
    return {
      campaign: rawAdObj.campaign_name || rawAdObj.utm_campaign || rawAdObj.campaign,
      adset: rawAdObj.media_buy_name || rawAdObj.ad_group || rawAdObj.ad_squad_name || rawAdObj.utm_medium,
      creative: rawAdObj.ad_name || rawAdObj.image_name || rawAdObj.creative_name || rawAdObj.utm_content,
      spend: rawAdObj.spend ?? rawAdObj.cost ?? 0,
      impressions: rawAdObj.impressions ?? 0,
      clicks: rawAdObj.clicks ?? rawAdObj.post_clicks ?? 0,
      results: rawAdObj.results ?? 0,
    }
  }
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
        const uniqueNormalized = normalizedList.filter((ad, index, self) => {
          return index === self.findIndex(t => (
            t.campaign === ad.campaign &&
            t.adset === ad.adset &&
            t.creative === ad.creative
        ))
      })
        setAdvertisements(uniqueNormalized);
      })
      .catch((errObj) => {
        console.error('Error:', errObj);
      });
  }, []);


  return (
    <div className="App">
      {advertisements.map(ad => <Card key={`${ad.campaign}-${ad.adset}-${ad.creative}`} {...ad} />)}
    </div>
  );
}

export default App;
