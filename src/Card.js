
const Card = ({ campaign, adset, creative, spend, impressions, clicks }) => {

    return (
        <div style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <h3>{campaign}</h3>
            <p><b>Adset:</b> {adset}</p>
            <p><b>Creative:</b> {creative}</p>
            <p><b>Spend:</b> ${spend}</p>
            <p><b>Impressions:</b> {impressions}</p>
            <p><b>Clicks:</b> {clicks}</p>
        </div>
    )

}

export default Card